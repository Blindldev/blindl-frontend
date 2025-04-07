import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    lookingFor: '',
    relationshipGoal: '',
    interests: '',
    smoking: '',
    drinking: '',
    bio: '',
    photos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = {
        name: form.name,
        age: parseInt(form.age),
        gender: form.gender,
        lookingFor: form.lookingFor,
        relationshipGoal: form.relationshipGoal,
        interests: form.interests,
        smoking: form.smoking,
        drinking: form.drinking,
        bio: form.bio,
        photos: form.photos
      };

      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create profile');
      }

      const data = await response.json();
      setProfile(data);
      navigate('/waiting');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Render your form here */}
    </div>
  );
};

export default ProfileForm; 