import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  useToast,
  Avatar,
  Textarea,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Box,
  Switch,
  Text,
} from '@chakra-ui/react';

const CHICAGO_NEIGHBORHOODS = [
  'Lincoln Park', 'Wicker Park', 'Lakeview', 'Logan Square', 'River North',
  'West Loop', 'Gold Coast', 'Old Town', 'Bucktown', 'Pilsen'
];

const ProfileForm = ({ isOpen, onClose, initialData, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    age: initialData?.age || '',
    gender: initialData?.gender || '',
    location: initialData?.location || '',
    occupation: initialData?.occupation || '',
    education: initialData?.education || '',
    bio: initialData?.bio || '',
    interests: initialData?.interests || [],
    hobbies: initialData?.hobbies || [],
    languages: initialData?.languages || [],
    relationshipGoals: initialData?.relationshipGoals || '',
    smoking: initialData?.smoking || '',
    drinking: initialData?.drinking || '',
    firstDateIdeas: initialData?.firstDateIdeas || [],
    lookingFor: initialData?.lookingFor || '',
    status: initialData?.status || 'pending',
    settings: {
      notifications: initialData?.settings?.notifications ?? true,
      emailUpdates: initialData?.settings?.emailUpdates ?? true
    }
  });

  const [newInterest, setNewInterest] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newDateIdea, setNewDateIdea] = useState('');
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addItem = (type, value, setValue) => {
    if (value && !formData[type].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], value]
      }));
      setValue('');
    }
  };

  const removeItem = (type, item) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(i => i !== item)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.occupation) newErrors.occupation = 'Occupation is required';
    if (!formData.education) newErrors.education = 'Education is required';
    if (!formData.bio) newErrors.bio = 'Bio is required';
    if (!formData.lookingFor) newErrors.lookingFor = 'Looking for is required';
    if (!formData.relationshipGoals) newErrors.relationshipGoals = 'Relationship goals is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await onProfileUpdate(formData);
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Profile Picture</FormLabel>
                <Avatar
                  size="xl"
                  src={initialData?.picture}
                  name={formData.name}
                />
              </FormControl>

              <FormControl isInvalid={errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </FormControl>

              <FormControl isInvalid={errors.age}>
                <FormLabel>Age</FormLabel>
                <Input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                />
              </FormControl>

              <FormControl isInvalid={errors.gender}>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Select gender"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>

              <FormControl isInvalid={errors.location}>
                <FormLabel>Location</FormLabel>
                <Select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Select your neighborhood"
                >
                  {CHICAGO_NEIGHBORHOODS.map(neighborhood => (
                    <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isInvalid={errors.occupation}>
                <FormLabel>Occupation</FormLabel>
                <Input
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Your occupation"
                />
              </FormControl>

              <FormControl isInvalid={errors.education}>
                <FormLabel>Education</FormLabel>
                <Input
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="Your education"
                />
              </FormControl>

              <FormControl isInvalid={errors.bio}>
                <FormLabel>About Me</FormLabel>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </FormControl>

              <FormControl isInvalid={errors.lookingFor}>
                <FormLabel>Looking For</FormLabel>
                <Select
                  name="lookingFor"
                  value={formData.lookingFor}
                  onChange={handleChange}
                  placeholder="What are you looking for?"
                >
                  <option value="dating">Dating</option>
                  <option value="friendship">Friendship</option>
                  <option value="casual">Casual</option>
                  <option value="long-term">Long-term relationship</option>
                  <option value="marriage">Marriage</option>
                </Select>
              </FormControl>

              <FormControl isInvalid={errors.relationshipGoals}>
                <FormLabel>Relationship Goals</FormLabel>
                <Select
                  name="relationshipGoals"
                  value={formData.relationshipGoals}
                  onChange={handleChange}
                  placeholder="What are your relationship goals?"
                >
                  <option value="long-term">Long-term relationship</option>
                  <option value="marriage">Marriage</option>
                  <option value="short-term">Short-term relationship</option>
                  <option value="friendship">Friendship</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Interests</FormLabel>
                <HStack>
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest"
                  />
                  <Button onClick={() => addItem('interests', newInterest, setNewInterest)}>
                    Add
                  </Button>
                </HStack>
                <Box mt={2}>
                  {formData.interests.map((interest, index) => (
                    <Tag key={index} mr={2} mb={2}>
                      <TagLabel>{interest}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('interests', interest)} />
                    </Tag>
                  ))}
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Hobbies</FormLabel>
                <HStack>
                  <Input
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    placeholder="Add a hobby"
                  />
                  <Button onClick={() => addItem('hobbies', newHobby, setNewHobby)}>
                    Add
                  </Button>
                </HStack>
                <Box mt={2}>
                  {formData.hobbies.map((hobby, index) => (
                    <Tag key={index} mr={2} mb={2}>
                      <TagLabel>{hobby}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('hobbies', hobby)} />
                    </Tag>
                  ))}
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Languages</FormLabel>
                <HStack>
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add a language"
                  />
                  <Button onClick={() => addItem('languages', newLanguage, setNewLanguage)}>
                    Add
                  </Button>
                </HStack>
                <Box mt={2}>
                  {formData.languages.map((language, index) => (
                    <Tag key={index} mr={2} mb={2}>
                      <TagLabel>{language}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('languages', language)} />
                    </Tag>
                  ))}
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>First Date Ideas</FormLabel>
                <HStack>
                  <Input
                    value={newDateIdea}
                    onChange={(e) => setNewDateIdea(e.target.value)}
                    placeholder="Add a first date idea"
                  />
                  <Button onClick={() => addItem('firstDateIdeas', newDateIdea, setNewDateIdea)}>
                    Add
                  </Button>
                </HStack>
                <Box mt={2}>
                  {formData.firstDateIdeas.map((idea, index) => (
                    <Tag key={index} mr={2} mb={2}>
                      <TagLabel>{idea}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('firstDateIdeas', idea)} />
                    </Tag>
                  ))}
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Smoking</FormLabel>
                <Select
                  name="smoking"
                  value={formData.smoking}
                  onChange={handleChange}
                  placeholder="Select smoking preference"
                >
                  <option value="never">Never</option>
                  <option value="socially">Socially</option>
                  <option value="regularly">Regularly</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Drinking</FormLabel>
                <Select
                  name="drinking"
                  value={formData.drinking}
                  onChange={handleChange}
                  placeholder="Select drinking preference"
                >
                  <option value="never">Never</option>
                  <option value="socially">Socially</option>
                  <option value="regularly">Regularly</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="Select status"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Settings</FormLabel>
                <VStack align="start" spacing={4}>
                  <HStack>
                    <Switch
                      name="notifications"
                      isChecked={formData.settings.notifications}
                      onChange={handleChange}
                    />
                    <Text>Enable Notifications</Text>
                  </HStack>
                  <HStack>
                    <Switch
                      name="emailUpdates"
                      isChecked={formData.settings.emailUpdates}
                      onChange={handleChange}
                    />
                    <Text>Email Updates</Text>
                  </HStack>
                </VStack>
              </FormControl>

              <Button 
                type="submit" 
                colorScheme="blue" 
                width="full"
              >
                Save Changes
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfileForm;