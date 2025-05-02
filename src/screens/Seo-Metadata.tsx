import * as React from 'react';
import { Navbar } from '../components/organisms/Navbar';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { MdOutlineRestore } from 'react-icons/md';
import { DesignButton } from '../components/atoms/DesignButton';

const SeoMetadata = () => {
    const [seoTitle, setSeoTitle] = React.useState('');
    const [metaDescription, setMetaDescription] = React.useState('');
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [currentKeyword, setCurrentKeyword] = React.useState('');

    const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentKeyword.trim() && keywords.length < 10) {
            setKeywords([...keywords, currentKeyword.trim()]);
            setCurrentKeyword('');
            e.preventDefault();
        }
    };

    return (
        <div>
            <Navbar />
            <div className="h-screen bg-gray-100 p-5">
                <div className="w-4/5 mt-24 mx-auto bg-white p-5 rounded-lg shadow-md">
                    <h1 className="text-left text-xl font-space">SEO y Metadata</h1>
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-gray-600 font-space">Título</label>
                            <span className="text-sm text-gray-500">{seoTitle.length}/60</span>
                        </div>
                        <InputDefault
                            placeholder="Ej: Mi Tienda Online | Productos Exclusivos"
                            value={seoTitle}
                            onChange={setSeoTitle}
                            className="w-full"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            El título aparecerá en los resultados de búsqueda
                        </p>
                    </div>
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-gray-600 font-space">Meta descripción</label>
                            <span className="text-sm text-gray-500">{metaDescription.length}/160</span>
                        </div>
                        <textarea
                            placeholder="Meta descripción"
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                            rows={4}
                            maxLength={160}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Esta descripción aparecerá debajo del título en los resultados de búsqueda
                        </p>
                    </div>
                    <div className="mt-6">
                        <p className="text-sm text-gray-500 mt-2">
                            Palabras clave
                        </p>
                        <div className="border border-gray-300 rounded-md p-3">
                            <input
                                type="text"
                                placeholder="Agregar palabras clave y presionar Enter"
                                value={currentKeyword}
                                onChange={(e) => setCurrentKeyword(e.target.value)}
                                onKeyPress={handleKeywordKeyPress}
                                className="w-full border-none outline-none text-sm font-space"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Separa las palabras clave con Enter (máximo 10 palabras)
                        </p>
                    </div>
                    <div className="mt-6 bg-gray-100 p-4 rounded-md">
                        <p className="text-sm text-gray-600 font-space mb-2">Vista previa en Google</p>
                        <p className="text-blue-600 text-xlfont-space">
                            {seoTitle || 'Mi Tienda Online | Productos Exclusivos'}
                        </p>
                        <p className="text-green-600 text-sm font-space">
                            www.{seoTitle || 'mitienda'}.mercadotiendas.com
                        </p>
                        <p className="text-gray-600 text-sm font-space">
                            {metaDescription || 'Vista previa de la meta descripción...'}
                        </p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-4">
                        <DesignButton variant="neutral" icon={MdOutlineRestore}>
                            Restaurar
                        </DesignButton>
                        <DesignButton variant="primary">Guardar cambios</DesignButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeoMetadata;
