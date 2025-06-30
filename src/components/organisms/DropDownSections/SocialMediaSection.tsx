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
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="text-sm font-space mb-2 block">Instagram</label>
                    <div className="flex flex-col border border-gray-300 rounded-md p-2 w-full">
                        <div className="flex items-center w-full">
                            <FaInstagram className="text-gray-500 mr-2" />
                            <InputDefault placeholder="@usuario" className="w-full border-none outline-none" value={form.instagram || ''} onChange={handleChange('instagram')} />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">Facebook</label>
                    <div className="flex flex-col border border-gray-300 rounded-md p-2 w-full">
                        <div className="flex items-center w-full">
                            <FaFacebook className="text-gray-500 mr-2" />
                            <InputDefault placeholder="facebook.com/página" className="w-full border-none outline-none" value={form.facebook || ''} onChange={handleChange('facebook')} />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">WhatsApp</label>
                    <div className="flex flex-col border border-gray-300 rounded-md p-2 w-full">
                        <div className="flex items-center w-full">
                            <FaWhatsapp className="text-gray-500 mr-2" />
                            <InputDefault placeholder="+54 9 11 1234-5678" className="w-full border-none outline-none" value={form.whatsapp || ''} onChange={handleChange('whatsapp')} />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">TikTok</label>
                    <div className="flex flex-col border border-gray-300 rounded-md p-2 w-full">
                        <div className="flex items-center w-full">
                            <FaTiktok className="text-gray-500 mr-2" />
                            <InputDefault placeholder="@usuario" className="w-full border-none outline-none" value={form.tiktok || ''} onChange={handleChange('tiktok')} />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">YouTube</label>
                    <div className="flex flex-col border border-gray-300 rounded-md p-2 w-full">
                        <div className="flex items-center w-full">
                            <FaYoutube className="text-gray-500 mr-2" />
                            <InputDefault placeholder="youtube.com/canal" className="w-full border-none outline-none" value={form.youtube || ''} onChange={handleChange('youtube')} />
                        </div>
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
            <div className="flex flex-col gap-2 mt-6">
     
                <DesignButton variant="primary" onClick={handleSave} disabled={loading}>Guardar cambios</DesignButton>
            </div>
        </div>
    );
};
