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
    preferredContact: "email" | "phone";
  } | null;
}

const initialBookingState: BookingData = {
  appointmentDateTime: null,
  service: null,
  contactInfo: null,
};

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] =
    useState<BookingData>(initialBookingState);

  const handleDateTimeSelect = (
    date: Date,
    timeSlot: { start: Date; end: Date }
  ) => {
    setBookingData((prev) => ({
      ...prev,
      appointmentDateTime: timeSlot.start,
    }));
    setCurrentStep(2);
  };

  const handleServiceSelect = (selectedService: Service) => {
    setBookingData((prev) => ({
      ...prev,
      service: {
        _id: selectedService._id,
        name: selectedService.name,
        duration: selectedService.duration,
        price: selectedService.price,
      },
    }));
    setCurrentStep(3);
  };

  const handleContactInfoSubmit = (contactInfo: BookingData["contactInfo"]) => {
    setBookingData((prev) => ({
      ...prev,
      contactInfo,
    }));
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
