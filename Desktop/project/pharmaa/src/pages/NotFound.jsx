import { Link } from "react-router-dom";
import MedicalParticles from "../components/MedicalParticles.jsx";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="text-6xl font-bold text-gray-300">404</div>
      <div className="mt-2 text-lg text-gray-600">Page not found</div>
      <Link to="/" className="mt-4 inline-block rounded-md bg-indigo-600 text-white px-4 py-2 text-sm">
        Back to Dashboard
      </Link>
    </div>
  );
}