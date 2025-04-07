import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn.jsx';
import ProfileForm from './components/ProfileForm.jsx';
import WaitingScreen from './components/WaitingScreen.jsx';
import { ProfileProvider } from './context/ProfileContext';

function App() {
  return (
    <ProfileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/waiting" element={<WaitingScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ProfileProvider>
  );
}

export default App;
