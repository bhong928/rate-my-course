import { FaGolfBall } from "react-icons/fa";

const RATINGS = [
  {
    field: "greenRating",
    label: "Greens",
    description: "Rate the condition of the greens"
  },
  {
    field: "fairwayRating",
    label: "Fairways",
    description: "Rate the fairways' condition and upkeep"
  },
  {
    field: "roughRating",
    label: "Rough",
    description: "Rate the rough areas and difficulty"
  },
  {
    field: "staffRating",
    label: "Staff",
    description: "Rate the friendliness and professionalism of the staff"
  },
];

export default function StepRating({ data, setData, next }) {
  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const allFilled = RATINGS.every((r) => data[r.field] > 0);

  return (
    <div className="w-full bg-white sm:p-10">
      {RATINGS.map(({ field, label, description }) => (
        <div key={field} className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            {/* Text Section */}
            <div className="sm:w-1/2">
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                Rate the <span className="text-green-600">{label.toLowerCase()}</span>
              </h3>
              <p className="text-base text-gray-500">{description}</p>
            </div>

            {/* Golf Ball Rating */}
            <div className="flex gap-2 sm:gap-3 sm:w-1/2 justify-start sm:justify-end">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange(field, value)}
                  className="focus:outline-none"
                >
                  <FaGolfBall
                    className={`w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-150 ease-in-out cursor-pointer ${
                      value <= data[field] ? "text-green-500" : "text-gray-300 hover:text-green-400"
                    } hover:scale-125`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Next button */}
      <div className="text-center">
        <button
          onClick={next}
          disabled={!allFilled}
          className={`mt-8 px-6 py-2 rounded text-white text-lg font-medium ${
            allFilled
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}