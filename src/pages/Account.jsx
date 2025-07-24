import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useUserReviews } from "../hooks/useUserReviews";
import { formatDistanceToNow } from "date-fns";
import EditReviewForm from "../components/ReviewForms/EditReviewForm";
import { doc, deleteDoc,increment, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Account() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("settings");
  const [editingReview, setEditingReview] = useState(null);
  const [filter, setFilter] = useState("all"); // NEW: filter state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const { userReviews, loading } = useUserReviews(authLoading ? null : user?.email);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleDelete = async (review) => {
    const confirm = window.confirm("Are you sure you want to delete this review?");
    if (!confirm) return;

    try {
      const reviewDocRef = doc(
        db,
        "states",
        review.stateId,
        "courses",
        review.courseId,
        "reviews",
        review.id
      );

      // Delete the review
      await deleteDoc(reviewDocRef);

      // Only decrement if the review was approved
      if (review.approved) {
        const stateDocRef = doc(db, "states", review.stateId);
        await updateDoc(stateDocRef, {
          totalReviews: increment(-1),
        });
      }

      toast.success("Review deleted.");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review.");
    }
  };

  const filteredReviews = userReviews.filter((r) => {
    if (filter === "approved") return r.approved;
    if (filter === "pending") return !r.approved;
    return true;
  });

  return (
    <section className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-80 px-4 py-4 border border-b md:border-b-0 md:border-r">
        <h2 className="text-lg font-semibold mb-1">My Account</h2>
        <p className="text-sm mb-4">{user?.email}</p>

        <ul className="space-y-2">
          <li
            onClick={() => setActiveTab("settings")}
            className={`p-2 rounded cursor-pointer ${
              activeTab === "settings" ? "bg-gray-300" : "hover:bg-gray-100"
            }`}
          >
            Settings
          </li>
          <li
            onClick={() => setActiveTab("posts")}
            className={`p-2 rounded cursor-pointer ${
              activeTab === "posts" ? "bg-gray-300" : "hover:bg-gray-100"
            }`}
          >
            My Posts
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          {activeTab === "settings" ? "Settings" : "My Posts"}
        </h2>

        <hr className="my-4 border-gray-300" />

        {activeTab === "settings" ? (
          <button
            onClick={handleSignOut}
            className="text-lg border rounded px-6 py-2 hover:bg-gray-100"
          >
            Sign Out
          </button>
        ) : loading ? (
          <p>Loading your posts...</p>
        ) : userReviews.length === 0 ? (
          <p>You have no posts yet.</p>
        ) : (
          <>
            {/* Filter Buttons */}
            <div className="mb-6 flex gap-4 text-sm">
              <button
                className={`px-3 py-1 rounded ${
                  filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  filter === "approved" ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setFilter("approved")}
              >
                Approved
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
            </div>

            {/* Review Cards */}
            <ul className="space-y-4">
              {filteredReviews.map((r) => (
                <li key={r.id} className="p-4 border rounded shadow bg-white">
                  <p className="text-sm text-gray-500 mb-1">
                    {formatDistanceToNow(r.createdAt?.toDate?.())} ago •{" "}
                    <span
                      className={`font-semibold ${
                        r.approved ? "text-green-600" : "text-yellow-500"
                      }`}
                    >
                      {r.approved ? "Approved" : "Pending Approval"}
                    </span>
                  </p>
                  <p className="text-lg font-bold mb-1">{r.courseName}</p>
                  <p className="font-medium text-lg mb-1">
                    Average Rating:{" "}
                    {(
                      (r.greenRating +
                        r.fairwayRating +
                        r.roughRating +
                        r.staffRating) /
                      4
                    ).toFixed(1)}
                    /5
                  </p>
                  <p className="text-sm text-gray-800">{r.comments}</p>
                  <div className="flex justify-end gap-6 mt-3">
                    <button
                      onClick={() => setEditingReview(r)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Edit Form */}
                  {editingReview?.id === r.id && (
                    <EditReviewForm
                      review={r}
                      onCancel={() => setEditingReview(null)}
                      onUpdate={() => {
                        setEditingReview(null);
                        window.location.reload();
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}