import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
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
    fetchProfile();
  }, []);

  const updateProfile = async (updatedProfile) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3002/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON');
      }

      const data = await response.json();
      // Ensure updated profile has all required fields with default values
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
      setProfile(defaultProfile);
      return defaultProfile;
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