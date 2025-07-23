// react
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUsers } from 'react-icons/fa';
import { GiGolfTee } from 'react-icons/gi';

// firebase
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getAuth } from "firebase/auth"; 

// components
import Banner from "../components/Banner";

// hooks
import { useCourseData } from "../hooks/useCourseData";
import { useCourseReviews } from "../hooks/useCourseReviews";

import { formatDistanceToNow } from "date-fns";

export default function CourseDetail() {
    const { stateId, courseId } = useParams();
    const navigate = useNavigate();

    const { course, loading } = useCourseData(stateId, courseId);
    const { reviews, loadingReviews } = useCourseReviews(stateId, courseId);

    // Calculate overall average
    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (sum, r) =>
                        sum +
                        (r.greenRating + r.fairwayRating + r.roughRating + r.staffRating) / 4,
                    0
                ) / reviews.length
            ).toFixed(1)
            : null;

    if (loading) return <p className="text-center mt-10">Loading course...</p>;
    if (!course) return <p className="text-center mt-10">Course not found</p>;

    return (
        <div className="w-full mx-auto p-4">
            {/* Banner */}
            <Banner 
                imageUrl={course.imageUrl} 
                title={course.name} 
                subtitle={`${course.city}, ${stateId}`} 
            />

            {/* Layout Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-5">
                
                {/* Sidebar */}
                <div className="bg-white md:col-span-5 rounded shadow p-4 border">
                    <h3 className="text-xl font-semibold mb-4">Course Summary</h3>
                    <p className="text-sm">
                        {course.description || "No summary provided for this course."}
                    </p>

                    <h4 className="mt-4 font-medium">Overall Breakdown</h4>
                    <ul className="text-sm mt-2">
                        <li>⭐ Greens</li>
                        <li>⭐ Fairways</li>
                        <li>⭐ Rough</li>
                        <li>⭐ Staff</li>
                    </ul>

                    {/* Overall Average Rating */}
                    {averageRating && (
                        <p className="mt-2 font-medium text-yellow-600">
                            ⭐ Overall Average: {averageRating}/5.0
                        </p>
                    )}

                    {/* Buttons */}
                    <div className="mt-6 space-y-2">
                        <button
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                            onClick={() => navigate(`/write-review/${stateId}/${courseId}`)}
                        >
                            Write a Review
                        </button>
                        <button className="w-full border py-2 rounded text-sm">
                            Upload Photo
                        </button>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="md:col-span-5 border shadow rounded p-4">
                    <h2 className="text-xl font-semibold mb-4 text-center">Reviews</h2>

                    {reviews.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        <ul className="space-y-6">
                            {reviews.map((r) => (
                                <li key={r.id} className="border-b pb-6 relative bg-white rounded shadow px-4 pt-4">
                                <p className="font-semibold">
                                    Greens: {r.greenRating} | Fairways: {r.fairwayRating} | Rough: {r.roughRating} | Staff: {r.staffRating}
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                    Average: {((r.greenRating + r.fairwayRating + r.roughRating + r.staffRating) / 4).toFixed(1)}/5
                                </p>
                                {r.comments && (
                                    <p className="mt-2 text-gray-800">{r.comments}</p>
                                )}
                                {/* <p className="text-xs text-gray-500 mt-1">By {r.user || "Anonymous"}</p> */}

                                {/* Handicap & Players (bottom right corner inside each review) */}
                                <div className="mt-3 flex flex-wrap justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                        <GiGolfTee className="text-green-600" />
                                        <span>Handicap: {r.handicap}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                        <FaUsers className="text-blue-600" />
                                        <span>Players: {r.numPlayer}</span>
                                        </div>
                                    </div>

                                    <span className="text-gray-400">{formatDistanceToNow(r.createdAt.toDate())} ago</span>
                                </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}