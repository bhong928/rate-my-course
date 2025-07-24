// react
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

// firebase
import { getAuth } from "firebase/auth";

// components
import Banner from "../components/Banner";
import MultiStepReviewForm from "../components/ReviewForms/MultiStepReviewForm";

// hooks
import { useCourseData } from "../hooks/useCourseData"; // import the hook

// context
import { AuthContext } from "../App";

export default function WriteReview() {
    const { stateId, courseId } = useParams();
    const auth = getAuth();
    const { setShowAuth } = useContext(AuthContext); // Access auth modal trigger
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        setCurrentUser(user);

        // If no user is logged in, show auth modal
        if (!user) {
            setShowAuth(true);
        }
    });

    return () => unsubscribe();
    }, [auth, setShowAuth]);

    const { course, loading } = useCourseData(stateId, courseId); // use the hook

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!course) return <p className="text-center mt-10">Course not found</p>;
    if (!currentUser) return null; // Prevent form from rendering

    return (
    <section className="w-full mx-auto p-4">
      <Banner
        imageUrl={course.imageUrl}
        title={course.name}
        subtitle={`${course.city}, ${stateId}`}
      />

      <h1 className="text-4xl font-bold text-center">Write a Review</h1>

      <MultiStepReviewForm
        stateId={stateId}
        courseId={courseId}
        currentUser={currentUser}
      />
    </section>
  );
}