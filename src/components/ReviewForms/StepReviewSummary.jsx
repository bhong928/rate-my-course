export default function StepReviewSummary({ data, back, next }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Review Summary</h2>

      <ul className="text-sm space-y-2">
        <li><strong>Greens:</strong> {data.greenRating}</li>
        <li><strong>Fairways:</strong> {data.fairwayRating}</li>
        <li><strong>Rough:</strong> {data.roughRating}</li>
        <li><strong>Staff:</strong> {data.staffRating}</li>
        <li><strong>Comments:</strong> {data.comments}</li>
        <li><strong>Handicap:</strong> {data.handicap}</li>
        <li><strong>Players:</strong> {data.numPlayer}</li>
      </ul>

      <div className="flex justify-between mt-6">
        <button onClick={back} className="bg-gray-300 px-4 py-2 rounded">Back</button>
        <button onClick={next} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </div>
    </div>
  );
}