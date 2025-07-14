import { useState } from "react";

import { db } from "../lib/firebase";
import { addDoc, serverTimestamp, doc, collection } from "firebase/firestore";


export default function ReviewForm({stateId, courseId, currentUser, onReviewSubmitted }) {
    const [overallRating, setOverallRating] = useState(0);
    const [comment, setComment] = useState("");
    const [greens, setGreens] = useState(0);
    const [fairways, setFairways] = useState(0);
    const [rough, setRough] = useState(0);
    const [staff, setStaff] = useState(0);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!overallRating || !comment || !greens || !fairways || !rough || !staff) {
            setError("All fields including category ratings are required.");
            return;
        }

        setSubmitting(true);
        try {
            const reviewRef = collection(db, "states", stateId, "courses", courseId, "reviews");
            await addDoc(reviewRef, {
                overallRating,
                comment,
                greens,
                fairways,
                rough,
                staff,
                user: currentUser?.email || "Anonymous",
                createdAt: serverTimestamp(),
            });

            // Reset the form
            setOverallRating(0);
            setComment("");
            setGreens(0);
            setFairways(0);
            setRough(0);
            setStaff(0);

            // Refresh review list in parent (Course Detail Page)
            if (onReviewSubmitted) {
                await onReviewSubmitted();
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            setError("Something went wrong. Please try again");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded shadow">
            <h3 className="text-xl text-center font-semibold mb-6">Submit a Review</h3>

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            {/* Greens Rating */}
            <label>
                How were the greens?
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={greens}
                    onChange={(e) => setGreens(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2 text-sm mt-1"
                />
            </label>

            {/* Fairways Rating */}
            <label>
                How were the fairways?
                <input
                    type="number"
                    min={1}
                    max={5}
                    value={fairways}
                    onChange={(e) => setFairways(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2 text-sm mt-1"
                />
            </label>

            {/* Rough Rating */}
            <label>
                How were the roughs?
                <input
                    type="number"
                    min={1}
                    max={2}
                    value={rough}
                    onChange={(e) => setRough(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2 text-sm mt-1"
                />
            </label>

            {/* Staff Rating */}
            <label>
                Rate the staff
                <input
                    type="number"
                    min={1}
                    max={5}
                    value={staff}
                    onChange={(e) => setStaff(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2 text-sm mt-1"
                />
            </label>

            {/* Overall Rating */}
            <label className="block mb-3">
                Overall Rating (1-5):
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={overallRating}
                    onChange={(e) => setOverallRating(Number(e.target.value))}
                    className="block w-full border rounded px-3 py-2 text-sm mt-1"
                    required
                />
            </label>

            {/* Comment Area */}
            <label className="block mb-4">
                Comment: 
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="block w-full border rounded px-3 py-2 text-sm mt-1"
                    rows="10"
                    required
                />
            </label>

            <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {submitting ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    )
}