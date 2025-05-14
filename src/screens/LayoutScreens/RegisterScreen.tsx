import React from 'react';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const RegisterScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center my-12 justify-center">
        <div className="bg-white rounded-lg shadow p-10 w-full max-w-lg">
          <h2 className="text-2xl text-center font-bold mb-2">Create Account</h2>
          <p className="text-center text-gray-600 mb-8">Join ShopSmart to start shopping</p>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-2">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="border rounded-lg px-3 py-3 w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border rounded-lg px-3 py-3 w-full"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Email Address"
                className="border rounded-lg px-3 py-3 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="border rounded-lg px-3 py-3 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="border rounded-lg px-3 py-3 w-full"
              />
            </div>
            <div className="flex items-center mb-6">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">
                I agree to the
                <a href="#" className="text-blue-600 ml-1 hover:underline">Terms and Conditions</a>
              </span>
            </div>
            <button
              type="button"
              className="w-full bg-blue-600 text-white py-3 rounded mb-6 hover:bg-blue-700 transition"
            >
              Create Account
            </button>
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="mx-2 text-gray-400 text-xs">Or continue with</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                className="flex-1 flex items-center justify-center border rounded-lg py-3 hover:bg-gray-50"
              >
                <FaGoogle className="mr-2" /> Google
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center border rounded-lg py-3 hover:bg-gray-50"
              >
                <FaFacebook className="mr-2" /> Facebook
              </button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <a href="#" className="text-blue-600 hover:underline">Sign in</a>
            </div>
          </form>
        </div>
      </div>
     
    </div>
  );
};

export default RegisterScreen;
