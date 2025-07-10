import { collectionGroup, getDocs, query, doc, updateDoc, deleteDoc, where } from "firebase/firestore";
import { db } from "../lib/firebase";

import { useEffect, useState } from "react";


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

                {/* Add approve button and remove approved course from pending list */}
                <button
                    onClick={async() => {
                        try {
                            const courseRef = doc(db, "states", course.stateId, "courses", course.id);
                            await updateDoc(courseRef, { approved: true });
                            setPendingCourses(pendingCourses.filter((c) => c.id !== course.id)); //removes from pending course list
                        } catch (err){
                            console.error("Failed to approve course:", err)
                        }
                    }}
                    className="bg-green-400 px-3 py-1 border rounded hover:bg-green-500 text-white text-sm"
                >
                    Approve
                </button>

                {/* Add reject button*/}
                <button
                    onClick={async() => {
                        try {
                            const courseRef = doc(db, "states", course.stateId, "courses", course.id);
                            await deleteDoc(courseRef); // delete the doc from firebase
                            setPendingCourses(pendingCourses.filter((c) => c.id !== course.id)); // removes course from list

                        } catch(err) {
                            console.error("Failed to reject course:", err)
                        }
                    }}
                    className="bg-red-400 px-3 py-1 border rounded hover:bg-red-500 text-white text-sm"
                >
                    Reject
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}