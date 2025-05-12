import React from 'react';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const LoginScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center my-12 justify-center">
        <div className="bg-white rounded-lg shadow p-10 w-full max-w-md">
          <h2 className="text-2xl text-center font-bold mb-4">Welcome Back</h2>
          <p className="text-center text-gray-600 mb-10">Sign in to your ShopSmart account</p>
          <form>
            <div className="mb-6">
              <label className="block text-sm mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="border rounded-lg px-3 py-4 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="border rounded-lg px-3 py-4 w-full"
              />
            </div>
            <div className="flex items-center justify-between mb-8">
              <label className="flex items-center text-sm">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-blue-600 text-sm hover:underline">Forgot password?</a>
            </div>
            <button
              type="button"
              className="w-full bg-blue-600 text-white py-3 rounded mb-8 hover:bg-blue-700 transition"
            >
              Sign In
            </button>
            <div className="text-center text-sm mb-8">
              Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
            </div>
            <div className="flex items-center mb-8">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="mx-2 text-gray-400 text-xs">Or continue with</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            <div className="flex gap-6">
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
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginScreen;
