import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import WriteReview from './pages/WriteReview';
import AllCourses from './pages/AllCourses';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';

import {
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged
} from 'firebase/auth';

import { auth } from "./lib/firebase";
import { ADMIN_EMAILS } from './lib/admin';
import { useState, useEffect } from 'react';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(user ? ADMIN_EMAILS.includes(user.email) : false);
    });

    return () => unsubscribe();
  }, []);

  // Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowAuth(false);
    } catch (error) {
      console.error("Google Sign In Error:", error);
    }
  };

  // Email link sign-in
  const handleSendEmailLink = async () => {
    const actionCodeSettings = {
      url: "https://rate-my-course-green.vercel.app", // Live Deployment
      // url: "http://localhost:5173/account", // Test on Local Host
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      alert("A sign-in link has been sent to your email.");
      setShowAuth(false);
    } catch (error) {
      console.error("Error Sending sign in Link:", error);
    }
  };

  // If user clicks email sign-in link
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = window.localStorage.getItem("emailForSignIn");
      if (!storedEmail) {
        storedEmail = window.prompt("Please confirm your email");
      }

      signInWithEmailLink(auth, storedEmail, window.location.href)
        .then((result) => {
          window.localStorage.removeItem("emailForSignIn");
          setCurrentUser(result.user);
          setIsAdmin(ADMIN_EMAILS.includes(result.user.email));
          setShowAuth(false);
        })
        .catch((error) => {
          console.error("Sign in with email link failed:", error);
        });
    }
  }, []);

  return (
    <>
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onGoogleSignIn={handleGoogleSignIn}
        onSendEmailLink={handleSendEmailLink}
        email={email}
        setEmail={setEmail}
      />
      <Navbar
        onShowAuth={() => setShowAuth(true)}
        currentUser={currentUser}
        isAdmin={isAdmin}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:id/review" element={<WriteReview />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;