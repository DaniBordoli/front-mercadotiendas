import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import './CarouselMobile.css';

const Carousel: React.FC = () => {
    const [currentVideo, setCurrentVideo] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();
    
    const videos = [
        '/video1home.mp4',
        '/video3home.mp4',
        '/video4home.mp4'
    ];

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleVideoEnd = () => {
            setCurrentVideo((prev) => (prev === 2 ? 0 : prev + 1));
        };

        video.addEventListener('ended', handleVideoEnd);
        return () => video.removeEventListener('ended', handleVideoEnd);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.src = videos[currentVideo];
            video.load();
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error('Error al reproducir el video:', error);
                    }
                });
            }
        }
    }, [currentVideo]);

    const handleStartBuying = () => {
        navigate('/dashboard');
    };

    const handleOpenStore = () => {
        navigate('/shop-create');
    };

    return (
        <>
            {/* Hero Section con Video de Fondo */}
            <section className="h-[620px] bg-gradient-to-br from-[#ff4f41]/10 to-white relative overflow-hidden mt-0">
                {/* Video de fondo */}
                <div className="absolute inset-0">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop={false}
                        playsInline
                    >
                        <source src={videos[currentVideo]} type="video/mp4" />
                        Tu navegador no soporta videos.
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-800/10"></div>
                </div>
                
                {/* Contenido del Hero */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
                    <div className="max-w-2xl">
                        <h1 className="text-6xl md:text-6xl font-bold font-space text-white mb-6 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-md:text-[28px] max-md:w-[292px] max-md:h-[135px] max-md:leading-[1.2] max-md:mx-auto max-md:flex max-md:items-center max-md:justify-center max-md:text-center">
                            Comprá, vendé y colaborá con influencers
                        </h1>
                        <p className="text-xl text-white mb-8 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] max-md:w-[292px] max-md:h-[87.75px] max-md:mx-auto max-md:flex max-md:items-center max-md:justify-center max-md:text-center max-md:text-base">
                            La plataforma que conecta tiendas, creadores y compradores en un ecosistema único de comercio colaborativo
                        </p>
                        <div className="flex gap-4 max-md:flex-col max-md:items-center">
                            <button 
                                onClick={handleStartBuying}
                                className="px-8 py-4 bg-[#ff4f41] text-white rounded-lg hover:bg-[#ff4f41]/80 transition-colors font-medium text-lg max-md:w-[292px] max-md:h-[48px] max-md:px-4 max-md:py-2 max-md:text-base max-md:flex max-md:items-center max-md:justify-center"
                            >
                                Empezá a comprar
                            </button>
                            <button 
                                onClick={handleOpenStore}
                                className="px-8 py-4 bg-white text-[#ff4f41] border-2 border-[#ff4f41] rounded-lg hover:bg-[#ff4f41]/5 transition-colors font-medium text-lg max-md:w-[292px] max-md:h-[48px] max-md:px-4 max-md:py-2 max-md:text-base max-md:flex max-md:items-center max-md:justify-center"
                            >
                                Abrí tu tienda
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Carousel;

