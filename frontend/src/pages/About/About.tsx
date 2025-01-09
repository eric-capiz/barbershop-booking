import { useEffect, useState } from "react";
import "./_about.scss";

interface Profile {
  bio: string;
  specialties: string[];
  yearsOfExperience: number;
  profileImage: {
    url: string;
    publicId: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const About = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, servicesRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/profile`),
          fetch(`${API_URL}/api/admin/services`),
        ]);

        const profileData = await profileRes.json();
        const servicesData = await servicesRes.json();

        setProfile(profileData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  console.log(profile);
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
