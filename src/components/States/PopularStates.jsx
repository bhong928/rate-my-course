import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";
import StateCard from "./StateCard";

export default function PopularStates() {
    // Local state to store the top 10 states
    const [states, setStates] = useState([]);

    useEffect(() => {
        async function fetchPopularStates() {
            try {
                // Create a query: order by totalReviews, get top 10
                const q = query (
                    collection(db, "states"),
                    orderBy("totalReviews", "desc"),
                    limit(10)
                );

                // Execute the Query
                const snapshot = await getDocs(q);

                // Format the results
                const stateData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // save to state
                setStates(stateData);
            } catch (error) {
                console.error("Error fetching popular states:", error);
            }
        }
        fetchPopularStates();
    }, []);

    return(
        <section className="px-6 py-8">
            <h2 className="text-2xl mb-4">
                Most Popular States for Golf
            </h2>
            <div className="flex overflow-x-auto gap-6 pb-4">
                {states.map((state) => (
                    <StateCard
                        key={state.id}
                        name={state.name}
                        image={state.imageUrl}
                        reviews={state.totalReviews}
                        slug={state.id}
                    />
                ))}
            </div>

        </section>
    )
}