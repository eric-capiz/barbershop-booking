import { useState } from "react";
import { useAvailability } from "@hooks/useAvailability";
import { useAvailabilityStore } from "@/store/availabilityStore";
import { format } from "date-fns";
import "./_adminAvailability.scss";

const AdminAvailability = () => {
  const { data: availability, isLoading } = useAvailability();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;

  const currentMonth = availability?.currentMonth || {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    isSet: false,
  };

  return (
    <div className="admin-availability">
      <div className="admin-availability__header">
        <div className="month-info">
          <h2>
            {format(
              new Date(currentMonth.year, currentMonth.month - 1),
              "MMMM yyyy"
            )}
          </h2>
          {!currentMonth.isSet && (
            <button className="btn-primary">Set Up Month Schedule</button>
          )}
        </div>
      </div>

      {currentMonth.isSet ? (
        <div className="admin-availability__content">
          <div className="days-grid">
            {availability?.schedule.map((day) => (
              <div
                key={day.date}
                className={`day-card ${
                  day.isWorkingDay ? "working" : "non-working"
                } ${selectedDay === day.date ? "selected" : ""}`}
                onClick={() => setSelectedDay(day.date)}
              >
                <div className="day-header">
                  <span className="date">
                    {format(new Date(day.date), "d")}
                  </span>
                  <span className="day-name">
                    {format(new Date(day.date), "EEE")}
                  </span>
                </div>
                {day.isWorkingDay && day.workHours && (
                  <div className="hours">
                    <span>
                      {format(new Date(day.workHours.start), "h:mm a")}
                    </span>
                    <span>-</span>
                    <span>{format(new Date(day.workHours.end), "h:mm a")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedDay && (
            <div className="day-detail">
              <h3>Set Working Hours</h3>
              {/* Time selection and management will go here */}
            </div>
          )}
        </div>
      ) : (
        <div className="setup-prompt">
          <p>
            Please set up the schedule for{" "}
            {format(
              new Date(currentMonth.year, currentMonth.month - 1),
              "MMMM yyyy"
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminAvailability;
