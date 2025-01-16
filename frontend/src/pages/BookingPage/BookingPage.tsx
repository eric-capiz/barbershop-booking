import { useState } from "react";
import DateTimeSelection from "@/components/appointment/dateStep/DateTimeSelection";
import ServiceSelection from "@/components/appointment/serviceStep/ServiceSelection";
import ContactInfo from "@/components/appointment/contactStep/ContactInfo";
import ConfirmBooking from "@/components/appointment/confirmStep/ConfirmBooking";
import "./_bookingPage.scss";

interface Service {
  _id: string;
  name: string;
  duration: number;
  price: number;
}

interface BookingData {
  appointmentDateTime: Date | null;
  service: {
    _id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  } | null;
}

const initialBookingState: BookingData = {
  appointmentDateTime: null,
  service: null,
  contactInfo: null,
};

const getStepTitle = (step: number) => {
  switch (step) {
    case 1:
      return "Select Date & Time";
    case 2:
      return "Choose Service";
    case 3:
      return "Contact Info";
    case 4:
      return "Confirm";
    default:
      return "";
  }
};

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] =
    useState<BookingData>(initialBookingState);
  const [maxVisitedStep, setMaxVisitedStep] = useState(1);

  const handleDateTimeSelect = (
    date: Date,
    timeSlot: { start: Date; end: Date }
  ) => {
    setBookingData((prev) => ({
      ...prev,
      appointmentDateTime: timeSlot.start,
    }));
    setCurrentStep(2);
    setMaxVisitedStep(Math.max(maxVisitedStep, 2));
  };

  const handleServiceSelect = (selectedService: Service) => {
    setBookingData((prev) => ({
      ...prev,
      service: selectedService,
    }));
    setCurrentStep(3);
    setMaxVisitedStep(Math.max(maxVisitedStep, 3));
  };

  const handleContactInfoSubmit = (contactInfo: BookingData["contactInfo"]) => {
    setBookingData((prev) => ({
      ...prev,
      contactInfo,
    }));
    setCurrentStep(4);
    setMaxVisitedStep(Math.max(maxVisitedStep, 4));
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
        return bookingData.appointmentDateTime &&
          bookingData.service &&
          bookingData.contactInfo ? (
          <ConfirmBooking
            bookingData={{
              appointmentDateTime: bookingData.appointmentDateTime,
              service: bookingData.service,
              contactInfo: bookingData.contactInfo,
            }}
            onStepChange={setCurrentStep}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book Your Appointment</h1>
        </div>

        <div className="booking-steps">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => {
                if (step < 4 && step <= maxVisitedStep) {
                  setCurrentStep(step);
                }
              }}
              className={`step ${currentStep === step ? "active" : ""} ${
                step < 4 && step <= maxVisitedStep ? "clickable" : ""
              }`}
              disabled={step === 4 || step > maxVisitedStep}
            >
              {step}. {getStepTitle(step)}
            </button>
          ))}
        </div>

        <div className="step-content">{renderCurrentStep()}</div>
      </div>
    </div>
  );
};

export default BookingPage;
