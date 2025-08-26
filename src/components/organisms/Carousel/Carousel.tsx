import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import './CarouselMobile.css';

const Carousel: React.FC = () => {
    const [currentVideo, setCurrentVideo] = useState(0);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0); // 0 o 1 para alternar entre videos
    const [isTransitioning, setIsTransitioning] = useState(false);
    const videoRef1 = useRef<HTMLVideoElement>(null);
    const videoRef2 = useRef<HTMLVideoElement>(null);
    const preloadVideoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();
    
    const videos = [
        '/video1home.mp4',
        '/video3home.mp4',
        '/video4home.mp4'
    ];

    useEffect(() => {
        const activeVideo = activeVideoIndex === 0 ? videoRef1.current : videoRef2.current;
        if (!activeVideo) return;

        const handleVideoEnd = () => {
            setIsTransitioning(true);
            const nextVideoIndex = currentVideo === 2 ? 0 : currentVideo + 1;
            const nextVideo = activeVideoIndex === 0 ? videoRef2.current : videoRef1.current;
            
            if (nextVideo) {
                // Preparar el siguiente video
                nextVideo.src = videos[nextVideoIndex];
                nextVideo.currentTime = 0;
                
                // Reproducir el siguiente video
                const playPromise = nextVideo.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Cambiar al siguiente video después de un breve delay
                        setTimeout(() => {
                            setCurrentVideo(nextVideoIndex);
                            setActiveVideoIndex(prev => prev === 0 ? 1 : 0);
                            setIsTransitioning(false);
                        }, 100);
                    }).catch(error => {
                        if (error.name !== 'AbortError') {
                            console.error('Error al reproducir el siguiente video:', error);
                        }
                        setIsTransitioning(false);
                    });
                }
            }
        };

        activeVideo.addEventListener('ended', handleVideoEnd);
        return () => {
            activeVideo.removeEventListener('ended', handleVideoEnd);
        };
    }, [activeVideoIndex, currentVideo, videos]);

    useEffect(() => {
        const activeVideo = activeVideoIndex === 0 ? videoRef1.current : videoRef2.current;
        const preloadVideo = preloadVideoRef.current;
        
        if (activeVideo && !isTransitioning) {
            activeVideo.src = videos[currentVideo];
            activeVideo.load();
            const playPromise = activeVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error('Error al reproducir el video:', error);
                    }
                });
            }
        }
        
        // Preload del siguiente video
        if (preloadVideo) {
            const nextVideoIndex = currentVideo === 2 ? 0 : currentVideo + 1;
            preloadVideo.src = videos[nextVideoIndex];
            preloadVideo.load();
        }
    }, [currentVideo, videos, activeVideoIndex, isTransitioning]);

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
                    {/* Video 1 */}
                    <video
                        ref={videoRef1}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                            activeVideoIndex === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                        autoPlay
                        muted
                        loop={false}
                        playsInline
                        preload="metadata"
                    >
                        <source src={videos[currentVideo]} type="video/mp4" />
                        Tu navegador no soporta videos.
                    </video>
                    
                    {/* Video 2 */}
                    <video
                        ref={videoRef2}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                            activeVideoIndex === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                        muted
                        loop={false}
                        playsInline
                        preload="metadata"
                    >
                        <source src={videos[currentVideo]} type="video/mp4" />
                        Tu navegador no soporta videos.
                    </video>
                    
                    {/* Video oculto para preload */}
                    <video
                        ref={preloadVideoRef}
                        className="hidden"
                        muted
                        preload="auto"
                    />
                    
                    {/* Overlay gris para mejorar legibilidad del texto */}
                    <div className="absolute inset-0 bg-gray-600/70 z-20"></div>
                </div>
                
                {/* Contenido del Hero */}
                <div className="relative z-30 max-w-7xl mx-auto px-6 h-full flex items-center max-md:justify-center">
                    <div className="max-w-2xl relative z-40 max-md:flex max-md:flex-col max-md:items-center max-md:text-center">
                        <h1 className="text-6xl md:text-6xl font-bold font-space text-white mb-10 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] max-md:text-[36px] max-md:w-[292px] max-md:h-[135px] max-md:leading-[1.2] max-md:mx-auto max-md:flex max-md:items-center max-md:justify-center max-md:text-center max-md:mb-8">
                            Comprá, vendé y colaborá con influencers
                        </h1>
                        <p className="text-xl text-white mb-12 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-md:w-[292px] max-md:h-[87.75px] max-md:mx-auto max-md:flex max-md:items-center max-md:justify-center max-md:text-center max-md:text-[16px] max-md:mb-10">
                            La plataforma que conecta tiendas, creadores y compradores en un ecosistema único de comercio colaborativo
                        </p>
                        <div className="flex gap-4 max-md:flex-col max-md:items-center relative z-50">
                            <button 
                                onClick={handleStartBuying}
                                className="px-8 py-4 bg-[#ff4f41] text-white rounded-lg hover:bg-[#ff4f41]/80 transition-colors font-medium text-lg max-md:w-[292px] max-md:h-[48px] max-md:px-4 max-md:py-2 max-md:text-base max-md:flex max-md:items-center max-md:justify-center shadow-lg"
                            >
                                Empezá a comprar
                            </button>
                            <button 
                                onClick={handleOpenStore}
                                className="px-8 py-4 bg-white text-[#ff4f41] border-2 border-[#ff4f41] rounded-lg hover:bg-[#ff4f41]/5 transition-colors font-medium text-lg max-md:w-[292px] max-md:h-[48px] max-md:px-4 max-md:py-2 max-md:text-base max-md:flex max-md:items-center max-md:justify-center shadow-lg"
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

