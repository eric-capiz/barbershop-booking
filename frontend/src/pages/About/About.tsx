import { useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useServices } from "../../hooks/useService";
import { useProfileStore } from "../../store/profileStore";
import { useServicesStore } from "../../store/serviceStore";
import "./_about.scss";

const About = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: services, isLoading: servicesLoading } = useServices();
  const setProfile = useProfileStore((state) => state.setProfile);
  const setServices = useServicesStore((state) => state.setServices);

  useEffect(() => {
    if (profile) {
      setProfile(profile);
    }
  }, [profile, setProfile]);

  useEffect(() => {
    if (services) {
      setServices(services);
    }
  }, [services, setServices]);

  if (profileLoading || servicesLoading) return <div>Loading...</div>;

  return (
    <div className="about">
      {/* Profile Section */}
      <section className="about-profile">
        {profile && (
          <>
            <div className="profile-image">
              <img src={profile.profileImage.url} alt="Barber Profile" />
            </div>
            <div className="profile-content">
              <div className="bio">{profile.bio}</div>
              <div className="experience">
                <span>{profile.yearsOfExperience} Years of Experience</span>
              </div>
              <div className="specialties">
                <h3>Specialties</h3>
                <ul>
                  {profile.specialties.map((specialty, index) => (
                    <li key={index}>{specialty}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Services Section */}
      <section className="about-services">
        <h2>Services</h2>
        <div className="services-grid">
          {services?.map((service) => (
            <div key={service._id} className="service-card">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-details">
                <span>{service.duration} min</span>
                <span>${service.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
