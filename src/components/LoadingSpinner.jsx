
export default function LoadingSpinner({message = "Loading..."}) {
    return (
    <div className="flex flex-col justify-center items-center h-32 space-y-2">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-500 border-solid"></div>
        <p className="text-gray-600 text-sm">{message}</p>
    </div>
    );
}