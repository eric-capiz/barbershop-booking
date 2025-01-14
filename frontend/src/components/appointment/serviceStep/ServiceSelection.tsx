import { useServices } from "@/hooks/admin/useService";
import { Service } from "@/types/admin/services.types";
import "./_serviceSelection.scss";

interface ServiceSelectionProps {
  onSelect: (service: {
    _id: string;
    name: string;
    duration: number;
    price: number;
  }) => void;
}

const ServiceSelection = ({ onSelect }: ServiceSelectionProps) => {
  const { data: services, isLoading } = useServices();

  if (isLoading) return <div>Loading services...</div>;

  const handleServiceClick = (service: Service) => {
    onSelect(service);
  };

  return (
    <div className="service-selection">
      <div className="services-grid">
        {services?.map((service) => (
          <button
            key={service._id}
            className="service-card"
            onClick={() => handleServiceClick(service)}
          >
            <h3 className="service-name">{service.name}</h3>
            <div className="service-details">
              <span className="service-duration">{service.duration} min</span>
              <span className="service-price">${service.price}</span>
            </div>
            {service.description && (
              <p className="service-description">{service.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
