import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getAuth } from "firebase/auth"; 

export default function CourseDetail() {
  const { stateId, courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const auth = getAuth(); // Get auth instance
  const currentUser = auth.currentUser; // Get current user (may be null on first load)

  const navigate = useNavigate();

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

  async function fetchReviews() {
    try {
      const reviewRef = collection(db, "states", stateId, "courses", courseId, "reviews");
      const snapshot = await getDocs(reviewRef);
      const reviewList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewList);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  }

  useEffect(() => {
    if (course) {
      fetchReviews();
    }
  }, [course]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!course) return <p className="text-center mt-10">Course not found</p>;

  return (
    <div className="w-full mx-auto p-4">

        {/* Banner + Title + Rating */}
        <div className="relative h-60 md:h-80 mb-6 rounded overflow-hidden shadow">
            <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h1 className="text-2xl font-bold text-white">{course.name}</h1>
                <p className="text-sm text-white">{course.city}, {stateId}</p>

            </div>
        </div>

        {/* Layout Grid: Reviews List + Sidebar */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-5">
            {/* Sidebar */}
            <div className="bg-white md:col-span-5 rounded shadow p-4 border">
                <h3 className="text-xl font-semibold mb-4">Course Summary</h3>
                <p className="text-sm">{course.description || "No summary provided for this course."}
                </p>

                <h4 className="mt-4 font-medium">Overall Breakdown</h4>
                <ul className="text-sm mt-2">
                    <li>⭐ Greens</li>
                    <li>⭐ Fairways</li>
                    <li>⭐ Rough</li>
                    <li>⭐ Staff</li>
                </ul>

                {/* Buttons */}
                <div className="mt-6 space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                    onClick={() => navigate(`/write-review/${stateId}/${courseId}`)}
                    >
                        Write a Review
                    </button>
                    {/* STILL NEEDS WORK */}
                    <button className="w-full border py-2 rounded text-sm">
                        Upload Photo
                    </button>
                </div>
            </div>

            {/* Reviews */}
            <div className="md:col-span-5 border shadow rounded p-4">
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    <ul className="space-y-4">
                    {reviews.map((r) => (
                        <li key={r.id} className="">
                        <p className="font-semibold">Rating: {r.rating}/5</p>
                        <p className="text-gray-700">{r.comment}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            By {r.user || "Anonymous"}
                        </p>
                        </li>
                    ))}
                    </ul>
                )}
            </div>
        </div>
    </div>
  );
}