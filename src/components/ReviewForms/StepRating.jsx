export default function StepRating({ data, setData, next }) {
  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const allRatingsFilled =
    data.greenRating > 0 &&
    data.fairwayRating > 0 &&
    data.roughRating > 0 &&
    data.staffRating > 0;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Rate the Course</h2>

      {["greenRating", "fairwayRating", "roughRating", "staffRating"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block font-medium capitalize">
            {field.replace("Rating", "").replace(/^./, (c) => c.toUpperCase())}:
          </label>
          <input
            type="number"
            min={1}
            max={5}
            value={data[field]}
            onChange={(e) => handleChange(field, Number(e.target.value))}
            className="w-full border rounded px-3 py-2 text-sm mt-1"
            required
          />
        </div>
      ))}

      <button
        onClick={next}
        disabled={!allRatingsFilled}
        className={`mt-4 px-4 py-2 rounded text-white ${
          allRatingsFilled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
}