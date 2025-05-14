import React from 'react';

interface CategorySectionProps {
  title?: string;
  backgroundColor?: string;
  titleColor?: string;
}

const categories = [
  {
    label: "Women's Fashion",
    img: "https://plus.unsplash.com/premium_photo-1671718111684-9142a70a5fe0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    label: "Men's Collection",
    img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    label: "Accessories",
    img: "https://plus.unsplash.com/premium_photo-1681276170683-706111cf496e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

const CategorySection: React.FC<CategorySectionProps> = ({
  title = "Shop by Category",
  backgroundColor = "#fff",
  titleColor = "#000",
}) => {
  return (
    <div className="py-12" style={{ backgroundColor }}>
      <h2 className="text-2xl font-bold text-center mb-8" style={{ color: titleColor }}>{title}</h2>
      <div className="flex justify-center mx-28 gap-8">
        {categories.map((cat, idx) => (
          <div key={idx} className="relative w-1/3 h-96 rounded-lg overflow-hidden shadow-md">
            <img
              src={cat.img}
              alt={cat.label}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl font-semibold drop-shadow-lg">{cat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
