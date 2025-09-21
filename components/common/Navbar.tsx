'use client';

import Link from 'next/link';
import { ShoppingCart, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import CartSheet from '@/components/cart/CartSheet';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { getItemCount } = useCart();
  const [showCart, setShowCart] = useState(false);
  const router = useRouter();
  const itemCount = getItemCount();

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🍕</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Campus Eats</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Menu
            </Link>
            {user && (
              <Link 
                href="/orders" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                My Orders
              </Link>
            )}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="text-red-600 hover:text-red-700 font-medium transition-colors flex items-center space-x-1"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCart(true)}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.full_name || user.email}
                  </p>
                  {profile && (
                    <p className="text-xs text-gray-500 capitalize">
                      {profile.role}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await signOut();
                    toast.success('Signed out successfully');
                    router.push('/');
                  }} >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="flex justify-around py-2">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
          >
            Menu
          </Link>
          {user && (
            <Link 
              href="/orders" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
            >
              Orders
            </Link>
          )}
          {isAdmin && (
            <Link 
              href="/admin" 
              className="text-red-600 hover:text-red-700 text-sm font-medium py-2"
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      <CartSheet open={showCart} onClose={() => setShowCart(false)} />
    </nav>
  );
}