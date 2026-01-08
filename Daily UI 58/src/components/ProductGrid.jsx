import { useState } from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/products';

const ProductGrid = ({ onCustomize }) => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">
          FEATURED COLLECTION
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onCustomize={onCustomize}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
