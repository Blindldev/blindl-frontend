import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import SignIn from './components/SignIn';
import WaitingScreen from './components/WaitingScreen';
import ProfileForm from './components/ProfileForm';
import MatchNotification from './components/MatchNotification';
import CreateProfile from './components/CreateProfile';

function App() {
  return (
    <ChakraProvider>
      <ProfileProvider>
        <Router>
          <Box minH="100vh" bg="gray.50">
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/waiting" element={<WaitingScreen />} />
              <Route path="/profile" element={<ProfileForm />} />
              <Route path="/match" element={<MatchNotification />} />
            </Routes>
          </Box>
        </Router>
      </ProfileProvider>
    </ChakraProvider>
  );
}

export default App; 