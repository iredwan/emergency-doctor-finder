import React from 'react';
import Link from 'next/link';
import ServiceCard from './../components/ServiceCard.jsx';
import { FaUserDoctor, FaStethoscope, FaHospital } from "react-icons/fa6";

const Home = () => {
  const services = [
    {
      icon: <FaUserDoctor className='text-primary text-5xl' />,
      title: 'Emergency Care',
      description: 'Immediate care for critical medical conditions that require prompt attention.'
    },
    {
      icon: <FaHospital className='text-primary text-5xl' />,
      title: 'Operation & Surgery',
      description: 'Advanced surgical procedures using state-of-the-art equipment and techniques.'
    },
    {
      icon: <FaStethoscope className='text-primary text-5xl' />,
      title: 'Outdoor Checkup',
      description: 'Comprehensive health checkups and screenings to ensure your well-being.'
    }
  ];
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient py-20 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <h5 className="uppercase border-b-2 border-white inline-block pb-2 mb-4">
              Welcome To WebDr.
            </h5>
            <h1 className="text-5xl mb-6 font-bold leading-tight">
              Find The Best Doctor In Your City
            </h1>
            <p className="mb-8 text-lg">
              We help you connect with the best healthcare professionals near you. Our platform makes it easy to find doctors based on specialties, location, and availability.
            </p>
            <div className="flex gap-4">
              <Link href="/doctors" className="bg-white text-primary px-6 py-3 rounded-full font-bold inline-block hover:bg-gray-100 transition-colors">
                Find Doctor
              </Link>
              <Link href="/schedule" className="bg-transparent text-white px-6 py-3 rounded-full font-bold border border-white inline-block hover:bg-white hover:text-[#13C5DD] transition-colors">
                Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h5 className="text-primary uppercase border-b-2 border-primary inline-block pb-2 mb-4">
              Our Services
            </h5>
            <h2 className="text-4xl text-gray-800 mb-4">
              Excellent Medical Services
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard 
                key={index}
                icon={service.icon} 
                title={service.title} 
                description={service.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl mb-6">Need Medical Help?</h2>
          <p className="text-lg mb-8">
            Contact us today to schedule an appointment with one of our experienced doctors.
          </p>
          <Link href="/contact" className="bg-white text-primary px-8 py-3 rounded-full font-bold inline-block hover:bg-gray-100 transition-colors">
            Contact Now
          </Link>
        </div>
      </div>
    </div>
  );
};


export default Home;
