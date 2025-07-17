
export default function StepRating({ data, setData, next }) {
  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Rate the Course</h2>

      {['greenRating', 'fairwayRating', 'roughRating', 'staffRating'].map((field) => (
        <div key={field} className="mb-4">
            <label className="block font-medium capitalize">
                {field.replace("Rating", "") === "green" ? "Greens" : 
                field.replace("Rating", "") === "fairway" ? "Fairways" :
                field.replace("Rating", "") === "rough" ? "Rough" :
                field.replace("Rating", "") === "staff" ? "Staff" : field}
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

      <button onClick={next} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Next
      </button>
    </div>
  );
}