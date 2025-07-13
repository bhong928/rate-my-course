
export default function Banner({ imageUrl, title, subtitle }) {
  return (
    <div className="relative h-60 md:h-80 mb-6 rounded overflow-hidden shadow">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-white">{subtitle}</p>}
      </div>
    </div>
  );
}