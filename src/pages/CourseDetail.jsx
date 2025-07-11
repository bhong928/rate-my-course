import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

// This will be the dynamic page that loads based on the course ID in the URL
export default function CourseDetail() {
    const {stateId, courseId} = useParams(); // reference state id and course id from the url
    const [course, setCourse] = useState(null); // local variables
    const [loading, setLoading] = useState(true); // more local variables
    const [reviews, setReviews] = useState([]);

    // Fetch course data
    useEffect(() => {
        async function fetchCourse() {
            try {
                const ref = doc(db, "states", stateId, "courses", courseId);
                const snapshot = await getDoc(ref);
                if (snapshot.exists()) {
                    setCourse(snapshot.data());
                }
            } catch (err) {
                console.error("Failed to fetch course:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [stateId, courseId]);

    // Fetch Reviews for course
    useEffect(() => {
        async function fetchReviews () {
            try {
                const reviewRef = collection(db, "states", stateId, "courses", courseId, "reviews");
                const snapshot = await getDocs(reviewRef);
                const reviewList = snapshot.docs.map(doc=> ({ id: doc.id, ...doc.data() }));
                setReviews(reviewList);
            } catch (err) {
                console.error("Failed to fetch reviews:" , err);
            }
        }

        if (course) {
            fetchReviews();
        }
    }, [course]);

    // All hooks need to be rendered before any conditional return statements

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>
    }

    if (!course) {
        return <p className="text-center mt-10">Course not found</p>
    }

    return(
        <div className="max-w-4xl mx-auto p-4">
            <img src={course.imageUrl} alt={course.name} className="rounded mb-4" />
            <h1 className="text-2xl font-bold">{course.name}</h1>
            <p className="text-gray-500">{course.city}, {stateId}</p>

            {/* show reviews here */}
            <h2 className="text-xl font-semi-bold mt-6 mb-2">Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <ul className="space-y-4">
                    {reviews.map((r) => (
                        <li key={r.id} className="border p-4 rounded shadow">
                            {/* Star Rating */}
                            <p className="font-semibold">Rating: {r.rating}/5</p> 
                            <p>{r.comment}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                By {r.user || "Anonymous"}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}