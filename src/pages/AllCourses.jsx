import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../lib/firebase";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AllCourses() {

    const [ coursesByState, setCoursesByState ] = useState({});
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        async function fetchAllCourses() {
            try {
                const statesSnapshot = await getDocs(collection(db, "states"));
                const stateDocs = statesSnapshot.docs;

                const data = {};

                const promises = stateDocs.map(async (stateDoc) => {
                const stateId = stateDoc.id;
                const stateName = stateDoc.data().name;

                const coursesSnapshot = await getDocs(
                    collection(db, "states", stateId, "courses")
                );

                const approvedCourses = coursesSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data(), stateId }))
                    .filter(course => course.approved)
                    .sort((a, b) => a.name.localeCompare(b.name));

                return approvedCourses.length > 0 ? { [stateName]: approvedCourses } : null;
                });

                const results = await Promise.all(promises);

                // Merge and sort state results
                const combined = results
                .filter(Boolean)
                .reduce((acc, curr) => ({ ...acc, ...curr }), {});

                const sortedStates = Object.keys(combined)
                .sort()
                .reduce((acc, key) => {
                    acc[key] = combined[key];
                    return acc;
                }, {});

                setCoursesByState(sortedStates);

            } catch(err) {
                console.error("Error fetching courses:", err)
            } finally {
                setLoading(false);
            }
        }

        fetchAllCourses();
    }, []);

    return(
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">States and Courses</h1>

            {loading ? (
                <LoadingSpinner message="Loading Courses..." />
            ) : (
                Object.entries(coursesByState).map(([state, courses]) => (
                    <div key={state} className="mb-8">
                        <h2 className="text-2xl font-semibold text-green-800 mb-2">{state}</h2>

                        <ul className="ml-4 list-disc space-y-1">
                            {courses.map((course) => (
                                <li key={course.id}>
                                    <a href={`/states/${course.stateId}/courses/${course.id}`}>
                                        {course.name} ({course.city})
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    )
}