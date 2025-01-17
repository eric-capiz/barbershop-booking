import { useState } from "react";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { useAppointment } from "@/hooks/appointment/useAppointment";
import "./_userAppointments.scss";

type TabType = "pending" | "upcoming" | "past";

const UserAppointments = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const {
    userAppointments,
    isLoadingUserAppointments,
    updateAppointmentStatus,
  } = useAppointment();

  const handleCancel = (appointmentId: string) => {
    updateAppointmentStatus.mutate({
      appointmentId,
      status: "cancelled",
    });
  };

  const handleReschedule = (appointmentId: string) => {
    // This will be implemented later
    console.log("Reschedule appointment:", appointmentId);
  };

  const filteredAppointments = {
    pending: userAppointments?.filter((apt) => apt.status === "pending") || [],
    upcoming:
      userAppointments?.filter((apt) => apt.status === "confirmed") || [],
    past:
      userAppointments?.filter(
        (apt) => apt.status === "completed" || apt.status === "cancelled"
      ) || [],
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
                <td data-label="Date">
                  {new Date(appointment.appointmentDate).toLocaleDateString(
                    "en-US",
                    { timeZone: "UTC" }
                  )}
                </td>
                <td data-label="Time">
                  {format(new Date(appointment.timeSlot.start), "h:mm a")}
                </td>
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
                    <button
                      className="btn-reschedule"
                      onClick={() => handleReschedule(appointment._id)}
                    >
                      <FaCalendarAlt /> Reschedule
                    </button>
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
    </div>
  );
};

export default UserAppointments;
