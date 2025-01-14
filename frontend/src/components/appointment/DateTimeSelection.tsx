import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useBookingAvailability } from "@/hooks/appointment/useBookingAvailability";
import type { DateSelectArg } from "@fullcalendar/core";
import { format, addMinutes } from "date-fns";
import "./_dateTimeSelection.scss";

interface DateTimeSelectionProps {
  onSelect: (date: Date, timeSlot: { start: Date; end: Date }) => void;
}

const DateTimeSelection = ({ onSelect }: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data: availability, isLoading } = useBookingAvailability();

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.start);
  };

  const generateTimeSlots = (startTime: Date, endTime: Date) => {
    const slots = [];
    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const slotEnd = addMinutes(currentTime, 30);
      slots.push({
        start: new Date(currentTime),
        end: slotEnd,
      });
      currentTime = slotEnd;
    }

    return slots;
  };

  const getAvailableTimeSlots = (date: Date) => {
    if (!availability) return [];

    const scheduleDay = availability.schedule.find((day) => {
      const scheduleDate = new Date(day.date);
      return (
        scheduleDate.getUTCFullYear() === date.getFullYear() &&
        scheduleDate.getUTCMonth() === date.getMonth() &&
        scheduleDate.getUTCDate() === date.getDate()
      );
    });

    if (!scheduleDay?.isWorkingDay || !scheduleDay.workHours) return [];

    const slots = [];
    let currentTime = new Date(scheduleDay.workHours.start);
    const endTime = new Date(scheduleDay.workHours.end);

    while (currentTime <= endTime) {
      slots.push({
        start: new Date(currentTime),
        end: new Date(
          new Date(currentTime).setMinutes(currentTime.getMinutes() + 30)
        ),
      });
      currentTime = new Date(
        currentTime.setMinutes(currentTime.getMinutes() + 30)
      );
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
                  onClick={() => onSelect(selectedDate, slot)}
                  className="time-slot-button"
                >
                  {format(slot.start, "h:mm a")}
                </button>
              ))
            ) : (
              <div className="no-slots-message">
                Barber is completly booked or unvailable.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
