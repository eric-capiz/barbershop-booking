import { useServices } from "../../../../hooks/useService";
import { Service } from "../../../../types/service.types";
import "./_adminServices.scss";

const AdminServices = () => {
  const { data: services, isLoading } = useServices();

  if (isLoading) return <div>Loading...</div>;
  if (!services) return <div>No services found</div>;

  return (
    <div className="admin-services">
      <div className="admin-services__content">
        {services.map((service: Service) => (
          <div key={service._id} className="admin-services__card">
            <div className="service-header">
              <h3>{service.name}</h3>
              <span className="price">${service.price}</span>
            </div>
            <div className="service-details">
              <p className="description">{service.description}</p>
              <div className="meta">
                <span className="duration">{service.duration} mins</span>
                <span className="category">{service.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;
