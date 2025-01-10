import { useProfile } from "../../../../hooks/useProfile";
import "./_adminProfile.scss";
const AdminProfile = () => {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="admin-profile">
      <div className="admin-profile__content">
        <div className="admin-profile__section">
          <h3>Basic Information</h3>
          <div className="info-item">
            <label>Name:</label>
            <span>{profile.name}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>
          <div className="info-item">
            <label>Username:</label>
            <span>{profile.username}</span>
          </div>
        </div>

        <div className="admin-profile__section">
          <h3>Professional Details</h3>
          <div className="info-item">
            <label>Years of Experience:</label>
            <span>{profile.yearsOfExperience}</span>
          </div>
          <div className="info-item">
            <label>Specialties:</label>
            <ul>
              {profile.specialties.map((specialty, index) => (
                <li key={index}>{specialty}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="admin-profile__section">
          <h3>Bio</h3>
          <p>{profile.bio}</p>
        </div>

        <div className="admin-profile__section">
          <h3>Social Media</h3>
          <div className="info-item">
            <label>Instagram:</label>
            <span>{profile.socialMedia.instagram}</span>
          </div>
          <div className="info-item">
            <label>Facebook:</label>
            <span>{profile.socialMedia.facebook}</span>
          </div>
          <div className="info-item">
            <label>Twitter:</label>
            <span>{profile.socialMedia.twitter}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
