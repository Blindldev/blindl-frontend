import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    // Try to load profile from localStorage on initial load
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (profile) {
      console.log('Saving profile to localStorage:', profile);
      localStorage.setItem('profile', JSON.stringify(profile));
    } else {
      console.log('Removing profile from localStorage');
      localStorage.removeItem('profile');
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching profile from backend...');
      const response = await fetch('http://localhost:3002/api/profiles/current', {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON');
      }

      const data = await response.json();
      console.log('Received profile data:', data);
      
      // Ensure profile has all required fields with default values
      const defaultProfile = {
        name: '',
        age: '',
        gender: '',
        lookingFor: '',
        location: '',
        occupation: '',
        education: '',
        bio: '',
        interests: [],
        hobbies: [],
        languages: [],
        photos: [],
        relationshipGoals: '',
        smoking: '',
        drinking: '',
        firstDateIdeas: [],
        personality: {},
        ...data
      };
      
      console.log('Setting profile with default values:', defaultProfile);
      setProfile(defaultProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message);
      // Don't set profile to null on error to maintain existing profile
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profile) {
      console.log('No profile found, fetching from backend');
      fetchProfile();
    } else {
      console.log('Using existing profile:', profile);
      setLoading(false);
    }
  }, []);

  const updateProfile = async (updatedProfile) => {
    try {
      if (!profile) {
        throw new Error('No profile found. Please sign in again.');
      }

      console.log('Starting profile update...');
      console.log('Current profile email:', profile.email);
      console.log('Profile data to update:', updatedProfile);

      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3002/api/profiles/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: profile.email,
          profileData: updatedProfile
        }),
      });

      console.log('Update response status:', response.status);
      console.log('Update response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update failed with response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON');
      }

      const data = await response.json();
      console.log('Update successful, received data:', data);
      
      if (data.success && data.user) {
        // Create a complete profile object with all fields
        const completeProfile = {
          ...profile, // Keep existing profile data
          ...data.user, // Update with new data
          interests: Array.isArray(data.user.interests) ? data.user.interests : [],
          hobbies: Array.isArray(data.user.hobbies) ? data.user.hobbies : [],
          languages: Array.isArray(data.user.languages) ? data.user.languages : [],
          firstDateIdeas: Array.isArray(data.user.firstDateIdeas) ? data.user.firstDateIdeas : []
        };
        
        console.log('Setting complete profile:', completeProfile);
        setProfile(completeProfile);
        return completeProfile;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, updateProfile, loading, error }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}; 