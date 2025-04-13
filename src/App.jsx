import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import Home from './components/Home';
import SignIn from './components/SignIn';
import CreateProfile from './components/CreateProfile';
import EditProfile from './components/EditProfile';
import EditFields from './components/EditFields';
import WaitingPage from './components/WaitingPage';

function App() {
  return (
    <ChakraProvider>
      <ProfileProvider>
        <Router>
          <Box minH="100vh" bg="gray.50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/edit-fields" element={<EditFields />} />
              <Route path="/waiting" element={<WaitingPage />} />
            </Routes>
          </Box>
        </Router>
      </ProfileProvider>
    </ChakraProvider>
  );
}

export default App; 