import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import StateCard from "./StateCard";

export default function UsStates() {
    // Local state to hold the list of States
    const [states, setStates] = useState([]);

    // Load data once on component mount
    useEffect(() => {
        async function fetchStates() {
            try {
                // Reference to the "states" collection
                const statesRef = collection(db, "states");

                // Fetch all documents in the collection
                const snapshot = await getDocs(statesRef);

                // Map the docs into an array of { id ... data }
                const statesData = snapshot.docs.map( doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Update local states
                setStates(statesData);
            } catch (err) {
                console.error("Failed to fetch states:", err);
            }
        }
    fetchStates();
    }, []);

    return (
        <section className="px-6 py-8">
            <h2 className="text-2xl mb-4">U.S. States</h2>
            <div className="flex overflow-x-auto gap-6 pb-4">
                {states.map((states) => (
                    <StateCard
                    key={states.id}
                    name={states.name}
                    image={states.imageUrl}
                    review={states.totalReviews}
                    slug={states.id} // use the doc ID as the slug
                    />
                ))}
            </div>
        </section>
    );
}