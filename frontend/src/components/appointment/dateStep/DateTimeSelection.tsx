import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useBookingAvailability } from "@/hooks/appointment/useBookingAvailability";
import type { DateSelectArg } from "@fullcalendar/core";
import { format, isAfter, startOfDay } from "date-fns";
import "./_dateTimeSelection.scss";

interface DateTimeSelectionProps {
  onSelect: (date: Date, timeSlot: { start: Date; end: Date }) => void;
  isReschedule?: boolean;
}

interface BookedSlot {
  date: string;
}

const DateTimeSelection = ({
  onSelect,
  isReschedule = false,
}: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const { data: availability, isLoading } = useBookingAvailability();

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.start);
  };

  const isTimeSlotBooked = (
    selectedSlot: { start: Date },
    bookedSlots: BookedSlot[]
  ) => {
    const selectedTimeUTC = selectedSlot.start.toISOString();
    return bookedSlots.some(
      (bookedSlot) => bookedSlot.date === selectedTimeUTC
    );
  };

  const getAvailableTimeSlots = (date: Date) => {
    if (!availability) {
      return [];
    }

    const now = new Date();
    const selectedDateStart = startOfDay(date);
    const isToday =
      selectedDateStart.getDate() === now.getDate() &&
      selectedDateStart.getMonth() === now.getMonth() &&
      selectedDateStart.getFullYear() === now.getFullYear();

    const scheduleDay = availability.schedule.find((day) => {
      const scheduleDate = new Date(day.date);
      return (
        scheduleDate.getUTCFullYear() === date.getFullYear() &&
        scheduleDate.getUTCMonth() === date.getMonth() &&
        scheduleDate.getUTCDate() === date.getDate()
      );
    });

    if (!scheduleDay?.isWorkingDay || !scheduleDay.workHours) {
      return [];
    }

    const workStart = new Date(scheduleDay.workHours.start);
    const workEnd = new Date(scheduleDay.workHours.end);

    workStart.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    workEnd.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

    const slots = [];
    let currentTime = new Date(workStart);

    while (currentTime <= workEnd) {
      const slot = {
        start: new Date(currentTime),
        end: new Date(currentTime.getTime() + 30 * 60000),
      };

      const isSlotBooked = isTimeSlotBooked(slot, availability.bookedSlots);

      if ((!isToday || isAfter(slot.start, now)) && !isSlotBooked) {
        slots.push(slot);
      }

      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    return slots;
  };

  if (isLoading) return <div>Loading availability...</div>;

  return (
    <div className="date-time-selection">
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          select={handleDateSelect}
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          validRange={{
            start: new Date(),
            end: new Date(new Date().setMonth(new Date().getMonth() + 2)),
          }}
          selectConstraint={{
            start: "00:00",
            end: "24:00",
            dows:
              availability?.schedule
                .filter((day) => day.isWorkingDay)
                .map((day) => new Date(day.date).getDay()) || [],
          }}
        />
      </div>

      {selectedDate && (
        <div className="time-slots">
          <h3>Available Times for {format(selectedDate, "MMMM d, yyyy")}</h3>
          <div className="slots-grid">
            {getAvailableTimeSlots(selectedDate).length > 0 ? (
              getAvailableTimeSlots(selectedDate).map((slot, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isReschedule) {
                      setSelectedSlot(slot);
                      onSelect(selectedDate, slot);
                    } else {
                      onSelect(selectedDate, slot);
                    }
                  }}
                  className={`time-slot-button ${
                    isReschedule && selectedSlot === slot ? "selected" : ""
                  }`}
                >
                  {format(slot.start, "h:mm a")}
                </button>
              ))
            ) : (
              <div className="no-slots-message">
                Barber is completely booked or unavailable.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
