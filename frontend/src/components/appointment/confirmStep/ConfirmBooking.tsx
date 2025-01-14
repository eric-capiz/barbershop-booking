import { format } from "date-fns";
import "./_confirmBooking.scss";

interface ConfirmBookingProps {
  bookingData: {
    appointmentDateTime: Date;
    service: {
      _id: string;
      name: string;
      duration: number;
      price: number;
    };
    contactInfo: {
      name: string;
      email: string;
      phone: string;
      preferredContact: "email" | "phone";
    };
  };
  onConfirm: () => void;
  onStepChange: (step: number) => void;
}

const ConfirmBooking = ({
  bookingData,
  onConfirm,
  onStepChange,
}: ConfirmBookingProps) => {
  console.log("Booking Data in Confirm:", bookingData);

  const handleConfirm = () => {
    console.log("Booking Confirmation Details:", {
      appointmentDate: format(bookingData.appointmentDateTime, "MMMM d, yyyy"),
      appointmentTime: format(bookingData.appointmentDateTime, "h:mm a"),
      service: {
        id: bookingData.service._id,
        name: bookingData.service.name,
        duration: bookingData.service.duration,
        price: bookingData.service.price,
      },
      contactInfo: bookingData.contactInfo,
    });
    onConfirm();
  };

  return (
    <div className="confirm-booking">
      <div className="confirmation-header">
        <h2>Review Your Appointment</h2>
        <p className="verify-message">
          Please verify all details below. To make changes, click the
          corresponding section to go back to that step.
        </p>
      </div>

      <div className="confirmation-details">
        <section className="detail-section" onClick={() => onStepChange(1)}>
          <h3>Date & Time</h3>
          <div className="detail-content">
            <p className="date">
              {format(bookingData.appointmentDateTime, "MMMM d, yyyy")}
            </p>
            <p className="time">
              {format(bookingData.appointmentDateTime, "h:mm a")}
            </p>
          </div>
        </section>

        <section className="detail-section" onClick={() => onStepChange(2)}>
          <h3>Service Details</h3>
          <div className="detail-content">
            <p className="service-name">{bookingData.service.name}</p>
            <div className="service-meta">
              <span className="duration">
                {bookingData.service.duration} min
              </span>
              <span className="price">
                ${bookingData.service.price.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        <section className="detail-section" onClick={() => onStepChange(3)}>
          <h3>Contact Information</h3>
          <div className="detail-content">
            <p className="contact-name">{bookingData.contactInfo.name}</p>
            <p className="contact-method">
              Preferred Contact:{" "}
              {bookingData.contactInfo.preferredContact === "email"
                ? "Email"
                : "Phone"}
            </p>
            <p className="contact-detail">
              {bookingData.contactInfo.preferredContact === "email"
                ? bookingData.contactInfo.email
                : bookingData.contactInfo.phone}
            </p>
          </div>
        </section>
      </div>

      <div className="confirmation-actions">
        <p className="confirmation-note">
          By clicking confirm, you agree to our booking terms and cancellation
          policy.
        </p>
        <button className="confirm-button" onClick={handleConfirm}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
