import { Link } from "react-router-dom";

// The StateCard component displays one state with its image, name, and review count.
// It links to the state detail page using the slug.
export default function StateCard({ name, image, reviews, slug }) {
  return (
    <Link
      to={`/states/${slug}`} // navigate to /states
      className="w-60 h-80 shrink-0 bg-white rounded-lg shadow hover:shadow-lg transition duration-200 flex flex-col overflow-hidden"
    >
      {/* State image */}
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded-t-lg"
      />

      {/* Text content */}
      <div className="flex flex-col justify-between flex-grow p-4">
        <h3 className="font-semibold text-xl">{name}</h3>
        <p className="text-sm text-gray-500">{reviews} Reviews</p>
      </div>
    </Link>
  );
}