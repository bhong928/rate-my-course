// components/ReviewForms/EditReviewForm.jsx

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "react-toastify";

export default function EditReviewForm({ review, onCancel, onUpdate }) {
  const [formData, setFormData] = useState({
    greenRating: review.greenRating,
    fairwayRating: review.fairwayRating,
    roughRating: review.roughRating,
    staffRating: review.staffRating,
    comments: review.comments,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const reviewRef = doc(db, "states", review.stateId, "courses", review.courseId, "reviews", review.id);
      await updateDoc(reviewRef, {
        ...formData,
        approved: false, // mark for re-approval
      });

      toast.success("Review updated and pending re-approval!");
      onUpdate(); // refetch or trigger UI update
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {["greenRating", "fairwayRating", "roughRating", "staffRating"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize">
              {field.replace("Rating", "")}
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={formData[field]}
              onChange={(e) => handleChange(field, Number(e.target.value))}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Comments</label>
        <textarea
          value={formData.comments}
          onChange={(e) => handleChange("comments", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}