import { useState } from "react";
import {
  useAvailability,
  useSetupMonth,
  useUpdateDay,
} from "@hooks/useAvailability";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isPast,
  startOfDay,
  isToday,
} from "date-fns";
import { FaChevronLeft, FaChevronRight, FaClock } from "react-icons/fa";
import EditDayModal from "./EditDayModal";
import "./_adminAvailability.scss";

const AdminAvailability = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const { data: availability, isLoading } = useAvailability();
  const setupMonth = useSetupMonth();
  const updateDay = useUpdateDay();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const today = startOfDay(new Date());

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const handlePrevMonth = () => {
    setCurrentDate((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const handleDayClick = (date: Date) => {
    const startOfSelectedDay = startOfDay(date);
    // Only prevent selecting past dates
    if (!isPast(startOfSelectedDay) || isToday(startOfSelectedDay)) {
      setSelectedDay(date);
    }
  };

  const getDayAvailability = (date: Date) => {
    if (!availability?.schedule) return null;
    return availability.schedule.find(
      (day) => day.date.split("T")[0] === format(date, "yyyy-MM-dd")
    );
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="admin-availability">
      <div className="month-navigation">
        <button onClick={handlePrevMonth}>
          <FaChevronLeft />
        </button>
        <h2>{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={handleNextMonth}>
          <FaChevronRight />
        </button>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="days">
          {calendarDays.map((day) => {
            const dayAvailability = getDayAvailability(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isPastDate = isPast(startOfDay(day)) && !isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`day 
                  ${dayAvailability?.isWorkingDay ? "working" : ""} 
                  ${!isCurrentMonth ? "other-month" : ""}
                  ${isPastDate ? "past" : ""}
                  ${isToday(day) ? "today" : ""}
                `}
                onClick={() => {
                  if (isCurrentMonth && !isPastDate) {
                    handleDayClick(day);
                  }
                }}
              >
                <span className="date">{format(day, "d")}</span>
                {dayAvailability?.workHours && !isPastDate && (
                  <div className="hours">
                    <FaClock />
                    <span>
                      {format(
                        new Date(dayAvailability.workHours.start),
                        "h:mm a"
                      )}{" "}
                      -
                      {format(
                        new Date(dayAvailability.workHours.end),
                        "h:mm a"
                      )}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <EditDayModal
          date={selectedDay}
          availability={getDayAvailability(selectedDay)}
          onClose={() => setSelectedDay(null)}
          onSave={async (hours) => {
            try {
              await updateDay.mutateAsync({
                date: format(selectedDay, "yyyy-MM-dd"),
                dayData: hours,
              });
              setSelectedDay(null);
            } catch (error) {
              console.error("Failed to update availability:", error);
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminAvailability;
