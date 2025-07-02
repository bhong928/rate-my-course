import { Link } from "react-router-dom"

export default function Search(){

    return(
        <section 
        className="bg-cover bg-bottom bg-no-repeat relative " 
        style={{
            backgroundImage: "url('background.jpg')", 
            height: "600px"}}
        >
            <div className="flex items-center justify-center absolute inset-0 bg-black bg-opacity-20">
                <div className="text-center text-white px-4 w-full mx-w-xl">
                    <h1 className="sm:text-3xl md:text-3xl text-white font-bold text-center mb-6 ">
                    Your resource for golf course reviews
                    </h1>

                    <input
                        type="text"
                        placeholder="Search for a golf course"
                        className="w-full max-w-3xl mx-auto px-4 py-3 rounded-md text-black focus:outline-none focus:ring-green-500 shadow mb-2"
                    />

                    <div className="text-center text-white ">
                        <Link 
                        to="/courses"
                        className="inline-block hover:underline text-white rounded shadow"
                        >
                            All Courses
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    )
}