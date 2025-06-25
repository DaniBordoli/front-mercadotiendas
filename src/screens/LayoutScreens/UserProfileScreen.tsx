import React from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaRegHeart, FaClipboardList} from 'react-icons/fa';
import ProfileSidebar from '../../components/LayoutComponents/ProfileSidebar';
import DashboardCard from '../../components/LayoutComponents/DashboardCard';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';

const UserProfileScreen: React.FC = () => {
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        title={editableVariables.title}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.textColor}
        fontType={editableVariables.fontType}
        logoUrl={editableVariables.logoUrl}
      />
      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 py-10 px-4">
        <ProfileSidebar />
        <section className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <DashboardCard
              label="Total Orders"
              value="12"
              icon={<FaClipboardList className="text-blue-600" />}
            />
            <DashboardCard
              label="Total Spent"
              value="$1,248"
              icon={<FaClipboardList className="text-blue-600" />}
            />
            <DashboardCard
              label="Wishlist Items"
              value="8"
              icon={<FaRegHeart className="text-blue-600" />}
            />
          </div>

          <div className="bg-white rounded-lg">
            <div className="p-6 pb-0 font-semibold text-gray-900 text-lg mb-4">Recent Orders</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className='bg-gray-50'>
                  <tr className="text-gray-500 border-b">
                    <th className="px-6 py-3 font-normal">Order</th>
                    <th className="px-6 py-3 font-normal">Date</th>
                    <th className="px-6 py-3 font-normal">Status</th>
                    <th className="px-6 py-3 font-normal">Total</th>
                    <th className="px-6 py-3 font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-6 py-3">#1234</td>
                    <td className="px-6 py-3">March 15, 2025</td>
                    <td className="px-6 py-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Delivered</span>
                    </td>
                    <td className="px-6 py-3">$299.00</td>
                    <td className="px-6 py-3">
                      <a href="#" className="text-blue-600 hover:underline">View</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">#1233</td>
                    <td className="px-6 py-3">March 12, 2025</td>
                    <td className="px-6 py-3">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">Processing</span>
                    </td>
                    <td className="px-6 py-3">$149.00</td>
                    <td className="px-6 py-3">
                      <a href="#" className="text-blue-600 hover:underline">View</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
 
          <div className="bg-white rounded-lg p-6">
            <div className="font-semibold text-gray-900 mb-4">Account Details</div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">First Name</label>
                  <input type="text" className="border rounded px-3 py-2 w-full"  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Last Name</label>
                  <input type="text" className="border rounded px-3 py-2 w-full"  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Email Address</label>
                <input type="email" className="border rounded px-3 py-2 w-full"   />
              </div>
              <div>
                <label className="block text-sm mb-1">Current Password</label>
                <input type="password" className="border rounded px-3 py-2 w-full"  />
              </div>
              <div>
                <label className="block text-sm mb-1">New Password</label>
                <input type="password" className="border rounded px-3 py-2 w-full"  />
              </div>
              <button type="button" className="mt-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Save Changes
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
    </div>
  );
};

export default UserProfileScreen;
