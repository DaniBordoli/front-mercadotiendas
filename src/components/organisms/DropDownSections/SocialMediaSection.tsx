import * as React from 'react';
import { InputDefault } from '../../atoms/InputDefault';
import { DesignButton } from '../../atoms/DesignButton';
import { StatusTags } from '../../atoms/StatusTags';
import { FaInstagram, FaFacebook, FaWhatsapp, FaTiktok, FaYoutube } from "react-icons/fa";

export const SocialMediaSection: React.FC = () => {
    return (
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
                <label className="flex items-center text-sm font-space">Horarios de Atención</label>
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
    );
};
