import { useState } from "react";
import "./_bookingPage.scss";

interface BookingStep {
  date: Date | null;
  timeSlot: {
    start: Date | null;
    end: Date | null;
  };
  serviceId: string | null;
  contactInfo: {
    email: string;
    phone: string;
    preferredContact: "email" | "phone" | null;
  };
}

const initialBookingState: BookingStep = {
  date: null,
  timeSlot: {
    start: null,
    end: null,
  },
  serviceId: null,
  contactInfo: {
    email: "",
    phone: "",
    preferredContact: null,
  },
};

const BookingPage = () => {
  const [bookingData, setBookingData] =
    useState<BookingStep>(initialBookingState);
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1>Book Your Appointment</h1>
        <div className="booking-steps">
          <div className={`step ${currentStep === 1 ? "active" : ""}`}>
            1. Select Date
          </div>
          <div className={`step ${currentStep === 2 ? "active" : ""}`}>
            2. Choose Time
          </div>
          <div className={`step ${currentStep === 3 ? "active" : ""}`}>
            3. Select Service
          </div>
          <div className={`step ${currentStep === 4 ? "active" : ""}`}>
            4. Contact Info
          </div>
        </div>

        {/* Step content will go here */}
      </div>
    </div>
  );
};

export default BookingPage;
