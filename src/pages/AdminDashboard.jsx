import { useEffect, useState } from "react";
import {
  collectionGroup,
  getDocs,
  query,
  doc,
  updateDoc,
  deleteDoc,
  where
} from "firebase/firestore";
import { db } from "../lib/firebase";

export default function AdminDashboard() {
  const [tab, setTab] = useState("courses");
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);

  // Fetch pending courses
  useEffect(() => {
    async function fetchPendingCourses() {
      try {
        const q = query(
          collectionGroup(db, "courses"),
          where("approved", "==", false)
        );
        const snapshot = await getDocs(q);
        const courses = snapshot.docs.map((doc) => {
          const stateId = doc.ref.parent.parent.id;
          return { id: doc.id, stateId, ...doc.data() };
        });
        setPendingCourses(courses);
      } catch (err) {
        console.error("Failed to fetch pending courses:", err);
      }
    }

    fetchPendingCourses();
  }, []);

  // Fetch pending reviews
  useEffect(() => {
    async function fetchPendingReviews() {
      try {
        const q = query(
          collectionGroup(db, "reviews"),
          where("approved", "==", false)
        );

        const snapshot = await getDocs(q);
        const reviews = snapshot.docs.map((doc) => {
          const courseRef = doc.ref.parent.parent;
          const stateRef = courseRef.parent.parent;

          return {
            id: doc.id,
            ref: doc.ref, // for approve/reject
            courseId: courseRef.id,
            stateId: stateRef.id,
            ...doc.data(),
          };
        });

        setPendingReviews(reviews);
      } catch (err) {
        console.error("Failed to fetch pending reviews:", err);
      }
    }

    fetchPendingReviews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Tabs */}
      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            tab === "courses" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("courses")}
        >
          Pending Courses
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "reviews" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("reviews")}
        >
          Pending Reviews
        </button>
      </div>

      {/* Pending Courses */}
      {tab === "courses" && (
        <>
          <h1 className="text-xl font-bold mb-4">Pending Courses</h1>
          {pendingCourses.length === 0 ? (
            <p>No pending courses found.</p>
          ) : (
            <ul className="space-y-3">
              {pendingCourses.map((course) => (
                <li
                  key={course.id}
                  className="p-4 border rounded shadow bg-white flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-gray-500">
                      {course.city}, {course.stateId}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        const courseRef = doc(
                          db,
                          "states",
                          course.stateId,
                          "courses",
                          course.id
                        );
                        await updateDoc(courseRef, { approved: true });
                        setPendingCourses((prev) =>
                          prev.filter((c) => c.id !== course.id)
                        );
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={async () => {
                        const courseRef = doc(
                          db,
                          "states",
                          course.stateId,
                          "courses",
                          course.id
                        );
                        await deleteDoc(courseRef);
                        setPendingCourses((prev) =>
                          prev.filter((c) => c.id !== course.id)
                        );
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Pending Reviews */}
      {tab === "reviews" && (
        <>
          <h1 className="text-xl font-bold mb-4">Pending Reviews</h1>
          {pendingReviews.length === 0 ? (
            <p>No pending reviews found.</p>
          ) : (
            <ul className="space-y-3">
              {pendingReviews.map((review) => (
                <li
                  key={review.id}
                  className="p-4 border rounded shadow bg-white"
                >
                  <p className="font-medium">{review.user || "Anonymous"}</p>
                  <p className="text-sm text-gray-700">
                    Greens: {review.greenRating} | Fairways: {review.fairwayRating} | Rough: {review.roughRating} | Staff: {review.staffRating}
                  </p>
                  <p className="text-sm text-gray-700">
                    Handicap: {review.handicap || "N/A"} | Players: {review.numPlayer || "N/A"}
                  </p>
                  {review.comments && (
                    <p className="mt-2 text-gray-800">{review.comments}</p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={async () => {
                        await updateDoc(review.ref, { approved: true });
                        setPendingReviews((prev) =>
                          prev.filter((r) => r.id !== review.id)
                        );
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={async () => {
                        await deleteDoc(review.ref);
                        setPendingReviews((prev) =>
                          prev.filter((r) => r.id !== review.id)
                        );
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}