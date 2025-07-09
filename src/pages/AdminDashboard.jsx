import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";

export default function AdminDashboard() {
  const [pendingCourses, setPendingCourses] = useState([]);

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

  return (
    <div className="max-w-4xl mx-auto p-4">
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
              {/* Add approve button later */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}