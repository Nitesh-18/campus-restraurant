'use client';

import { useEffect, useState, useCallback } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { createSupabaseClient } from '@/lib/supabase.client';
import { useCart } from '@/hooks/useCart';

const PAGE_SIZE = 8;

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { addToCart } = useCart();

  const fetchProducts = useCallback(
    async (reset = false) => {
      setLoading(true);
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, category, available, created_at')
        .eq('available', true)
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

      if (error) {
        setError(`Supabase error: ${error.message}`);
        setLoading(false);
        return;
      }

      if (reset) {
        setProducts(data || []);
      } else {
        setProducts(prev => [...prev, ...(data || [])]);
      }

      setHasMore((data?.length || 0) === PAGE_SIZE);
      setLoading(false);
    },
    [page]
  );

  useEffect(() => {
    fetchProducts(page === 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load products. Please try again later.</p>
        <pre className="text-xs text-red-500">{error}</pre>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}