import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useBookingAvailability } from "@/hooks/appointment/useBookingAvailability";
import type { DateSelectArg } from "@fullcalendar/core";
import { format, addMinutes, isBefore, isAfter, startOfDay } from "date-fns";
import "./_dateTimeSelection.scss";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface DateTimeSelectionProps {
  onSelect: (date: Date, timeSlot: { start: Date; end: Date }) => void;
}

const DateTimeSelection = ({ onSelect }: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data: availability, isLoading } = useBookingAvailability();

  const { data: bookedSlots } = useQuery({
    queryKey: ["bookedSlots"],
    queryFn: async () => {
      const { data } = await axios.get("/api/availability/booked-slots");
      return data;
    },
  });

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

    // Set the work hours to today's date for proper comparison
    workStart.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    workEnd.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

    const slots = [];
    let currentTime = new Date(workStart);

    while (currentTime <= workEnd) {
      const slot = {
        start: new Date(currentTime),
        end: new Date(currentTime.getTime() + 30 * 60000),
      };

      if (!isToday || isAfter(slot.start, now)) {
        slots.push(slot);
      }

      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    return slots;
  };

  const filterAvailableTimeSlots = (slots: TimeSlot[], selectedDate: Date) => {
    const now = new Date();

    return slots.filter((slot) => {
      // Convert slot.start string to Date if it isn't already
      const slotStartTime = new Date(slot.start);

      // Always filter out any time slots that are in the past
      return isAfter(slotStartTime, now);
    });
  };

  const renderTimeSlots = () => {
    if (!selectedDate || !availability) return null;

    const availableSlots = filterAvailableTimeSlots(
      availability.timeSlots,
      selectedDate
    );

    return (
      <div className="time-slots-grid">
        {availableSlots.map((slot) => (
          <button
            key={slot.start.toString()}
            className={`time-slot-button ${
              selectedTimeSlot?.start === slot.start ? "selected" : ""
            }`}
            onClick={() => handleTimeSelect(slot)}
          >
            {format(new Date(slot.start), "h:mm a")}
          </button>
        ))}
        {availableSlots.length === 0 && (
          <p className="no-slots-message">
            {isAfter(startOfDay(selectedDate), startOfDay(new Date()))
              ? "No available time slots for this date."
              : "This date has passed. Please select a future date."}
          </p>
        )}
      </div>
    );
  };

  const isTimeSlotBooked = (
    selectedSlot: { start: Date },
    bookedSlots: any[]
  ) => {
    // Convert selected slot to UTC ISO string
    const selectedTimeUTC = selectedSlot.start.toISOString();

    const isBooked = bookedSlots.some(
      (bookedSlot) => bookedSlot.date === selectedTimeUTC
    );

    return isBooked;
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
                    isTimeSlotBooked(slot, availability.bookedSlots);

                    onSelect(selectedDate, slot);
                  }}
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
