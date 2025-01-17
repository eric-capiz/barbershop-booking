import { useState } from "react";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { useAppointment } from "@/hooks/appointment/useAppointment";
import Modal from "@/components/Modal/Modal";
import DateTimeSelection from "@/components/appointment/dateStep/DateTimeSelection";
import "./_userAppointments.scss";

type TabType = "pending" | "upcoming" | "past";

const UserAppointments = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [selectedDateTime, setSelectedDateTime] = useState<{
    date: Date;
    timeSlot: { start: Date; end: Date };
  } | null>(null);

  const {
    userAppointments,
    isLoadingUserAppointments,
    updateAppointmentStatus,
    rescheduleAppointment,
  } = useAppointment();

  const handleCancel = (appointmentId: string) => {
    updateAppointmentStatus.mutate({
      appointmentId,
      status: "cancelled",
    });
  };

  const handleDateTimeSelect = (
    date: Date,
    timeSlot: { start: Date; end: Date }
  ) => {
    setSelectedDateTime({ date, timeSlot });
  };

  const handleRescheduleClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (!selectedAppointmentId || !selectedDateTime) return;

    rescheduleAppointment.mutate(
      {
        appointmentId: selectedAppointmentId,
        rescheduleData: {
          proposedDate: selectedDateTime.date,
          proposedTimeSlot: selectedDateTime.timeSlot,
        },
      },
      {
        onSuccess: () => {
          setIsRescheduleModalOpen(false);
          setSelectedAppointmentId(null);
          setSelectedDateTime(null);
        },
      }
    );
  };

  const filteredAppointments = {
    pending:
      userAppointments?.filter((apt) =>
        ["pending", "reschedule-pending"].includes(apt.status)
      ) || [],
    upcoming:
      userAppointments?.filter((apt) =>
        ["confirmed", "reschedule-confirmed"].includes(apt.status)
      ) || [],
    past:
      userAppointments?.filter((apt) =>
        [
          "completed",
          "cancelled",
          "no-show",
          "rejected",
          "reschedule-rejected",
        ].includes(apt.status)
      ) || [],
  };

  const getDisplayDate = (appointment) => {
    if (
      appointment.rescheduleRequest &&
      appointment.rescheduleRequest.proposedDate
    ) {
      return new Date(
        appointment.rescheduleRequest.proposedDate
      ).toLocaleDateString("en-US", { timeZone: "UTC" });
    }
    return new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
      timeZone: "UTC",
    });
  };

  const getDisplayTime = (appointment) => {
    if (
      appointment.rescheduleRequest &&
      appointment.rescheduleRequest.proposedTimeSlot
    ) {
      return format(
        new Date(appointment.rescheduleRequest.proposedTimeSlot.start),
        "h:mm a"
      );
    }
    return format(new Date(appointment.timeSlot.start), "h:mm a");
  };

  const renderAppointmentsTable = (appointments: typeof userAppointments) => {
    if (!appointments?.length) {
      return <div className="no-appointments">No appointments found</div>;
    }

    return (
      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              {(activeTab === "pending" || activeTab === "upcoming") && (
                <th>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td data-label="Service">{appointment.serviceId.name}</td>
                <td data-label="Date">{getDisplayDate(appointment)}</td>
                <td data-label="Time">{getDisplayTime(appointment)}</td>
                <td data-label="Status">
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </td>
                {(activeTab === "pending" || activeTab === "upcoming") && (
                  <td data-label="Actions" className="actions">
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancel(appointment._id)}
                      disabled={updateAppointmentStatus.isPending}
                    >
                      {updateAppointmentStatus.isPending
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                    {!appointment.status.includes("reschedule") && (
                      <button
                        className="btn-reschedule"
                        onClick={() => handleRescheduleClick(appointment._id)}
                      >
                        <FaCalendarAlt /> Reschedule
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoadingUserAppointments) {
    return <div className="loading-message">Loading appointments...</div>;
  }

  return (
    <div className="user-appointments">
      <div className="user-appointments__header">
        <h2>My Appointments</h2>
      </div>

      <div className="user-appointments__tabs">
        <button
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({filteredAppointments.pending.length})
        </button>
        <button
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({filteredAppointments.upcoming.length})
        </button>
        <button
          className={`tab ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past ({filteredAppointments.past.length})
        </button>
      </div>

      {renderAppointmentsTable(filteredAppointments[activeTab])}

      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedAppointmentId(null);
          setSelectedDateTime(null);
        }}
        title="Reschedule Appointment"
      >
        <div className="reschedule-modal">
          <p className="reschedule-notice">
            Note: You can only reschedule an appointment once. If you need to
            make further changes, please cancel and book a new appointment.
          </p>
          <DateTimeSelection
            onSelect={handleDateTimeSelect}
            isReschedule={true}
          />
          <div className="reschedule-actions">
            <button
              className="btn-confirm"
              onClick={handleConfirmReschedule}
              disabled={!selectedDateTime || rescheduleAppointment.isPending}
            >
              {rescheduleAppointment.isPending
                ? "Submitting..."
                : "Confirm Reschedule"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserAppointments;
