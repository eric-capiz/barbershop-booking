import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useProfileStore } from "../../store/profileStore";
import "./_about.scss";

interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
}

const About = () => {
  const { data: profile, isLoading } = useProfile();
  const setProfile = useProfileStore((state) => state.setProfile);
  const [services, setServices] = useState<Service[]>([]);

  // Set profile in global store when data is fetched
  useEffect(() => {
    if (profile) {
      setProfile(profile);
    }
  }, [profile, setProfile]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`/api/admin/services`);
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) return <div>Loading...</div>;

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
          {services.map((service) => (
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
