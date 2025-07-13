
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import ReviewForm from "../components/ReviewForm"

import { getAuth } from "firebase/auth";


export default function WriteReview() {
    const { stateId, courseId } = useParams();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    return(
        <section className="max-w-xl mx-auto p-4">
            {/* Banner + Title + Rating */}
            <div className="relative h-60 md:h-80 mb-6 rounded overflow-hidden shadow">
                <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h1 className="text-2xl font-bold text-white">{course.name}</h1>
                    <p className="text-sm text-white">{course.city}, {stateId}</p>

                </div>
            </div>
            <h1 className="text-2xl font-bold mb-4">Write a Review</h1>
            <ReviewForm
                stateId={stateId}
                courseId={courseId}
                currentUser={currentUser}
                onReviewSubmitted={() => {}}
            />
        </section>
    )
}