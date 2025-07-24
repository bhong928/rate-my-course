import { collectionGroup, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useEffect, useState } from "react";

export function useUserReviews(userEmail) {
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserReviews() {
      if (!userEmail) return;

      try {
        const reviewQuery = query(
          collectionGroup(db, "reviews"),
          where("user", "==", userEmail)
        );

        const reviewSnapshots = await getDocs(reviewQuery);

        const reviewsWithCourseInfo = await Promise.all(
          reviewSnapshots.docs.map(async (docSnap) => {
            const data = docSnap.data();

            // Parse stateId and courseId from the path
            const pathParts = docSnap.ref.path.split("/");
            const stateId = pathParts[1];
            const courseId = pathParts[3];

            const courseRef = doc(db, "states", stateId, "courses", courseId);
            const courseSnap = await getDoc(courseRef);
            const courseData = courseSnap.exists() ? courseSnap.data() : {};

            return {
              id: docSnap.id,
              stateId,
              courseId,
              courseName: courseData.name || "Unknown Course",
              ...data,
            };
          })
        );

        setUserReviews(reviewsWithCourseInfo);
      } catch (err) {
        console.error("Failed to fetch user reviews:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserReviews();
  }, [userEmail]);

  return { userReviews, loading };
}