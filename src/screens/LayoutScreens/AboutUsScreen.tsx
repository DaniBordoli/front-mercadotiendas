import React from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaSmile, FaGlobe, FaLeaf, FaStar, FaHeart, FaLightbulb, FaUsers, FaAward, FaHandshake } from 'react-icons/fa';
import { FiTarget } from 'react-icons/fi';
// Import reusable components
import InfoCard from '../../components/LayoutComponents/InfoCard';
import ValueCard from '../../components/LayoutComponents/ValueCard';
import TeamMemberCard from '../../components/LayoutComponents/TeamMemberCard';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';
import { useShopStore } from '../../stores/slices/shopStore';
import { useShopInstitutionalStore } from '../../stores/slices/shopInstitutionalStore';

const AboutUsScreen: React.FC = () => {
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  const shop = useShopStore(state => state.shop);
  const { institutional, getShopInstitutional } = useShopInstitutionalStore();

  React.useEffect(() => {
    getShopInstitutional();
  }, [getShopInstitutional]);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50" style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        navbarTitle={editableVariables.navbarTitle}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.textColor}
        fontType={editableVariables.fontType}
        logoUrl={editableVariables.logoUrl}
      />
      <main className="flex-1">
      
        <section className="bg-gray-50">
          <div className="max-w-5xl mx-auto text-center py-14">
            <h1 className="text-3xl font-bold mb-4">Acerca de Nosotros</h1>
            <p className="text-lg text-gray-500">
              {institutional?.description || "Conoce nuestra misión, visión y valores"}
            </p>
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
              <h2 className="text-2xl font-bold mb-6 text-center">Nuestra Misión</h2>
              <p className="text-base text-gray-600 mb-8 text-center">
                {institutional?.mission || "Brindar a nuestros clientes productos de la más alta calidad, ofreciendo experiencias de compra excepcionales. Nos esforzamos por mantenernos al día con las últimas tendencias y ofrecer una colección curada que satisfaga las necesidades de nuestra clientela consciente de la moda."}
              </p>
              <div className="flex gap-8 justify-center">
                <InfoCard
                  icon={<FaUsers className="text-3xl text-blue-600 mb-0" />}
                  title="Clientes"
                  value="100,000+"
                />
                <InfoCard
                  icon={<FaGlobe className="text-3xl text-blue-600 mb-0" />}
                  title="Países Atendidos"
                  value="50+"
                />
              </div>
            </div>
          </div>
        </section>
      
        {/* Our History Section - Only show if history exists */}
        {institutional?.history && (
          <section className="bg-white py-14">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-2xl font-bold mb-6">Nuestra Historia</h2>
              <p className="text-base text-gray-600 leading-relaxed">
                {institutional.history}
              </p>
            </div>
          </section>
        )}
      
        <section className="bg-gray-50 py-14">
          <div className="max-w-4xl mx-auto text-center mb-10 px-4">
            <h2 className="text-2xl font-bold mb-3">Nuestra Visión</h2>
            <p className="text-base text-gray-600">
              {institutional?.vision || "Convertirnos en el destino de moda más confiable e innovador del mundo, estableciendo nuevos estándares en moda sostenible y satisfacción del cliente."}
            </p>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
            <ValueCard
              icon={<FaLeaf className="text-2xl mb-3" style={{ color: "#8b5cf6" }} />}
              title="Sostenibilidad"
              description="Comprometidos a reducir nuestro impacto ambiental a través de prácticas sostenibles y materiales ecológicos."
            />
            <ValueCard
              icon={<FaStar className="text-2xl mb-3" style={{ color: "#8b5cf6" }} />}
              title="Calidad"
              description="Entregando productos premium que cumplen con los más altos estándares de calidad y artesanía."
            />
            <ValueCard
              icon={<FaHeart className="text-2xl mb-3" style={{ color: "#8b5cf6" }} />}
              title="Enfoque en el Cliente"
              description="Poniendo a nuestros clientes primero y creando experiencias de compra memorables."
            />
          </div>
        </section>
       
        <section className="bg-white py-14">
          <div className="max-w-6xl mx-auto text-center mb-10 px-4">
            <h2 className="text-2xl font-bold mb-3">Nuestros Valores Fundamentales</h2>
            {institutional?.values && (
              <p className="text-base text-gray-600 mb-6">
                {institutional.values}
              </p>
            )}
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <ValueCard
              icon={<FaHandshake className="text-2xl text-blue-600 mt-1" />}
              title="Integridad"
              description="Conducimos nuestros negocios con los más altos estándares de honestidad y responsabilidad."
              horizontal
            />
            <ValueCard
              icon={<FaLightbulb className="text-2xl text-blue-600 mt-1" />}
              title="Innovación"
              description="Continuamente buscamos nuevas formas de mejorar y perfeccionar nuestros productos y servicios."
              horizontal
            />
            <ValueCard
              icon={<FaUsers className="text-2xl text-blue-600 mt-1" />}
              title="Trabajo en Equipo"
              description="Creemos en el poder de la colaboración y el respeto mutuo."
              horizontal
            />
            <ValueCard
              icon={<FiTarget className="text-2xl text-blue-600 mt-1" />}
              title="Excelencia"
              description="Nos esforzamos por la excelencia en todo lo que hacemos."
              horizontal
            />
          </div>
        </section>
       
        <section className="py-14 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center mb-10 px-4">
            <h2 className="text-2xl font-bold mb-3">Nuestro Equipo de Liderazgo</h2>
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
      <Footer
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
    </div>
  );
};

export default AboutUsScreen;
