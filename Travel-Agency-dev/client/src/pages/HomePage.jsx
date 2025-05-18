import React from "react";
import { Link } from "react-router-dom";
import travelImage from "../assets/travel.jpg";
import hotelIcon from "../assets/hotel.jpg";
import flightIcon from "../assets/flight.jpg";
import transportIcon from "../assets/transport.png";
import customTravelIcon from "../assets/custom-travel.jpeg";

// Destination images
import saudiImage from "../assets/saudia.jpeg";
import parisImage from "../assets/paris.jpg";
import greeceImage from "../assets/greece.jpeg";
import maldivesImage from "../assets/maldives.jpg";
import baliImage from "../assets/bali.jpeg";
import dubaiImage from "../assets/dubai.jpg";

const Home = () => {
  return (
    <div className="font-sans min-h-screen">
      {/* Hero Section */}
      <header className="grid grid-cols-1 md:grid-cols-2 p-8 gap-6 items-center text-center md:text-left">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600">
            TravelEase
          </h2>
          <p className="text-lg text-gray-700">
            Your one-stop platform for hassle-free travel bookings.
          </p>
          <ul className="mt-4 text-gray-700 list-disc pl-5">
            <li>Secure Flight & Hotel Bookings</li>
            <li>Best Deals & Discounts</li>
            <li>Visa Assistance & Travel Support</li>
            <li>Easy Online Payments</li>
          </ul>
          <Link
            to="/signup"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold"
          >
            Get Started
          </Link>
        </div>
        <img
          src={travelImage}
          alt="Traveler"
          className="w-full h-auto max-w-md mx-auto rounded-lg "
        />
      </header>

      {/* Services Section */}
      <section className="p-8 text-center">
        <h2 className="text-3xl font-bold text-blue-600">Our Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {[
            {
              img: hotelIcon,
              title: "Hotel Bookings",
              desc: "Stay at top-rated hotels at unbeatable prices",
            },
            {
              img: flightIcon,
              title: "Flight Booking",
              desc: "Search and book flights effortlessly",
            },
            {
              img: transportIcon,
              title: "Transport",
              desc: "Reliable transport services for travelers",
            },
            {
              img: customTravelIcon,
              title: "Custom Travel Plans",
              desc: "Tailor your trip according to your needs",
            },
          ].map((service, index) => (
            <div key={index} className="text-center bg-white p-6 rounded-lg">
              <img
                src={service.img}
                alt={service.title}
                className="mx-auto w-16 md:w-20 h-auto"
              />
              <h3 className="font-bold mt-2 text-blue-600">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Destinations */}
      <section className="p-8 text-center">
        <h2 className="text-3xl font-bold text-blue-600">Top Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {[
            { name: "Saudi Arabia", img: saudiImage },
            { name: "Paris", img: parisImage },
            { name: "Greece", img: greeceImage },
            { name: "Maldives", img: maldivesImage },
            { name: "Bali", img: baliImage },
            { name: "Dubai", img: dubaiImage },
          ].map((destination, index) => (
            <div key={index} className="text-center bg-white p-4 rounded-lg">
              <img
                src={destination.img}
                alt={destination.name}
                className="w-full h-40 md:h-56 object-cover rounded-lg"
              />
              <h3 className="font-bold mt-2 text-blue-600">
                {destination.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Steps */}
      <section className="bg-white shadow-lg rounded-2xl p-8 mx-auto max-w-lg text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">
          Book Your Trip in 3 Easy Steps
        </h2>
        <div className="mt-6 space-y-4">
          {[
            { icon: "🌍", text: "Choose Destination" },
            { icon: "💳", text: "Make Payment" },
            { icon: "✈️", text: "Reach Airport on Selected Date" },
          ].map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-sm"
            >
              <span className="text-2xl">{step.icon}</span>
              <p className="text-lg font-semibold text-gray-800">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
