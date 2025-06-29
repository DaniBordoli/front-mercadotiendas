import * as React from 'react';
import { InputDefault } from '../../atoms/InputDefault';
import { DesignButton } from '../../atoms/DesignButton';
import { StatusTags } from '../../atoms/StatusTags';
import { useShopStore, useAuthStore } from '../../../stores';
import FullScreenLoader from '../../molecules/FullScreenLoader';

export const DomainSubdomainSection: React.FC = () => {
    const { user } = useAuthStore();
    const { shop, getShop, updateShopInfo, loading, error } = useShopStore();
    const [subdomain, setSubdomain] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    React.useEffect(() => {
        if (!shop && user?.shop?._id) {
            getShop();
        }
    }, [shop, user?.shop?._id, getShop]);

    React.useEffect(() => {
        if (shop) {
            setSubdomain(shop.subdomain || '');
        }
    }, [shop]);

    const handleSave = async () => {
        if (!shop?._id) return;
        setSuccess(false);
        try {
            await updateShopInfo(shop._id, { subdomain });
            setSuccess(true);
        } catch (e) {
            setSuccess(false);
        }
    };

    return (
        <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
            {loading && <FullScreenLoader />}
            <div className="flex flex-col gap-4">
                <div className="mb-4">
                    <label className="text-sm font-space mb-2 block">Subdominio actual</label>
                    <div className="flex items-center">
                        <InputDefault
                            placeholder="mitienda"
                            value={subdomain}
                            onChange={setSubdomain}
                            className="w-full"
                        />
                        <span className="ml-2 text-gray-600 whitespace-nowrap">.mercadotiendas.com</span>
                    </div>
                </div>
                <div className="flex items-center mb-6">
                    <StatusTags status={success ? 'Active' : 'Inactive'} className="mr-2" />
                    <span className="text-gray-700 font-space">
                        {success ? 'Subdominio actualizado correctamente' : 'Dominio conectado correctamente'}
                    </span>
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <div className="flex flex-col gap-2">
                 
                    <DesignButton variant="primary" onClick={handleSave} disabled={loading}>Guardar cambios</DesignButton>
                </div>
            </div>
        </div>
    );
};
