import { useState } from "react";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import "./_adminAppointments.scss";

// Temporary mock data
const mockAppointments = {
  pending: [
    {
      id: 1,
      name: "John Doe",
      service: "Haircut & Beard",
      date: "2024-01-25",
      time: "10:00 AM",
      status: "pending",
    },
    {
      id: 2,
      name: "Mike Smith",
      service: "Fade",
      date: "2024-01-26",
      time: "2:30 PM",
      status: "pending",
    },
  ],
  upcoming: [
    {
      id: 3,
      name: "Alex Johnson",
      service: "Beard Trim",
      date: "2024-01-27",
      time: "11:00 AM",
      status: "confirmed",
    },
    {
      id: 4,
      name: "Chris Wilson",
      service: "Full Service",
      date: "2024-01-28",
      time: "3:00 PM",
      status: "confirmed",
    },
  ],
  past: [
    {
      id: 5,
      name: "Tom Brown",
      service: "Haircut",
      date: "2024-01-20",
      time: "9:00 AM",
      status: "completed",
    },
    {
      id: 6,
      name: "James Lee",
      service: "Fade & Beard",
      date: "2024-01-21",
      time: "4:00 PM",
      status: "completed",
    },
  ],
};

type TabType = "pending" | "upcoming" | "past";

const AdminAppointments = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const handleReschedule = (appointmentId: number) => {
    // This will be implemented later with actual functionality
    console.log("Reschedule appointment:", appointmentId);
  };

  const renderAppointmentsTable = (
    appointments: (typeof mockAppointments)[TabType]
  ) => (
    <div className="appointments-table">
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            {activeTab === "pending" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.name}</td>
              <td>{appointment.service}</td>
              <td>{format(new Date(appointment.date), "MMM d, yyyy")}</td>
              <td>{appointment.time}</td>
              <td>
                <span className={`status-badge ${appointment.status}`}>
                  {appointment.status}
                </span>
              </td>
              {activeTab === "pending" && (
                <td className="actions">
                  <button className="btn-confirm">Confirm</button>
                  <button
                    className="btn-reschedule"
                    onClick={() => handleReschedule(appointment.id)}
                  >
                    <FaCalendarAlt /> Reschedule
                  </button>
                  <button className="btn-cancel">Cancel</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
          Pending ({mockAppointments.pending.length})
        </button>
        <button
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({mockAppointments.upcoming.length})
        </button>
        <button
          className={`tab ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past ({mockAppointments.past.length})
        </button>
      </div>

      {renderAppointmentsTable(mockAppointments[activeTab])}
    </div>
  );
};

export default AdminAppointments;
