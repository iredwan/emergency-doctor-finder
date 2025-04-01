"use client";
import ServiceCard from "@/components/ServiceCard";
import { useState } from "react";

const ServicePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Services" },
    { id: "emergency", name: "Emergency" },
    { id: "primary", name: "Primary Care" },
    { id: "specialist", name: "Specialist" },
  ];

  const services = [
    {
      id: 1,
      title: "24/7 Emergency Care",
      category: "emergency",
      description: "Round-the-clock emergency medical services with experienced healthcare professionals.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "General Check-ups",
      category: "primary",
      description: "Comprehensive health check-ups and preventive care services.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Cardiology",
      category: "specialist",
      description: "Expert cardiac care with state-of-the-art diagnostic and treatment facilities.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Pediatric Care",
      category: "primary",
      description: "Specialized healthcare services for infants, children, and adolescents.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 5,
      title: "Orthopedics",
      category: "specialist",
      description: "Complete care for bone and joint related conditions.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      id: 6,
      title: "Ambulance Service",
      category: "emergency",
      description: "Quick and reliable emergency medical transportation.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
    },
  ];

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Medical Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            We provide comprehensive healthcare services with state-of-the-art facilities and experienced medical professionals.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <ServiceCard 
                key={index}
                icon={service.icon} 
                title={service.title} 
                description={service.description}
              />
            ))}
          </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-xl shadow-md p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Need Medical Assistance?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team of medical professionals is available 24/7 to provide you with the best healthcare services.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg">
              Book Appointment
            </button>
            <button className="bg-white text-primary px-8 py-3 rounded-full font-medium border-2 border-primary hover:bg-primary/5 transition-all duration-300">
              Emergency Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage; 