export default function StepComment({ data, setData, next, back }) {
  const handleChange = (e) => {
    setData({ ...data, comments: e.target.value });
  };

  const isDisabled = data.comments.trim().length < 10; // you can adjust minimum length

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Leave a Comment</h2>

      <textarea
        value={data.comments}
        onChange={handleChange}
        rows={15}
        className="w-full border rounded px-3 py-2 text-lg"
        placeholder="Write your thoughts about the course..."
        required
      />

      <div className="flex justify-between mt-4">
        <button onClick={back} className="bg-gray-300 px-4 py-2 rounded">Back</button>
        <button
          onClick={next}
          disabled={isDisabled}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}