import React from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import ContactInfoCard from '../../components/LayoutComponents/ContactInfoCard';
import FAQCard from '../../components/LayoutComponents/FAQCard';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';
import { useShopStore } from '../../stores/slices/shopStore';
import { fetchShopTemplate } from '../../services/api';

const ContactScreen: React.FC = () => {
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  const setEditableVariables = useFirstLayoutStore(state => state.setEditableVariables);
  const { shop, getShop } = useShopStore();
  
  React.useEffect(() => {
    const loadShopAndTemplate = async () => {
      try {
        if (!shop) {
          await getShop();
        }
        // Cargar template
        const data = await fetchShopTemplate();
        if (data && data.templateUpdate) {
          setEditableVariables(data.templateUpdate);
        }
      } catch (err) {
        console.error('Error loading shop or template:', err);
      }
    };
    loadShopAndTemplate();
  }, [shop, getShop, setEditableVariables]);

  // Datos dinámicos de la tienda
  const shopAddress = shop?.address || "123 Calle de la Moda, Nueva York, NY 10001";
  const shopPhone = shop?.shopPhone || "+1 234 567 8900";
  const shopEmail = shop?.contactEmail || "info@shopsmart.com";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        navbarTitle={editableVariables.navbarTitle}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.navbarTitleColor || editableVariables.textColor}
        navbarTitleColor={editableVariables.navbarTitleColor}
        navbarLinksColor={editableVariables.navbarLinksColor}
        navbarIconsColor={editableVariables.navbarIconsColor}
        fontType={editableVariables.fontType}
        logoUrl={editableVariables.logoUrl}
      />
      <section className="py-12" style={{ backgroundColor: editableVariables.heroBackgroundColor }}>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: editableVariables.textColor }}>Contacto y Soporte</h1>
          <p className="mb-10" style={{ color: editableVariables.secondaryColor }}>Estamos aquí para ayudarte con cualquier pregunta o inquietud</p>
        </div>
      </section>
      <section className="py-8" style={{ backgroundColor: editableVariables.navbarBackgroundColor }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <ContactInfoCard
            icon={<FaMapMarkerAlt className="text-blue-600 text-3xl mb-3" />}
            title="Visítanos"
            lines={[shopAddress]}
          />
          <ContactInfoCard
            icon={<FaPhoneAlt className="text-blue-600 text-3xl mb-3" />}
            title="Llámanos"
            lines={[shopPhone, "Lun-Vie: 9AM a 6PM"]}
          />
          <ContactInfoCard
            icon={<FaEnvelope className="text-blue-600 text-3xl mb-3" />}
            title="Envíanos un correo"
            lines={[shopEmail]}
          />
        </div>
      </section>
      <section className="py-12" style={{ backgroundColor: editableVariables.heroBackgroundColor }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8" style={{ color: editableVariables.textColor }}>Envíanos un mensaje</h2>
          <form className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm mb-1">Nombre</label>
                <input type="text" className="border rounded px-3 py-2 w-full" />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Apellido</label>
                <input type="text" className="border rounded px-3 py-2 w-full" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Correo electrónico</label>
              <input type="email" className="border rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1">Asunto</label>
              <input type="text" className="border rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm mb-1">Mensaje</label>
              <textarea className="border rounded px-3 py-2 w-full min-h-[120px]" />
            </div>
            <button
              type="button"
              className="w-full py-2 rounded font-semibold transition"
              style={{ backgroundColor: editableVariables.buttonBackgroundColor, color: editableVariables.buttonTextColor }}
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </section>
      <section className="py-16" style={{ backgroundColor: editableVariables.navbarBackgroundColor }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8" style={{ color: editableVariables.textColor }}>Preguntas frecuentes</h2>
          <div className="space-y-6">
            <FAQCard
              question="¿Cómo puedo rastrear mi pedido?"
              answer="Una vez que tu pedido sea enviado, recibirás un número de seguimiento por correo electrónico. Puedes usar este número para rastrear tu paquete en nuestro sitio web o en el sitio del transportista."
            />
            <FAQCard
              question="¿Cuál es su política de devoluciones?"
              answer="Ofrecemos una política de devoluciones de 30 días para la mayoría de los artículos. Los productos deben estar sin uso y en su empaque original. Los costos de envío para devoluciones corren por cuenta del cliente."
            />
            <FAQCard
              question="¿Realizan envíos internacionales?"
              answer="Sí, realizamos envíos a la mayoría de los países del mundo. Los costos y tiempos de envío varían según la ubicación. Puedes consultar las tarifas de envío durante el proceso de compra."
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
