export default function StepDetails({ data, setData, next, back }) {
  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const isDisabled = !data.handicap || !data.numPlayer;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Additional Details</h2>

      <div className="mb-4">
        <label className="block font-medium">Your Handicap:</label>
        <input
          type="number"
          value={data.handicap}
          onChange={(e) => handleChange('handicap', e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mt-1"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Number of Players:</label>
        <input
          type="number"
          value={data.numPlayer}
          onChange={(e) => handleChange('numPlayer', e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mt-1"
          required
        />
      </div>

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