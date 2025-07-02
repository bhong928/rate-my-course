import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import WriteReview from './pages/WriteReview';
import AllCourses from './pages/AllCourses';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Account from './pages/Account';
import { signInWithPopup, GoogleAuthProvider, sendSignInLinkToEmail, onAuthStateChanged } from 'firebase/auth';
import { auth } from "./lib/firebase"
import { useState, useEffect } from 'react';

function App() {
  // Modal State
  const [showAuth, setShowAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // track user

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe(); //cleanup
  }, []);

  // Google Sign in Logic
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowAuth(false); // Close modal on success
    } catch (error) {
      console.error("Google Sign In Error:", error)
    }
  }

  // Email Link Logic
  const handleSendEmailLink = async () => {
    const actionCodeSettings = {
      url: window.location.origin + "/Login", // Must Match Firebase console config
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email); // Store email for redirect
      alert("A sign-in link has been sent to your email.");
      setShowAuth(false); // close on success
    } catch (error) {
      console.error("Error Sending sign in Link:", error);
    }
  };

  return (
    <>
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onGoogleSignIn={handleGoogleSignIn}
        onSendEmailLink={handleSendEmailLink}
      />
      <Navbar onShowAuth={() => setShowAuth(true)} currentUser={currentUser}/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/account" element={<Account/>}/>
        <Route path="/courses" element={<AllCourses/>} />
        <Route path='/courses/:id' element={<CourseDetail/>}/>
        <Route path='/courses/:id/review' element={<WriteReview />} />
      </Routes>

    </>
      
  );
}

export default App;