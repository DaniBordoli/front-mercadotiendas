import React from 'react';
import { colors } from '../../../design/colors';
import '../../../styles/responsive.css';
import './WideCardResponsive.css';

export const WideCard: React.FC = () => {
  return (
    <div className="wide-card-container w-full rounded-lg overflow-hidden md:mt-10 mt-0">
      <h2 
        className="text-xl md:mt-8 mt-0 font-space ml-8 text-left md:pl-12 lg:pl-32 mb-4"
        style={{ color: colors.darkGray }}
      >
        En Vivo Ahora
      </h2>
      
  
      <div className="wide-card-desktop flex justify-center items-center gap-4 md:gap-5 lg:gap-6 mt-4 px-4">
        <div className="wide-card-image w-5/12 h-50 bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src="/BannerMainDashboard/DashboardLive1.png"
            alt="Live stream 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="wide-card-image w-5/12 h-50 bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src="/BannerMainDashboard/DashboardLive2.png"
            alt="Live stream 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
 
      <div className="wide-card-mobile justify-center items-center mt-4 px-4">
        <div className="wide-card-mobile-image bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src="/liveMobile/liveMobile.png"
            alt="Live stream mobile 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="wide-card-mobile-image bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src="/liveMobile/liveMobile.png"
            alt="Live stream mobile 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
