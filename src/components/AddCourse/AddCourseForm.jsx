import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

import { useState } from "react";

export default function AddCourseForm({ currentUser }) {
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [stateId, setStateId] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const DEFAULT_GOLF_IMAGE = "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !city || !stateId) return;

        setLoading(true);
        try {
            const courseId = name.toLowerCase().replace(/\s+/g, "-");

            
            await setDoc(doc(db, "states", stateId, "courses", courseId), {
                approved: false,
                name,
                city,
                stateId,
                submittedAt: serverTimestamp(),
                submittedBy: currentUser?.email || "anonymous",
                imageUrl: DEFAULT_GOLF_IMAGE,
            });
            setSuccess(true);
            setName(""); setCity(""); setStateId("");
        } catch (err) {
            console.error("Failed to submit course:", err);
        } finally {
            setLoading(false);
        }
    };

    const US_STATES = [
        { id: "alabama", name: "Alabama" },
        { id: "alaska", name: "Alaska" },
        { id: "arizona", name: "Arizona" },
        { id: "arkansas", name: "Arkansas" },
        { id: "california", name: "California" },
        { id: "colorado", name: "Colorado" },
        { id: "connecticut", name: "Connecticut" },
        { id: "delaware", name: "Delaware" },
        { id: "florida", name: "Florida" },
        { id: "georgia", name: "Georgia" },
        { id: "hawaii", name: "Hawaii" },
        { id: "idaho", name: "Idaho" },
        { id: "illinois", name: "Illinois" },
        { id: "indiana", name: "Indiana" },
        { id: "iowa", name: "Iowa" },
        { id: "kansas", name: "Kansas" },
        { id: "kentucky", name: "Kentucky" },
        { id: "louisiana", name: "Louisiana" },
        { id: "maine", name: "Maine" },
        { id: "maryland", name: "Maryland" },
        { id: "massachusetts", name: "Massachusetts" },
        { id: "michigan", name: "Michigan" },
        { id: "minnesota", name: "Minnesota" },
        { id: "mississippi", name: "Mississippi" },
        { id: "missouri", name: "Missouri" },
        { id: "montana", name: "Montana" },
        { id: "nebraska", name: "Nebraska" },
        { id: "nevada", name: "Nevada" },
        { id: "new_hampshire", name: "New Hampshire" },
        { id: "new_jersey", name: "New Jersey" },
        { id: "new_mexico", name: "New Mexico" },
        { id: "new_york", name: "New York" },
        { id: "north_carolina", name: "North Carolina" },
        { id: "north_dakota", name: "North Dakota" },
        { id: "ohio", name: "Ohio" },
        { id: "oklahoma", name: "Oklahoma" },
        { id: "oregon", name: "Oregon" },
        { id: "pennsylvania", name: "Pennsylvania" },
        { id: "rhode_island", name: "Rhode Island" },
        { id: "south_carolina", name: "South Carolina" },
        { id: "south_dakota", name: "South Dakota" },
        { id: "tennessee", name: "Tennessee" },
        { id: "texas", name: "Texas" },
        { id: "utah", name: "Utah" },
        { id: "vermont", name: "Vermont" },
        { id: "virginia", name: "Virginia" },
        { id: "washington", name: "Washington" },
        { id: "west_virginia", name: "West Virginia" },
        { id: "wisconsin", name: "Wisconsin" },
        { id: "wyoming", name: "Wyoming" },
    ];
    
    return(
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-4 bg-white rounded shadow"
        >
            <h2 className="text-xl font-bold mb-4">
                Suggest a New Course
            </h2>

            {/* course name input */}
            <input
                type="text"
                placeholder="Course Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border px-3 mb-3 py-2 rounded text-sm text-gray-500"
            />

            {/* city input */}
            <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full border px-3 mb-3 py-2 rounded text-sm text-gray-500"
            />

            {/* state input */}
            <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                required
                className="w-full border px-3 mb-3 py-2 rounded text-sm text-gray-500"
            >
                <option value="">Select a State</option>
                {US_STATES.map((state) => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                ))}
            </select>

            <button
                type="submit"
                disabled={loading || !name || !city || !stateId}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {loading ? "Submitting..." : "Submit"}
            </button>

            {success && (
                <p className="text-green-600 mt-2 text-sm">
                Course Submitted for review
                </p>
            )}
        </form>
    );
}