// react
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// firebase
import { getAuth } from "firebase/auth";

// components
import Banner from "../components/Banner";
import ReviewForm from "../components/ReviewForm";

// hooks
import { useCourseData } from "../hooks/useCourseData"; // import the hook

export default function WriteReview() {
    const { stateId, courseId } = useParams();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const { course, loading } = useCourseData(stateId, courseId); // use the hook

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!course) return <p className="text-center mt-10">Course not found</p>;

    return (
        <section className="w-full mx-auto p-4">
        <Banner 
            imageUrl={course.imageUrl} 
            title={course.name} 
            subtitle={`${course.city}, ${stateId}`} 
        />

        <h1 className="text-2xl font-bold mb-4">Write a Review</h1>
        <ReviewForm
            stateId={stateId}
            courseId={courseId}
            currentUser={currentUser}
            onReviewSubmitted={() => {}}
        />
        </section>
    );
}