import * as React from 'react';
import { FaChevronDown } from "react-icons/fa";
import { motion } from 'framer-motion';
import { GeneralInfoSection } from './DropDownSections/GeneralInfoSection';
import { DomainSubdomainSection } from './DropDownSections/DomainSubdomainSection';
import { InstitutionalDescriptionSection } from './DropDownSections/InstitutionalDescriptionSection';
import { SeoMetadataSection } from './DropDownSections/SeoMetadataSection';
import { SocialMediaSection } from './DropDownSections/SocialMediaSection';
import { OperationPoliciesSection } from './DropDownSections/OperationPoliciesSection';

interface DropDownSectionsProps {
    openSection: string | null;
    toggleSection: (section: string) => void;
}

export const DropDownSections: React.FC<DropDownSectionsProps> = ({ openSection, toggleSection }) => {
    const sectionVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: { height: 'auto', opacity: 1 },
    };

    return (
        <>
            {/* Dropdown for Commerce Info */}
            <div className="mt-6">
                <button
                    onClick={() => toggleSection('commerceInfo')}
                    className={`w-full text-left text-lg font-space flex justify-between items-center border border-gray-300 p-3 rounded-t-md ${
                        openSection === 'commerceInfo' ? '' : 'rounded-md'
                    }`}
                >
                    Información General
                    <FaChevronDown className="text-gray-500" />
                </button>
                <motion.div
                    initial="hidden"
                    animate={openSection === 'commerceInfo' ? 'visible' : 'hidden'}
                    variants={sectionVariants}
                    className="overflow-hidden"
                >
                    <GeneralInfoSection />
                </motion.div>
            </div>

            {/* Dropdown for Domain and Subdomain */}
            <div className="mt-6">
                <button
                    onClick={() => toggleSection('seoMetadata')}
                    className={`w-full text-left text-lg font-space flex justify-between items-center border border-gray-300 p-3 rounded-t-md ${
                        openSection === 'seoMetadata' ? '' : 'rounded-md'
                    }`}
                >
                    Dominio y Subdominio
                    <FaChevronDown className="text-gray-500" />
                </button>
                <motion.div
                    initial="hidden"
                    animate={openSection === 'seoMetadata' ? 'visible' : 'hidden'}
                    variants={sectionVariants}
                    className="overflow-hidden"
                >
                    <DomainSubdomainSection />
                </motion.div>
            </div>

            {/* Dropdown for Institutional Description */}
            <div className="mt-6">
                <button
                    onClick={() => toggleSection('institutionalDescription')}
                   className={`w-full text-left text-lg font-space flex justify-between items-center border border-gray-300 p-3 rounded-t-md ${
                        openSection === 'institutionalDescription' ? '' : 'rounded-md'
                    }`}
                >
                    Descripción Institucional
                    <FaChevronDown className="text-gray-500" />
                </button>
                <motion.div
                    initial="hidden"
                    animate={openSection === 'institutionalDescription' ? 'visible' : 'hidden'}
                    variants={sectionVariants}
                    className="overflow-hidden"
                >
                    <InstitutionalDescriptionSection />
                </motion.div>
            </div>
            
            {/* Dropdown for SEO Metadata */}
            <div className="mt-6">
                <button
                    onClick={() => toggleSection('seoMetadataSection')}
                    className={`w-full text-left text-lg font-space flex justify-between items-center border border-gray-300 p-3 rounded-t-md ${
                        openSection === 'seoMetadataSection' ? '' : 'rounded-md'
                    }`}
                >
                    SEO y Metadata
                    <FaChevronDown className="text-gray-500" />
                </button>
                <motion.div
                    initial="hidden"
                    animate={openSection === 'seoMetadataSection' ? 'visible' : 'hidden'}
                    variants={sectionVariants}
                    className="overflow-hidden"
                >
                    <SeoMetadataSection />
                </motion.div>
            </div>

            {/* Dropdown for Social Media */}
            <div className="mt-6">
                <button
                    onClick={() => toggleSection('socialMedia')}
                    className={`w-full text-left text-lg font-space flex justify-between items-center border border-gray-300 p-3 rounded-t-md ${
                        openSection === 'socialMedia' ? '' : 'rounded-md'
                    }`}
                >
                    Redes Sociales
                    <FaChevronDown className="text-gray-500" />
                </button>
                <motion.div
                    initial="hidden"
                    animate={openSection === 'socialMedia' ? 'visible' : 'hidden'}
                    variants={sectionVariants}
                    className="overflow-hidden"
                >
                    <SocialMediaSection />
                </motion.div>
            </div>

            {/* Dropdown for Operation Policies */}
            <div className="mt-6">
                <button
                    onClick={() => toggleSection('operationPolicies')}
                    className={`w-full text-left text-lg font-space flex justify-between items-center border border-gray-300 p-3 rounded-t-md ${
                        openSection === 'operationPolicies' ? '' : 'rounded-md'
                    }`}
                >
                    Políticas de Operación
                    <FaChevronDown className="text-gray-500" />
                </button>
                <motion.div
                    initial="hidden"
                    animate={openSection === 'operationPolicies' ? 'visible' : 'hidden'}
                    variants={sectionVariants}
                    className="overflow-hidden"
                >
                    <OperationPoliciesSection />
                </motion.div>
            </div>
        </>
    );
};
