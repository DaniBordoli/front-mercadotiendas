import React from 'react';

const categories = [
  {
    title: "TEXTILES",
    mainImage: "https://placehold.co/300x200",
    smallImages: [
      "https://placehold.co/70x70",
      "https://placehold.co/70x70",
      "https://placehold.co/70x70",
      "https://placehold.co/70x70",
    ],
  },
  {
    title: "DEPORTES",
    mainImage: "https://placehold.co/300x200",
    smallImages: [
      "https://placehold.co/70x70",
      "https://placehold.co/70x70",
      "https://placehold.co/70x70",
      "https://placehold.co/70x70",
    ],
  },
  {
    title: "CELULARES",
    mainImage: "https://placehold.co/300x200",
    smallImages: [
      "https://placehold.co/70x70",
      "https://placehold.co/70x70",
      "https://placehold.co/70x70",
      "https://placehold.co/70x70",
    ],
  },
];

export const CategoryCards: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-6 mt-24">
      {categories.map((category, index) => (
        <div
          key={index}
          className="w-96 h-auto bg-white rounded-sm shadow-md flex flex-col overflow-hidden"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-4 pt-4">{category.title}</h2>
          <img
            src={category.mainImage}
            alt={category.title}
            className="w-full h-auto mb-4"
          />
          <div className="flex justify-between w-full px-6 pb-4">
            {category.smallImages.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`${category.title} ${idx + 1}`}
                className="w-20 h-16 rounded-md"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
