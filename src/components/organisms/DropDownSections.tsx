import * as React from 'react';
import { InputDefault } from '../atoms/InputDefault/InputDefault';
import { DesignButton } from '../atoms/DesignButton';
import { StatusTags } from '../atoms/StatusTags';
import { FaInstagram, FaFacebook, FaChevronDown, FaWhatsapp, FaTiktok, FaYoutube } from "react-icons/fa";
import { SelectDefault } from '../atoms/SelectDefault';

interface DropDownSectionsProps {
    openSection: string | null;
    toggleSection: (section: string) => void;
}

export const DropDownSections: React.FC<DropDownSectionsProps> = ({ openSection, toggleSection }) => {
    const selectOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ];
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
                {openSection === 'commerceInfo' && (
                    <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
                        <div className="grid grid-cols-2 gap-4">
                            
                            <div>
                                <label className="text-sm font-space mb-2 block">Nombre de la tienda</label>
                                <InputDefault placeholder="Ingrese nombre de la tienda" className="w-full" />
                            </div>
                            <div>
                                <label className="text-sm font-space mb-2 block">País</label>
                                <SelectDefault placeholder="Seleccionar país" className="w-full" options={selectOptions} />
                            </div>
                            
                            
                            <div>
                                <label className="text-sm font-space mb-2 block">Provincia</label>
                                <SelectDefault placeholder="Seleccionar provincia" className="w-full" options={selectOptions} />
                            </div>
                            <div>
                                <label className="text-sm font-space mb-2 block">Ciudad</label>
                                <SelectDefault placeholder="Seleccionar ciudad" className="w-full" options={selectOptions} />
                            </div>
                            
                           
                            <div>
                                <label className="text-sm font-space mb-2 block">Domicilio fiscal</label>
                                <InputDefault placeholder="Ingrese domicilio" className="w-full" />
                            </div>
                            <div>
                                <label className="text-sm font-space mb-2 block">Teléfono</label>
                                <InputDefault placeholder="Ingrese teléfono" className="w-full" />
                            </div>
                          
                            <div>
                                <label className="text-sm font-space mb-2 block">Correo electrónico</label>
                                <InputDefault placeholder="Ingrese correo" className="w-full" />
                            </div>
                            <div>
                                <label className="text-sm font-space mb-2 block">Rubro</label>
                                <SelectDefault placeholder="Seleccionar rubro" className="w-full" options={selectOptions} />
                            </div>
                            
                            
                            <div>
                                <label className="text-sm font-space mb-2 block">Moneda preferida</label>
                                <SelectDefault placeholder="ARS - Peso argentino" className="w-full" options={selectOptions} />
                            </div>
                            <div>
                                <label className="text-sm font-space mb-2 block">Idioma principal</label>
                                <SelectDefault placeholder="Español" className="w-full" options={selectOptions} />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <DesignButton variant="neutral">Restaurar</DesignButton>
                            <DesignButton variant="primary">Guardar cambios</DesignButton>
                        </div>
                    </div>
                )}
            </div>

        
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
                {openSection === 'seoMetadata' && (
                    <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
                        <div className="mb-4">
                            <label className="text-sm font-space mb-2 block">Subdominio actual</label>
                            <div className="flex items-center">
                                <InputDefault
                                    placeholder="mitienda"
                                    value="mitienda"
                                    className="w-full"
                                   
                                />
                                <span className="ml-2 text-gray-600 whitespace-nowrap">.mercadotiendas.com</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="text-sm font-space mb-2 block">Dominio personalizado</label>
                            <InputDefault
                                placeholder="www.mitienda.com"
                                value="www.mitienda.com"
                                className="w-full"
                                
                            />
                        </div>
                        <div className="flex items-center mb-6">
                            <StatusTags status="Active" className="mr-2" />
                            <span className="text-gray-700 font-space">Dominio conectado correctamente</span>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <DesignButton variant="neutral">Restaurar</DesignButton>
                            <DesignButton variant="primary">Guardar cambios</DesignButton>
                        </div>
                    </div>
                )}
            </div>

           
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
                {openSection === 'institutionalDescription' && (
                    <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
                        <div className="mb-4">
                            <label className="text-sm font-space mb-2 block">Descripción de la tienda</label>
                            <textarea
                                placeholder="Describe tu tienda..."
                                className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                                rows={4}
                            />
                            <div className="text-right text-sm text-gray-500 mt-1">0/2000 caracteres</div>
                        </div>
                        <div className="mb-4">
                            <label className="text-sm font-space mb-2 block">Misión</label>
                            <textarea
                                placeholder="Misión de la empresa..."
                                className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                                rows={2}
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="text-sm font-space mb-2 block">Visión</label>
                            <textarea
                                placeholder="Describe la visión de tu empresa..."
                                className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                                rows={4}
                                maxLength={2000}
                            />
                            
                        </div>

                       
                        <div className="mb-4">
                            <label className="text-sm font-space mb-2 block">Historia</label>
                            <textarea
                                placeholder="Describe la historia de tu empresa..."
                                className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                                rows={4}
                            />
                        </div>

                       
                        <div className="mb-4">
                            <label className="text-sm font-space mb-2 block">Valores</label>
                            <textarea
                                placeholder="Describe los valores de tu empresa..."
                                className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <DesignButton variant="neutral">Restaurar</DesignButton>
                            <DesignButton variant="primary">Guardar cambios</DesignButton>
                        </div>
                    </div>
                )}
            </div>
            
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
                {openSection === 'seoMetadataSection' && (
                    <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
                        <div className="mb-4">
                            <label className="text-sm font-space mb-2 block">Título SEO</label>
                            <InputDefault
                                placeholder="Título SEO (máx. 60 caracteres)"
                                className="w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="text-sm font-space mb-2 block">Meta descripción</label>
                            <textarea
                                placeholder="Meta descripción (máx. 160 caracteres)"
                                className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <DesignButton variant="neutral">Restaurar</DesignButton>
                            <DesignButton variant="primary">Guardar cambios</DesignButton>
                        </div>
                    </div>
                )}
            </div>

           
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
                {openSection === 'socialMedia' && (
                    <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
                        <div className="grid grid-cols-2 gap-4">
                           
                            <div>
                                <label className="text-sm font-space mb-2 block">Instagram</label>
                                <div className="flex items-center border border-gray-300 rounded-md p-2">
                                    <FaInstagram className="text-gray-500 mr-2" />
                                    <InputDefault placeholder="@usuario" className="w-full border-none outline-none" />
                                </div>
                            </div>
                           
                            <div>
                                <label className="text-sm font-space mb-2 block">Facebook</label>
                                <div className="flex items-center border border-gray-300 rounded-md p-2">
                                    <FaFacebook className="text-gray-500 mr-2" />
                                    <InputDefault placeholder="facebook.com/página" className="w-full border-none outline-none" />
                                </div>
                            </div>
                           
                            <div>
                                <label className="text-sm font-space mb-2 block">WhatsApp</label>
                                <div className="flex items-center border border-gray-300 rounded-md p-2">
                                    <FaWhatsapp className="text-gray-500 mr-2" />
                                    <InputDefault placeholder="+54 9 11 1234-5678" className="w-full border-none outline-none" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-sm font-space mb-2 block">TikTok</label>
                                <div className="flex items-center border border-gray-300 rounded-md p-2">
                                    <FaTiktok className="text-gray-500 mr-2" />
                                    <InputDefault placeholder="@usuario" className="w-full border-none outline-none" />
                                </div>
                            </div>
                            
                            <div className="col-span-2">
                                <label className="text-sm font-space mb-2 block">YouTube</label>
                                <div className="flex items-center w-[700px] border border-gray-300 rounded-md p-2">
                                    <FaYoutube className="text-gray-500 mr-2" />
                                    <InputDefault placeholder="youtube.com/canal" className="w-full border-none outline-none" />
                                </div>
                            </div>
                        </div>

                        
                        <div className="mt-6">
                            <label className="flex items-center text-sm font-space">
                               
                                Horarios de Atención
                            </label>
                            <InputDefault
                                placeholder="Ej: Lunes a Viernes de 9:00 a 18:00hs"
                                className="w-full mt-2"
                            />
                        </div>

                        
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div>
                                <label className="text-sm font-space mb-2 block">Email Alternativo</label>
                                <InputDefault placeholder="contacto@empresa.com" className="w-full" />
                            </div>
                            <div>
                                <label className="text-sm font-space mb-2 block">Teléfono Adicional</label>
                                <InputDefault placeholder="+54 11 1234-5678" className="w-full" />
                            </div>
                        </div>

                    
                        <div className="flex items-center mt-6">
                            <StatusTags status="Active" className="mr-2" />
                            <span className="text-gray-700 font-space">Todos los enlaces están funcionando correctamente</span>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <DesignButton variant="neutral">Restaurar</DesignButton>
                            <DesignButton variant="primary">Guardar cambios</DesignButton>
                        </div>
                    </div>
                )}
            </div>

           
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
                {openSection === 'operationPolicies' && (
                    <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
                       
                            <label className="text-sm font-space mb-2 block">Políticas de Envío</label>
                        <div className="mb-6 border border-gray-200 rounded-md p-4">
                            <textarea
                                placeholder="Describe las políticas de envío..."
                                className="w-full border border-gray-300 mt-12 rounded-md p-3 text-sm font-space"
                                rows={4}
                            />
                        </div>

                       
                            <label className="text-sm font-space mb-2 block">Políticas de Devoluciones</label>
                        <div className="mb-6 border border-gray-200 rounded-md p-4">
                            <textarea
                                placeholder="Describe las políticas de devoluciones..."
                                className="w-full border border-gray-300 mt-12 rounded-md p-3 text-sm font-space"
                                rows={4}
                            />
                        </div>

                     
                            <label className="text-sm font-space mb-2 block">Términos y Condiciones</label>
                        <div className="mb-6 border border-gray-200 rounded-md p-4">
                            <textarea
                                placeholder="Describe los términos y condiciones..."
                                className="w-full border border-gray-300 mt-12 rounded-md p-3 text-sm font-space"
                                rows={4}
                            />
                        </div>

                       
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-sm font-space mb-2 block">CUIT/RUT</label>
                                <InputDefault placeholder="Ingrese CUIT/RUT" className="w-full" />
                            </div>
                            <div>
                                <label className="text-sm font-space mb-2 block">Razón Social</label>
                                <InputDefault placeholder="Ingrese razón social" className="w-full" />
                            </div>
                        </div>

                   
                        <div className="mb-6">
                            <label className="text-sm font-space mb-2 block">Domicilio Fiscal</label>
                            <InputDefault placeholder="Ingrese domicilio fiscal" className="w-full" />
                        </div>

                  
                        <div className="flex justify-end space-x-4">
                            <DesignButton variant="neutral">Restaurar</DesignButton>
                            <DesignButton variant="primary">Guardar cambios</DesignButton>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
};
