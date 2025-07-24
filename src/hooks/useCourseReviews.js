import { collection, getDocs, query, orderBy, where } from "firebase/firestore"; // <— add `where`
import { db } from "../lib/firebase";
import { useEffect, useState } from "react";

export function useCourseReviews(stateId, courseId) {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const reviewRef = collection(db, "states", stateId, "courses", courseId, "reviews");

        const reviewQuery = query(
          reviewRef,
          where("approved", "==", true),         // Only approved reviews
          orderBy("createdAt", "desc")           // Newest first
        );

        const snapshot = await getDocs(reviewQuery);
        const reviewList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewList);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    }

    if (stateId && courseId) {
      fetchReviews();
    }
  }, [stateId, courseId]);

  return { reviews, loadingReviews, setReviews };
}