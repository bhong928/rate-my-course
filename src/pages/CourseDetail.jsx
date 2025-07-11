import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// This will be the dynamic page that loads based on the course ID in the URL
export default function CourseDetail() {
    const {stateId, courseId} = useParams(); // reference state id and course id from the url
    const [course, setCourse] = useState(null); // local variables
    const [loading, setLoading] = useState(true); // more local variables

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
        fetchCourse();
    }, [stateId, courseId]);

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>
    }

    if (!course) {
        return <p className="text-center mt-10">Course not found</p>
    }

    return(
        <div className="max-w-4xl mx-auto p-4">
            <img src={course.imageUrl} alt={course.name} className="rounded mb-4" />
            <h1 className="text-2xl font-bold">{course.name}</h1>
            <p className="text-gray-500">{course.city}, {stateId}</p>
            {/* show reviews here */}
        </div>
    )
}