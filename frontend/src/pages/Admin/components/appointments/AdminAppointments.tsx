import { useState } from "react";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { useAppointment } from "@/hooks/appointment/useAppointment";
import "./_adminAppointments.scss";

type TabType = "pending" | "upcoming" | "past";

const AdminAppointments = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const {
    adminAppointments,
    isLoadingAdminAppointments,
    updateAppointmentStatus,
  } = useAppointment();

  const filteredAppointments = {
    pending:
      adminAppointments?.filter((apt) =>
        ["pending", "reschedule-pending"].includes(apt.status)
      ) || [],
    upcoming:
      adminAppointments?.filter((apt) =>
        ["confirmed", "reschedule-confirmed"].includes(apt.status)
      ) || [],
    past:
      adminAppointments?.filter((apt) =>
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
      appointment.status.includes("reschedule") &&
      appointment.rescheduleRequest
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
      appointment.status.includes("reschedule") &&
      appointment.rescheduleRequest
    ) {
      return format(
        new Date(appointment.rescheduleRequest.proposedTimeSlot.start),
        "h:mm a"
      );
    }
    return format(new Date(appointment.timeSlot.start), "h:mm a");
  };

  const handleReschedule = (appointmentId: string) => {
    // This will be implemented later with actual functionality
    console.log("Reschedule appointment:", appointmentId);
  };

  const handleConfirm = (appointmentId: string) => {
    updateAppointmentStatus.mutate({
      appointmentId,
      status: "confirmed",
    });
  };

  const renderAppointmentsTable = (appointments: typeof adminAppointments) => {
    if (!appointments?.length) {
      return <div className="no-appointments">No appointments found</div>;
    }

    return (
      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Contact Info</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              {activeTab === "pending" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td data-label="Client">{appointment.userId.name}</td>
                <td data-label="Contact Info">
                  <div>
                    <div>📧 {appointment.contactInfo.email}</div>
                    <div>📱 {appointment.contactInfo.phone}</div>
                  </div>
                </td>
                <td data-label="Service">{appointment.serviceId.name}</td>
                <td data-label="Date">{getDisplayDate(appointment)}</td>
                <td data-label="Time">{getDisplayTime(appointment)}</td>
                <td data-label="Status">
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </td>
                {activeTab === "pending" && (
                  <td data-label="Actions" className="actions">
                    <button
                      className="btn-confirm"
                      onClick={() => handleConfirm(appointment._id)}
                      disabled={updateAppointmentStatus.isPending}
                    >
                      {updateAppointmentStatus.isPending
                        ? "Confirming..."
                        : "Confirm"}
                    </button>
                    {!appointment.status.includes("reschedule") && (
                      <button
                        className="btn-reschedule"
                        onClick={() => handleReschedule(appointment._id)}
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

  if (isLoadingAdminAppointments) {
    return <div className="loading-message">Loading appointments...</div>;
  }

  return (
    <div className="admin-appointments">
      <div className="admin-appointments__header">
        <h2>Appointments</h2>
      </div>

      <div className="admin-appointments__tabs">
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
    </div>
  );
};

export default AdminAppointments;
