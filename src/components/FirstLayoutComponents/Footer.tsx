import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { FaPhone } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0B1120] text-white py-12">
      <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      
        <div>
          <h3 className="text-lg font-bold mb-4">ShopSmart</h3>
          <p className="text-sm text-gray-400 mb-4">Your one-stop destination for fashion and accessories.</p>
          <div className="flex gap-4 text-gray-400">
            <FaFacebook className="text-xl cursor-pointer hover:text-white" />
            <FaInstagram className="text-xl cursor-pointer hover:text-white" />
            <FaTwitter className="text-xl cursor-pointer hover:text-white" />
          </div>
        </div>

      
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <span
                className="hover:text-white cursor-pointer"
                onClick={() => navigate('/aboutus-layout')}
              >
                About Us
              </span>
            </li>
            <li>
              <span
                className="hover:text-white cursor-pointer"
                onClick={() => navigate('/contact-layout')}
              >
                Contact
              </span>
            </li>
            <li><a href="#blog" className="hover:text-white">Blog</a></li>
            <li><a href="#faqs" className="hover:text-white">FAQs</a></li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-bold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#shipping" className="hover:text-white">Shipping Policy</a></li>
            <li><a href="#returns" className="hover:text-white">Returns & Exchanges</a></li>
            <li><a href="#size-guide" className="hover:text-white">Size Guide</a></li>
            <li><a href="#terms" className="hover:text-white">Terms & Conditions</a></li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-bold mb-4">Contact Info</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <HiLocationMarker className="text-xl" /> 123 Fashion Street, NY 10001
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-xl" /> +1 234 567 8900
            </li>
            <li className="flex items-center gap-2">
              <IoMail className="text-xl" /> info@shopsmart.com
            </li>
          </ul>
        </div>
      </div>
      <hr className="border-t border-gray-800 my-8 mx-auto w-10/12" />
      <div className="mt-8 text-center text-sm text-gray-400">
        © 2025 ShopSmart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
