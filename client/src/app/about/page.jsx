"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div>
      {/* About Header */}
      <div className="bg-gradient py-16 text-white text-center mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl mb-4">About Us</h1>
          <p className="text-lg">Learn more about our medical center and our mission to provide quality healthcare.</p>
        </div>
      </div>
      
      {/* About Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <h2 className="text-primary text-4xl mb-6">
              We Provide Best Healthcare Services
            </h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              Medinova Medical Center has been providing exceptional healthcare services for over 30 years. Our mission is to deliver the highest quality medical care with compassion and understanding.
            </p>
            <p className="mb-6 text-gray-600 leading-relaxed">
              Our team of highly skilled doctors, nurses, and support staff are dedicated to improving the health and wellbeing of our patients through comprehensive medical services, cutting-edge technology, and a patient-centered approach.
            </p>
            <ul className="pl-5 mb-8 list-disc">
              <li className="mb-2 text-gray-600">Professional & experienced medical specialists</li>
              <li className="mb-2 text-gray-600">State-of-the-art medical facilities and equipment</li>
              <li className="mb-2 text-gray-600">24/7 emergency services with qualified doctors</li>
              <li className="mb-2 text-gray-600">Affordable healthcare services for all patients</li>
            </ul>
            <button className="bg-primary text-white px-6 py-3 rounded font-bold hover:bg-opacity-90 transition-colors">
              Learn More
            </button>
          </div>
          <div className="">
            <Image src="/images/about.jpg" alt="About" width={1000} height={1000} priority/>
          </div>
        </div>
        
        {/* Our Values */}
        <div className="mb-16 text-center">
          <h2 className="text-primary text-4xl mb-8">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-white rounded-lg shadow-md text-center">
              <h3 className="text-primary text-xl mb-4">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of patient care and medical service delivery.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-md text-center">
              <h3 className="text-primary text-xl mb-4">Compassion</h3>
              <p className="text-gray-600">
                We treat all patients with compassion, dignity, and respect in all circumstances.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-md text-center">
              <h3 className="text-primary text-xl mb-4">Innovation</h3>
              <p className="text-gray-600">
                We embrace innovation and continuously advance our medical practices.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-md text-center">
              <h3 className="text-primary text-xl mb-4">Integrity</h3>
              <p className="text-gray-600">
                We uphold the highest standards of integrity and ethical conduct in all we do.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;