import Link from "next/link";
import { FaAngleRight } from "react-icons/fa6";

const ServiceCard = ({ icon, title, description }) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md transition-transform duration-300 h-full flex flex-col items-center text-center hover:-translate-y-2">
        <div className="text-5xl mb-4">
          {icon}
        </div>
        <h3 className="text-secondary text-xl mb-4">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        <Link 
          href="/services" 
          className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mt-auto hover:bg-opacity-90 transition-colors"
        >
          <FaAngleRight />
        </Link>
      </div>
    );
  };

export default ServiceCard;