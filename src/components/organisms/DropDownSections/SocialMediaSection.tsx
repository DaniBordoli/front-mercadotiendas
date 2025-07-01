import * as React from 'react';
import { InputDefault } from '../../atoms/InputDefault';
import { DesignButton } from '../../atoms/DesignButton';
import { StatusTags } from '../../atoms/StatusTags';
import { FaInstagram, FaFacebook, FaWhatsapp, FaTiktok, FaYoutube } from "react-icons/fa";
import { useAuthStore, getShopSocial, updateShopSocial, ShopSocial } from '../../../stores/slices/authSlice';
import FullScreenLoader from '../../molecules/FullScreenLoader';

export const SocialMediaSection: React.FC = () => {
    const { user } = useAuthStore();
    const shopId = user?.shop?._id;
    const [form, setForm] = React.useState<ShopSocial>({});
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (shopId) {
            setLoading(true);
            getShopSocial(shopId)
                .then(data => { if (data) setForm(data); })
                .catch(() => {})
                .finally(() => setLoading(false));
        }
    }, [shopId]);

    const handleChange = (field: keyof ShopSocial) => (value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!shopId) return;
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await updateShopSocial(shopId, form);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
            {loading && <FullScreenLoader />}
            
            {/* Instrucciones para el usuario */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-sm text-blue-800 font-medium mb-1">📱 Instrucciones para redes sociales:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                    <li>• <strong>Instagram/TikTok:</strong> Solo ingresa tu nombre de usuario (ej: miusuario)</li>
                    <li>• <strong>Facebook/YouTube:</strong> Puedes usar el nombre de usuario o la URL completa</li>
                    <li>• <strong>WhatsApp:</strong> Ingresa tu número con código de país (ej: +54 9 11 1234-5678)</li>
                </ul>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="text-sm font-space mb-2 block">Instagram</label>
                    <div className="flex flex-col border border-gray-300 rounded-md p-2 w-full">
                        <div className="flex items-center w-full">
                            <FaInstagram className="text-gray-500 mr-2 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="miusuario (sin @)" 
                                className="w-full border-none outline-none bg-transparent" 
                                value={form.instagram || ''} 
                                onChange={(e) => handleChange('instagram')(e.target.value)}
                            />
                        </div>
                        <small className="text-gray-500 text-xs mt-1">Solo tu nombre de usuario, sin @ ni URL completa</small>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">Facebook</label>
                    <div className="flex flex-col border border-gray-300 rounded-md p-2 w-full">
                        <div className="flex items-center w-full">
                            <FaFacebook className="text-gray-500 mr-2 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="mipagina o facebook.com/mipagina" 
                                className="w-full border-none outline-none bg-transparent" 
                                value={form.facebook || ''} 
                                onChange={(e) => handleChange('facebook')(e.target.value)}
                            />
                        </div>
                        <small className="text-gray-500 text-xs mt-1">Nombre de página o URL completa de Facebook</small>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">WhatsApp</label>
                    <div className="flex flex-col border border-gray-300 rounded-md p-2 w-full">
                        <div className="flex items-center w-full">
                            <FaWhatsapp className="text-gray-500 mr-2 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="+54 9 11 1234-5678" 
                                className="w-full border-none outline-none bg-transparent" 
                                value={form.whatsapp || ''} 
                                onChange={(e) => handleChange('whatsapp')(e.target.value)}
                            />
                        </div>
                        <small className="text-gray-500 text-xs mt-1">Número completo con código de país (ej: +54 9 11 1234-5678)</small>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">TikTok</label>
                    <div className="flex flex-col border border-gray-300 rounded-md p-2 w-full">
                        <div className="flex items-center w-full">
                            <FaTiktok className="text-gray-500 mr-2 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="miusuario (sin @)" 
                                className="w-full border-none outline-none bg-transparent" 
                                value={form.tiktok || ''} 
                                onChange={(e) => handleChange('tiktok')(e.target.value)}
                            />
                        </div>
                        <small className="text-gray-500 text-xs mt-1">Solo tu nombre de usuario, sin @ ni URL completa</small>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">YouTube</label>
                    <div className="flex flex-col border border-gray-300 rounded-md p-2 w-full">
                        <div className="flex items-center w-full">
                            <FaYoutube className="text-gray-500 mr-2 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="micanal o youtube.com/c/micanal" 
                                className="w-full border-none outline-none bg-transparent" 
                                value={form.youtube || ''} 
                                onChange={(e) => handleChange('youtube')(e.target.value)}
                            />
                        </div>
                        <small className="text-gray-500 text-xs mt-1">Nombre de canal o URL completa de YouTube</small>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <label className="flex items-center text-sm font-space">Horarios de Atención</label>
                <InputDefault
                    placeholder="Ej: Lunes a Viernes de 9:00 a 18:00hs"
                    className="w-full mt-2"
                    value={form.horarios || ''}
                    onChange={handleChange('horarios')}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-6">
                <div>
                    <label className="text-sm font-space mb-2 block">Email Alternativo</label>
                    <InputDefault placeholder="contacto@empresa.com" className="w-full" value={form.emailAlternativo || ''} onChange={handleChange('emailAlternativo')} />
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">Teléfono Adicional</label>
                    <InputDefault placeholder="+54 11 1234-5678" className="w-full" value={form.telefonoAdicional || ''} onChange={handleChange('telefonoAdicional')} />
                </div>
            </div>
    
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2">
                    <p className="text-green-800 text-sm">
                         <strong>¡Guardado exitosamente!</strong> Tus redes sociales ahora aparecerán como enlaces en el footer de tu tienda.
                    </p>
                </div>
            )}
            <div className="flex flex-col gap-2 mt-6">
     
                <DesignButton variant="primary" onClick={handleSave} disabled={loading}>Guardar cambios</DesignButton>
            </div>
        </div>
    );
};
