import { useState } from "react";
import DateTimeSelection from "@/components/appointment/dateStep/DateTimeSelection";
import ServiceSelection from "@/components/appointment/serviceStep/ServiceSelection";
import "./_bookingPage.scss";
import { useServices } from "@/hooks/admin/useService";

interface BookingStep {
  appointmentDateTime: Date | null;
  serviceId: string | null;
  contactInfo: {
    email: string;
    phone: string;
    preferredContact: "email" | "phone" | null;
  };
}

const initialBookingState: BookingStep = {
  appointmentDateTime: null,
  serviceId: null,
  contactInfo: {
    email: "",
    phone: "",
    preferredContact: null,
  },
};

const BookingPage = () => {
  const { data: services } = useServices();
  const [bookingData, setBookingData] =
    useState<BookingStep>(initialBookingState);
  const [currentStep, setCurrentStep] = useState(1);

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

    const selectedService = services?.find(
      (service) => service._id === serviceId
    );
    console.log("Current Booking Data:", {
      appointmentDateTime: bookingData.appointmentDateTime,
      service: {
        id: serviceId,
        name: selectedService?.name,
        duration: selectedService?.duration,
        price: selectedService?.price,
      },
    });

    setCurrentStep(3);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DateTimeSelection onSelect={handleDateTimeSelect} />;
      case 2:
        return <ServiceSelection onSelect={handleServiceSelect} />;
      case 3:
        return <div>Contact Information</div>;
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
