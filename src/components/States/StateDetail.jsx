import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function StateDetail() {
  const { stateId } = useParams();
  const [groupedCourses, setGroupedCourses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
        try {
        const ref = collection(db, "states", stateId, "courses");

        // Only fetch approved courses
        const q = query(ref, where("approved", "==", true));
        const snapshot = await getDocs(q);
        const courses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const grouped = {};
        for (const course of courses) {
            const city = course.city || "Unknown City";
            if (!grouped[city]) grouped[city] = [];
            grouped[city].push(course);
        }

        // Sort cities and courses
        const sorted = Object.keys(grouped)
            .sort()
            .reduce((obj, city) => {
            obj[city] = grouped[city].sort((a, b) => a.name.localeCompare(b.name));
            return obj;
            }, {});

        setGroupedCourses(sorted);
        } catch (err) {
        console.error("Failed to fetch courses:", err);
        } finally {
        setLoading(false);
        }
    }

    fetchCourses();
    }, [stateId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Golf Courses in {stateId.toUpperCase()}
      </h1>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        Object.entries(groupedCourses).map(([city, courses]) => (
          <div key={city} className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-green-700">{city}</h2>
            <ul className="ml-4 list-disc space-y-1">
              {courses.map((course) => (
                <li key={course.id}>
                  <a
                    href={`/states/${stateId}/courses/${course.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {course.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}