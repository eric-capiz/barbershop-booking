export interface Profile {
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
