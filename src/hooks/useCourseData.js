import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useCourseData(stateId, courseId) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

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

    if (stateId && courseId) {
      fetchCourse();
    }
  }, [stateId, courseId]);

  return { course, loading };
}