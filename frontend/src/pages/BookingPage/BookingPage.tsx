import { useState } from "react";
import DateTimeSelection from "@/components/appointment/dateStep/DateTimeSelection";
import ServiceSelection from "@/components/appointment/serviceStep/ServiceSelection";
import ContactInfo from "@/components/appointment/contactStep/ContactInfo";
import "./_bookingPage.scss";
import { useUserStore } from "@/store/user/userStore";

interface BookingStep {
  appointmentDateTime: Date | null;
  serviceId: string | null;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    preferredContact: "email" | "phone" | null;
  };
}

const initialBookingState: BookingStep = {
  appointmentDateTime: null,
  serviceId: null,
  contactInfo: {
    name: "",
    email: "",
    phone: "",
    preferredContact: null,
  },
};

const BookingPage = () => {
  const [bookingData, setBookingData] =
    useState<BookingStep>(initialBookingState);
  const [currentStep, setCurrentStep] = useState(1);

  const user = useUserStore((state) => state.user);

  const [contactInfo, setContactInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "", // Will use user's phone if it exists
    preferredContact: user?.preferredContact || ("email" as "email" | "phone"),
  });

  const handleDateTimeSelect = (
    date: Date,
    timeSlot: { start: Date; end: Date }
  ) => {
    setBookingData((prev) => ({
      ...prev,
      appointmentDateTime: timeSlot.start,
    }));
    console.log("Step 1 - Selected Date/Time:", timeSlot.start);
    setCurrentStep(2);
  };

  const handleServiceSelect = (serviceId: string) => {
    setBookingData((prev) => ({
      ...prev,
      serviceId,
    }));
    console.log("Current Booking Data:", {
      appointmentDateTime: bookingData.appointmentDateTime,
      serviceId: serviceId,
    });
    setCurrentStep(3);
  };

  const handleContactInfoSubmit = (contactInfo: {
    name: string;
    email: string;
    phone: string;
    preferredContact: "email" | "phone";
  }) => {
    setBookingData((prev) => ({
      ...prev,
      contactInfo,
    }));
    console.log("Current Booking Data:", {
      ...bookingData,
      contactInfo,
    });
    setCurrentStep(4);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DateTimeSelection onSelect={handleDateTimeSelect} />;
      case 2:
        return <ServiceSelection onSelect={handleServiceSelect} />;
      case 3:
        return <ContactInfo onSubmit={handleContactInfoSubmit} />;
      case 4:
        return <div>Confirm Booking</div>;
      default:
        return null;
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          {currentStep > 1 && (
            <button
              className="back-button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              ← Back
            </button>
          )}
          <h1>Book Your Appointment</h1>
        </div>

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
      </div>
    </div>
  );
};

export default BookingPage;
