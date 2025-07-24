import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, query, addDoc, where, getDocs, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function StepReviewSummary({
  data,
  back,
  stateId,
  courseId,
  currentUser,
}) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    // Basic form validation
    if (
      !data.greenRating ||
      !data.fairwayRating ||
      !data.roughRating ||
      !data.staffRating ||
      !data.comments ||
      !data.handicap ||
      !data.numPlayer
    ) {
      setError("Please complete all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const reviewRef = collection(
        db,
        "states",
        stateId,
        "courses",
        courseId,
        "reviews"
      );

      // Check if user has already submmitted a review
      const q = query(reviewRef, where("user", "==", currentUser?.email || "Anonymous"));
      const existing = await getDocs(q);

      if (!existing.empty) {
        toast.info("You’ve already submitted a review for this course.");
        navigate(`/states/${stateId}/courses/${courseId}`);
        return;
      }

      await addDoc(reviewRef, {
        greenRating: data.greenRating,
        fairwayRating: data.fairwayRating,
        roughRating: data.roughRating,
        staffRating: data.staffRating,
        comments: data.comments,
        handicap: data.handicap,
        numPlayer: data.numPlayer,
        user: currentUser?.email || "Anonymous",
        approved: false,
        createdAt: serverTimestamp(),
      });

      toast.success("Review submitted and pending admin approval!");
      navigate(`/states/${stateId}/courses/${courseId}`);
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Review Summary</h2>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <ul className="text-sm space-y-2">
        <li>
          <strong>Greens:</strong> {data.greenRating}
        </li>
        <li>
          <strong>Fairways:</strong> {data.fairwayRating}
        </li>
        <li>
          <strong>Rough:</strong> {data.roughRating}
        </li>
        <li>
          <strong>Staff:</strong> {data.staffRating}
        </li>
        <li>
          <strong>Comments:</strong> {data.comments}
        </li>
        <li>
          <strong>Handicap:</strong> {data.handicap}
        </li>
        <li>
          <strong>Players:</strong> {data.numPlayer}
        </li>
      </ul>

      <div className="flex justify-between mt-6">
        <button
          onClick={back}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}