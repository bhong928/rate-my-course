import AddCourseForm from "./AddCourseForm";

export default function AddCoursePage({ currentUser }) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Course</h1>
      <AddCourseForm currentUser={currentUser} />
    </div>
  );
}