import { useState } from "react";

import { db } from "../lib/firebase";
import { addDoc, serverTimestamp, doc, collection } from "firebase/firestore";


export default function ReviewForm() {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!rating || !comment) {
            setError("Rating and comment are required.");
            return;
        }

        setSubmitting(true);
        try {
            const reviewRef = collection(db, "states", stateId, "courses", courseId, "reviews");
            await addDoc(reviewRef, {
                rating,
                comment,
                user: currentUser?.email || "Anonymous",
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error submitting review:", err);
            setError("Something went wrong. Please try again");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 bg-white p-4 rounded shadow">
            <h3>Submit a Review</h3>

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            <label>
                Rating (1-5):
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="block w-full border rounded px-3 py-2 text-sm mt-1"
                    required
                />
            </label>

            <label className="block mb-4">
                Comment: 
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="block w-full border rounded px-3 py-2 text-sm mt-1"
                    rows="3"
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