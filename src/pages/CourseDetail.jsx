import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewForm from "../components/ReviewForm";

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getAuth } from "firebase/auth"; // ✅ Add this

export default function CourseDetail() {
  const { stateId, courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const auth = getAuth(); // ✅ Get auth instance
  const currentUser = auth.currentUser; // ✅ Get current user (may be null on first load)

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
    <div className="max-w-4xl mx-auto p-4">
      <img src={course.imageUrl} alt={course.name} className="rounded mb-4" />
      <h1 className="text-2xl font-bold">{course.name}</h1>
      <p className="text-gray-500">{course.city}, {stateId}</p>

      <h2 className="text-xl font-semi-bold mt-6 mb-2">Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="border p-4 rounded shadow">
              <p className="font-semibold">Rating: {r.rating}/5</p>
              <p>{r.comment}</p>
              <p className="text-sm text-gray-500 mt-1">
                By {r.user || "Anonymous"}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ReviewForm
        stateId={stateId}
        courseId={courseId}
        currentUser={currentUser}
        onReviewSubmitted={fetchReviews}
      />
    </div>
  );
}