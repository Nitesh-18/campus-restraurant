import ProductGrid from '@/components/common/ProductGrid';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Fresh Food, <span className="text-yellow-300">Fast Delivery</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              Order from your favorite campus restaurant
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Fresh Ingredients</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Quick Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Menu
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover delicious meals made with fresh, local ingredients. 
              All orders are prepared to order and delivered hot.
            </p>
          </div>
          
          <ProductGrid />
        </div>
      </section>
    </div>
  );
}