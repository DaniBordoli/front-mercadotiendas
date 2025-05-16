import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './styles.css';
import './CarouselMobile.css'; // Importa el CSS responsive

const Carousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [
        '/BannerMainDashboard/BannerBlackFriday.png',
        '/BannerMainDashboard/BannerSeasonDiscount.png',
        '/BannerMainDashboard/BannerWinterSeason.png',
    ];

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000); 
        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <>
           
            <div id="default-carousel" className="carousel-container carousel-desktop" data-carousel="slide">
                <div className="carousel-content">
                    {slides.map((slide, index) => (
                        <motion.div
                            key={index}
                            className="carousel-slide"
                            initial={{ x: index === currentIndex ? 0 : index < currentIndex ? "-100%" : "100%" }}
                            animate={{ x: index === currentIndex ? 0 : index < currentIndex ? "-100%" : "100%" }}
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                            data-carousel-item
                        >
                            <a 
                                href="#" 
                                className="carousel-link" 
                                onClick={(e) => e.preventDefault()}
                            >
                                <img
                                    src={slide}
                                    className="carousel-image"
                                    alt={`Slide ${index + 1}`}
                                />
                            </a>
                        </motion.div>
                    ))}
                </div>
                <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-blue-500" : "bg-gray-300"}`}
                            aria-current={index === currentIndex}
                            aria-label={`Slide ${index + 1}`}
                            onClick={() => setCurrentIndex(index)}
                        ></button>
                    ))}
                </div>
                <button
                    type="button"
                    className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    onClick={handlePrev}
                    data-carousel-prev
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg
                            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 1 1 5l4 4"
                            />
                        </svg>
                        <span className="sr-only">Previous</span>
                    </span>
                </button>
                <button
                    type="button"
                    className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    onClick={handleNext}
                    data-carousel-next
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg
                            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 9 4-4-4-4"
                            />
                        </svg>
                        <span className="sr-only">Next</span>
                    </span>
                </button>
            </div>
           
            <div className="carousel-mobile">
                <img
                    src="/CarouselMobile/CarouselMobile.png"
                    alt="Carousel Mobile"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>
        </>
    );
};

export default Carousel;

