'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem, Product } from '@/types';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
}

export default function ProductCard({ product, addToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="aspect-square overflow-hidden bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <span className="text-lg font-bold text-red-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
              {product.category}
            </span>
            
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              className="hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add to Cart
            </Button> 
          </div>
        </div>
      </CardContent>
    </Card>
  );
}