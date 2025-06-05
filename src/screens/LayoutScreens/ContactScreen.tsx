import React from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import ContactInfoCard from '../../components/LayoutComponents/ContactInfoCard';
import FAQCard from '../../components/LayoutComponents/FAQCard';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';

const ContactScreen: React.FC = () => {
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        title={editableVariables.title}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.textColor}
        fontType={editableVariables.fontType}
      />
      <section className="py-12" style={{ backgroundColor: editableVariables.heroBackgroundColor }}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: editableVariables.textColor }}>Contact & Support</h1>
          <p className="mb-10" style={{ color: editableVariables.secondaryColor }}>We're here to help you with any questions or concerns</p>
        </div>
      </section>
      <section className="py-8" style={{ backgroundColor: editableVariables.navbarBackgroundColor }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <ContactInfoCard
            icon={<FaMapMarkerAlt className="text-blue-600 text-3xl mb-3" />}
            title="Visit Us"
            lines={["123 Fashion Street", "New York, NY 10001"]}
          />
          <ContactInfoCard
            icon={<FaPhoneAlt className="text-blue-600 text-3xl mb-3" />}
            title="Call Us"
            lines={["+1 234 567 8900", "Mon-Fri: 9AM to 6PM"]}
          />
          <ContactInfoCard
            icon={<FaEnvelope className="text-blue-600 text-3xl mb-3" />}
            title="Email Us"
            lines={["info@shopsmart.com", "support@shopsmart.com"]}
          />
        </div>
      </section>
      <section className="py-12" style={{ backgroundColor: editableVariables.heroBackgroundColor }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8" style={{ color: editableVariables.textColor }}>Send Us a Message</h2>
          <form className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm mb-1">First Name</label>
                <input type="text" className="border rounded px-3 py-2 w-full" />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Last Name</label>
                <input type="text" className="border rounded px-3 py-2 w-full" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" className="border rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1">Subject</label>
              <input type="text" className="border rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1">Message</label>
              <textarea className="border rounded px-3 py-2 w-full min-h-[120px]" />
            </div>
            <button
              type="button"
              className="w-full py-2 rounded font-semibold transition"
              style={{ backgroundColor: editableVariables.buttonBackgroundColor, color: editableVariables.buttonTextColor }}
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
      <section className="py-16" style={{ backgroundColor: editableVariables.navbarBackgroundColor }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8" style={{ color: editableVariables.textColor }}>Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQCard
              question="How do I track my order?"
              answer="Once your order is shipped, you'll receive a tracking number via email. You can use this number to track your package on our website or the carrier's website."
            />
            <FAQCard
              question="What is your return policy?"
              answer="We offer a 30-day return policy for most items. Products must be unused and in their original packaging. Shipping costs for returns are the responsibility of the customer."
            />
            <FAQCard
              question="Do you ship internationally?"
              answer="Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can check shipping rates during checkout."
            />
          </div>
        </div>
      </section>
      <Footer
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
    </div>
  );
};

export default ContactScreen;
