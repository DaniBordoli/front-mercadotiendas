import React from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaSmile, FaGlobe, FaLeaf, FaStar, FaHeart, FaLightbulb, FaUsers, FaAward, FaHandshake } from 'react-icons/fa';
import { FiTarget } from 'react-icons/fi';
// Import reusable components
import InfoCard from '../../components/LayoutComponents/InfoCard';
import ValueCard from '../../components/LayoutComponents/ValueCard';
import TeamMemberCard from '../../components/LayoutComponents/TeamMemberCard';

const AboutUsScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1">
      
        <section className="bg-gray-50">
          <div className="max-w-5xl mx-auto text-center py-14">
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <p className="text-lg text-gray-500">Learn about our mission, vision, and values</p>
          </div>
        </section>
       
        <section className="bg-white">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 mb-16 px-6 py-14 justify-center">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"
              alt="Store"
              className="rounded-xl w-full md:w-[520px] h-[400px] object-cover shadow-md"
            />
            <div className="flex-1 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-base text-gray-600 mb-8 text-center">
                To provide our customers with the highest quality fashion products, while delivering exceptional shopping experiences. We strive to stay ahead of the latest trends and offer a curated collection that meets the needs of our fashion-conscious clientele.
              </p>
              <div className="flex gap-8 justify-center">
                <InfoCard
                  icon={<FaUsers className="text-3xl text-blue-600 mb-0" />}
                  title="Happy Customers"
                  value="100,000+"
                />
                <InfoCard
                  icon={<FaGlobe className="text-3xl text-blue-600 mb-0" />}
                  title="Countries Served"
                  value="50+"
                />
              </div>
            </div>
          </div>
        </section>
      
        <section className="bg-gray-50 py-14">
          <div className="max-w-4xl mx-auto text-center mb-10 px-4">
            <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
            <p className="text-base text-gray-600">
              To become the world's most trusted and innovative fashion destination, setting new standards in sustainable fashion and customer satisfaction.
            </p>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
            <ValueCard
              icon={<FaLeaf className="text-2xl mb-3" style={{ color: "#8b5cf6" }} />}
              title="Sustainability"
              description="Committed to reducing our environmental impact through sustainable practices and eco-friendly materials."
            />
            <ValueCard
              icon={<FaStar className="text-2xl mb-3" style={{ color: "#8b5cf6" }} />}
              title="Quality"
              description="Delivering premium products that meet the highest standards of quality and craftsmanship."
            />
            <ValueCard
              icon={<FaHeart className="text-2xl mb-3" style={{ color: "#8b5cf6" }} />}
              title="Customer Focus"
              description="Putting our customers first and creating memorable shopping experiences."
            />
          </div>
        </section>
       
        <section className="bg-white py-14">
          <div className="max-w-6xl mx-auto text-center mb-10 px-4">
            <h2 className="text-2xl font-bold mb-3">Our Core Values</h2>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <ValueCard
              icon={<FaHandshake className="text-2xl text-blue-600 mt-1" />}
              title="Integrity"
              description="We conduct our business with the highest standards of honesty and responsibility."
              horizontal
            />
            <ValueCard
              icon={<FaLightbulb className="text-2xl text-blue-600 mt-1" />}
              title="Innovation"
              description="We continuously seek new ways to improve and enhance our products and services."
              horizontal
            />
            <ValueCard
              icon={<FaUsers className="text-2xl text-blue-600 mt-1" />}
              title="Teamwork"
              description="We believe in the power of collaboration and mutual respect."
              horizontal
            />
            <ValueCard
              icon={<FiTarget className="text-2xl text-blue-600 mt-1" />}
              title="Excellence"
              description="We strive for excellence in everything we do."
              horizontal
            />
          </div>
        </section>
       
        <section className="py-14 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center mb-10 px-4">
            <h2 className="text-2xl font-bold mb-3">Our Leadership Team</h2>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 px-4">
            <TeamMemberCard
              image="https://randomuser.me/api/portraits/men/32.jpg"
              name="John Smith"
              role="Chief Executive Officer"
            />
            <TeamMemberCard
              image="https://randomuser.me/api/portraits/women/44.jpg"
              name="Sarah Johnson"
              role="Creative Director"
            />
            <TeamMemberCard
              image="https://randomuser.me/api/portraits/men/54.jpg"
              name="Michael Chen"
              role="Head of Operations"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUsScreen;
