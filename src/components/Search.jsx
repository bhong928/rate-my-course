import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [states, setStates] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Load states and courses on mount
  useEffect(() => {
    async function fetchData() {
      const statesSnap = await getDocs(collection(db, "states"));
      const loadedStates = statesSnap.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      const courseList = [];

      for (const stateDoc of statesSnap.docs) {
        const courseSnap = await getDocs(
          collection(db, "states", stateDoc.id, "courses")
        );
        courseSnap.forEach((courseDoc) => {
          courseList.push({
            id: courseDoc.id,
            stateId: stateDoc.id,
            name: courseDoc.data().name,
          });
        });
      }

      setStates(loadedStates);
      setCourses(courseList);
    }
    fetchData();
  }, []);

  // Handle Search
  useEffect(() => {
    const term = query.toLowerCase();
    if (!term) {
      setResults([]);
      return;
    }

    const stateMatches = states.filter((s) =>
      s.name.toLowerCase().includes(term)
    );
    const courseMatches = courses.filter((c) =>
      c.name.toLowerCase().includes(term)
    );

    setResults([...stateMatches, ...courseMatches]);
  }, [query, states, courses]);

  // Navigate when result clicked
  const handleResultClick = (result) => {
    if (result.stateId) {
      // Course
      navigate(`/states/${result.stateId}/courses/${result.id}`);
    } else {
      // State
      navigate(`/states/${result.id}`);
    }
  };

  return (
    <section
      className="bg-cover bg-bottom bg-no-repeat relative"
      style={{
        backgroundImage: "url('background.jpg')",
        height: "600px",
      }}
    >
      <div className="flex items-center justify-center absolute inset-0 bg-black bg-opacity-20">
        <div className="text-center text-white px-4 w-full mx-w-xl">
          <h1 className="sm:text-3xl md:text-3xl text-white font-bold text-center mb-6 ">
            Your resource for golf course reviews
          </h1>

          {/* Search Bar and Results */}
          <div className="flex flex-col items-center w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a golf course or state"
              className="w-full max-w-3xl mx-auto px-4 py-3 rounded-md text-black focus:outline-none focus:ring-green-500 shadow mb-2"
            />

            {/* Matching Results */}
            {query && results.length > 0 && (
              <ul className="w-full max-w-3xl bg-white text-left text-black rounded shadow max-h-60 overflow-y-auto">
                {results.map((item, index) => (
                  <li
                    key={index}
                    className="hover:bg-gray-200 cursor-pointer px-4 py-2"
                    onClick={() => handleResultClick(item)}
                  >
                    {item.name}{" "}
                    {item.stateId ? (
                      <span className="text-xs text-gray-500">(Course)</span>
                    ) : (
                      <span className="text-xs text-gray-500">(State)</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* No Results + Add Course */}
            {query && results.length === 0 && (
              <div className="w-full max-w-3xl bg-white text-black rounded shadow p-4 mt-2 text-center">
                <p className="mb-2">
                  No results found for <strong>{query}</strong>.
                </p>
                <Link
                  to="/add-course"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
                >
                  Add Course
                </Link>
              </div>
            )}
          </div>

          <div className="text-center text-white mt-4">
            <Link
              to="/courses"
              className="inline-block hover:underline text-white rounded shadow"
            >
              All Courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}