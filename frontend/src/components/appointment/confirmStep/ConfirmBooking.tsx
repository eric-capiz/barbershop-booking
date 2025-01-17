import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAppointment } from "@/hooks/appointment/useAppointment";
import { useBookingAvailability } from "@/hooks/appointment/useBookingAvailability";
import Toast from "@/components/common/Toast";
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
    };
  };

  onStepChange: (step: number) => void;
}

const ConfirmBooking = ({ bookingData, onStepChange }: ConfirmBookingProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { createAppointment, isCreating } = useAppointment();
  const { data: availability } = useBookingAvailability();

  const handleConfirm = async () => {
    try {
      if (!availability) {
        setToast({
          message: "Could not get barber information. Please try again.",
          type: "error",
        });
        return;
      }

      const appointmentDate = new Date(bookingData.appointmentDateTime);
      appointmentDate.setHours(0, 0, 0, 0);

      const appointmentData = {
        adminId: availability.adminId,
        serviceId: bookingData.service._id,
        appointmentDate: appointmentDate,
        timeSlot: {
          start: bookingData.appointmentDateTime,
          end: new Date(
            bookingData.appointmentDateTime.getTime() +
              bookingData.service.duration * 60000
          ),
        },
        contactInfo: bookingData.contactInfo,
      };

      await createAppointment.mutateAsync(appointmentData);

      setToast({
        message:
          "Appointment request sent! Please check your profile for status updates.",
        type: "success",
      });
      setIsSubmitted(true);

      // Optional: Navigate to profile page after delay
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "Failed to book appointment",
        type: "error",
      });
    }
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
              {format(
                new Date(bookingData.appointmentDateTime),
                "MMMM d, yyyy"
              )}
            </p>
            <p className="time">
              {format(new Date(bookingData.appointmentDateTime), "h:mm a")}
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
            <p className="contact-detail">
              Email: {bookingData.contactInfo.email}
            </p>
            <p className="contact-detail">
              Phone: {bookingData.contactInfo.phone}
            </p>
          </div>
        </section>
      </div>

      <div className="confirmation-actions">
        <p className="confirmation-note">
          By clicking confirm, you agree to our booking terms and cancellation
          policy.
        </p>
        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={isCreating || isSubmitted}
        >
          {isCreating
            ? "Sending request..."
            : isSubmitted
            ? "Request Sent!"
            : "Confirm Booking"}
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ConfirmBooking;
