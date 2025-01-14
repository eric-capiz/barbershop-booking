import { useState } from "react";
import DateTimeSelection from "@/components/appointment/DateTimeSelection";
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

  const handleDateTimeSelect = (
    date: Date,
    timeSlot: { start: Date; end: Date }
  ) => {
    setBookingData((prev) => ({
      ...prev,
      date,
      timeSlot,
    }));
    setCurrentStep(2); // Move to next step after selection
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DateTimeSelection onSelect={handleDateTimeSelect} />;
      case 2:
        // Service selection will go here
        return <div>Select Service</div>;
      case 3:
        // Contact info will go here
        return <div>Contact Information</div>;
      case 4:
        // Confirmation will go here
        return <div>Confirm Booking</div>;
      default:
        return null;
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1>Book Your Appointment</h1>
        <div className="booking-steps">
          <div className={`step ${currentStep === 1 ? "active" : ""}`}>
            1. Select Date & Time
          </div>
          <div className={`step ${currentStep === 2 ? "active" : ""}`}>
            2. Choose Service
          </div>
          <div className={`step ${currentStep === 3 ? "active" : ""}`}>
            3. Contact Info
          </div>
          <div className={`step ${currentStep === 4 ? "active" : ""}`}>
            4. Confirm
          </div>
        </div>

        <div className="step-content">{renderCurrentStep()}</div>

        {currentStep > 1 && (
          <button
            className="back-button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
