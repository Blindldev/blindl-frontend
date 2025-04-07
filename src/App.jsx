import React, { useEffect } from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import ProfileForm from './components/ProfileForm';
import WaitingScreen from './components/WaitingScreen';
import { ProfileProvider } from './context/ProfileContext';
import SignUp from './components/SignUp';
import PersonalityQuestions from './components/PersonalityQuestions';

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <ProfileProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<ProtectedProfileRoute><ProfileForm /></ProtectedProfileRoute>} />
            <Route path="/waiting" element={<ProtectedRoute><WaitingScreen /></ProtectedRoute>} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/personality" element={<PersonalityQuestions />} />
          </Routes>
        </Router>
      </ProfileProvider>
    </ChakraProvider>
  );
}

// Protected route component for waiting screen
const ProtectedRoute = ({ children }) => {
  const profile = JSON.parse(localStorage.getItem('profile'));
  if (!profile) {
    return <Navigate to="/" />;
  }
  return children;
};

// Protected route component for profile form
const ProtectedProfileRoute = ({ children }) => {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem('profile'));
  const isNewAccount = localStorage.getItem('isNewAccount') === 'true';
  const newAccountEmail = localStorage.getItem('newAccountEmail');

  useEffect(() => {
    if (!profile && !isNewAccount && !newAccountEmail) {
      // Clear any partial state
      localStorage.removeItem('isNewAccount');
      localStorage.removeItem('newAccountEmail');
      navigate('/');
    }
  }, [profile, isNewAccount, newAccountEmail, navigate]);

  if (!profile && !isNewAccount && !newAccountEmail) {
    return null;
  }

  return children;
};

export default App; 