import React from 'react';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar/Navbar';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';

const layouts = [
	{
		name: 'Minimal Modern',
		description: 'Ideal para moda',
		img: '/templatePreview/template1.png',
		tag: 'Popular',
		tagColor: 'bg-red-100 text-red-500',
		applyRoute: '/first-layout',
		previewRoute: '/first-layout',
	},
	{
		name: 'Classic Elegant',
		description: 'Ideal para joyería',
		img: '/templatePreview/template2.png',
		tag: 'Nuevo',
		tagColor: 'bg-green-100 text-green-600',
		applyRoute: '/create-shop-ai',
		previewRoute: '/create-shop-ai',
	},
	{
		name: 'Tech Modern',
		description: 'Ideal para electrónica',
		img: '/templatePreview/template3.png',
		tag: null,
		tagColor: '',
		applyRoute: undefined,
		previewRoute: undefined,
	},
	{
		name: 'Artisan Boutique',
		description: 'Ideal para artesanías',
		img: '/templatePreview/template4.png',
		tag: null,
		tagColor: '',
		applyRoute: undefined,
		previewRoute: undefined,
	},
];

const LayoutSelection: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedLayout, setSelectedLayout] = React.useState<number | null>(
		null
	);

	// Detectar si viene del dashboard o es acceso directo
	const isFromDashboard = location.pathname === '/layout-select';

	const getPreviewSrc = () => {
		if (selectedLayout === null) return undefined;
		const route = layouts[selectedLayout].previewRoute;
		if (!route) return undefined;
		return `${window.location.origin}${route}`;
	};

	const LayoutContent = () => (
		<div className={`min-h-screen bg-[#F8F8F8] flex flex-col items-center py-4 md:py-10 px-4 md:px-0 ${isFromDashboard ? 'md:ml-[250px]' : ''}`}>
			<div className="w-full max-w-6xl bg-white mt-8 md:mt-16 rounded-lg shadow p-4 md:p-8">
				<div className="flex flex-wrap gap-4 md:gap-8 border-b pb-4 mb-8 overflow-x-auto">
					<span className="text-primary font-semibold border-b-2 border-primary pb-2 whitespace-nowrap">
						Layout
					</span>
					<span className="text-gray-500 whitespace-nowrap">Paleta de colores</span>
					<span className="text-gray-500 whitespace-nowrap">Tipografía</span>
					
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
					{layouts.map((layout, idx) => (
						<div
							key={layout.name}
							className="border rounded-lg p-4 bg-white flex flex-col gap-2 shadow-sm"
						>
							<div className="w-full h-32 md:h-40 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden">
								<img
									src={layout.img}
									alt={layout.name}
									className="object-cover w-full h-full"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex-1 min-w-0">
									<div className="font-medium text-sm md:text-base truncate">{layout.name}</div>
									<div className="text-xs text-gray-500 truncate">
										{layout.description}
									</div>
								</div>
								{layout.tag && (
									<span
										className={`text-xs px-2 py-1 rounded-full font-semibold ${layout.tagColor} ml-2 flex-shrink-0`}
									>
										{layout.tag}
									</span>
								)}
							</div>
							<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
								<DesignButton
									variant="neutral"
									fullWidth
									onClick={() => setSelectedLayout(idx)}
								>
									Previsualizar
								</DesignButton>
								<DesignButton
									variant="primary"
									fullWidth
									onClick={
										layout.applyRoute
											? () => navigate(layout.applyRoute)
											: undefined
									}
								>
									Aplicar
								</DesignButton>
							</div>
						</div>
					))}
				</div>
				<div className="flex justify-center mt-6 md:mt-8">
					<DesignButton variant="neutral">Ver más layouts</DesignButton>
				</div>
			</div>
			<div className="w-full max-w-6xl mt-8 md:mt-12">
				<h2 className="text-lg md:text-xl font-semibold mb-4 text-center px-4">
					Vista Previa
				</h2>
				<div className="bg-white rounded-lg shadow p-4 md:p-8 flex items-center justify-center min-h-[300px] md:min-h-[400px] text-gray-400 mx-4 md:mx-0">
					{getPreviewSrc() ? (
						<iframe
							src={getPreviewSrc()}
							title="Vista previa Layout"
							className="w-full h-[400px] md:h-[600px] rounded border"
							style={{ minHeight: 300, border: 'none' }}
						/>
					) : (
						<span className="text-center text-sm md:text-base">Aquí irá la vista previa del layout seleccionado.</span>
					)}
				</div>
			</div>
		</div>
	);

	return (
		<>
			{isFromDashboard ? (
				// Layout del dashboard con sidebar
				<>
					<DataSideBar />
					<LayoutContent />
				</>
			) : (
				// Layout independiente con navbar
				<>
					<Navbar />
					<LayoutContent />
				</>
			)}
		</>
	);
};

export default LayoutSelection;
