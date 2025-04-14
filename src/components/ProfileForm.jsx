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
  Wrap,
  WrapItem,
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
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>👤 Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>🎂 Age</FormLabel>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Your age"
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>👫 Gender</FormLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  placeholder="Select gender"
                  size="lg"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>📍 Location</FormLabel>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Your location"
                  size="lg"
                />
              </FormControl>

              <FormControl>
                <FormLabel>💼 Occupation</FormLabel>
                <Input
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Your occupation"
                  size="lg"
                />
              </FormControl>

              <FormControl>
                <FormLabel>🎓 Education</FormLabel>
                <Input
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="Your education"
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>📝 Bio</FormLabel>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  size="lg"
                  rows={4}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>🎯 Interests</FormLabel>
                <HStack>
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest"
                    size="lg"
                  />
                  <Button onClick={() => addItem('interests', newInterest, setNewInterest)}>
                    Add
                  </Button>
                </HStack>
                <Wrap mt={2}>
                  {formData.interests.map((interest, index) => (
                    <WrapItem key={index}>
                      <Tag colorScheme="blue" size="lg">
                        {interest}
                        <TagCloseButton onClick={() => removeItem('interests', interest)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>🎨 Hobbies</FormLabel>
                <HStack>
                  <Input
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    placeholder="Add a hobby"
                    size="lg"
                  />
                  <Button onClick={() => addItem('hobbies', newHobby, setNewHobby)}>
                    Add
                  </Button>
                </HStack>
                <Wrap mt={2}>
                  {formData.hobbies.map((hobby, index) => (
                    <WrapItem key={index}>
                      <Tag colorScheme="green" size="lg">
                        {hobby}
                        <TagCloseButton onClick={() => removeItem('hobbies', hobby)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>🌐 Languages</FormLabel>
                <HStack>
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add a language"
                    size="lg"
                  />
                  <Button onClick={() => addItem('languages', newLanguage, setNewLanguage)}>
                    Add
                  </Button>
                </HStack>
                <Wrap mt={2}>
                  {formData.languages.map((language, index) => (
                    <WrapItem key={index}>
                      <Tag colorScheme="purple" size="lg">
                        {language}
                        <TagCloseButton onClick={() => removeItem('languages', language)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>💡 First Date Ideas</FormLabel>
                <HStack>
                  <Input
                    value={newDateIdea}
                    onChange={(e) => setNewDateIdea(e.target.value)}
                    placeholder="Add a first date idea"
                    size="lg"
                  />
                  <Button onClick={() => addItem('firstDateIdeas', newDateIdea, setNewDateIdea)}>
                    Add
                  </Button>
                </HStack>
                <Wrap mt={2}>
                  {formData.firstDateIdeas.map((idea, index) => (
                    <WrapItem key={index}>
                      <Tag colorScheme="orange" size="lg">
                        {idea}
                        <TagCloseButton onClick={() => removeItem('firstDateIdeas', idea)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
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

              <HStack spacing={4} width="100%" justify="flex-end">
                <Button
                  colorScheme="gray"
                  onClick={onClose}
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  type="submit"
                  size="lg"
                >
                  Save Changes
                </Button>
              </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfileForm;