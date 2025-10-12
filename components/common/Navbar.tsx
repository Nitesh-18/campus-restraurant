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
  const [signingOut, setSigningOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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
            <span className="font-bold text-xl text-gray-900">Campus Zomato</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {profile?.role === 'customer' && (
              <>
                <Link
                  href="/orders"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  My Orders
                </Link>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Contact
                </Link>
              </>
            )}
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-red-600 hover:text-red-700 font-medium transition-colors flex items-center space-x-1"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            {!user && (
              <>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Contact
                </Link>
              </>
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
              <div className="relative flex items-center space-x-3">
                <div className="hidden sm:flex sm:items-center sm:space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{profile?.full_name || user.email}</p>
                    {profile && <p className="text-xs text-gray-500 capitalize">{profile.role}</p>}
                  </div>
                </div>

                <div className="relative" tabIndex={0} onBlur={() => setShowUserMenu(false)}>
                  <button
                    aria-label="User menu"
                    onClick={() => setShowUserMenu((s) => !s)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <User className="w-5 h-5 text-gray-700" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                      <ul>
                        <li>
                          <Link href="/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Change Password</Link>
                        </li>
                        <li>
                          <button
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={async () => {
                              setSigningOut(true);
                              try {
                                await signOut();
                                toast.success('Signed out successfully');
                                router.push('/');
                              } catch (err) {
                                console.error("[Navbar] Sign out failed:", err);
                                toast.error('Failed to sign out');
                              } finally {
                                setSigningOut(false);
                              }
                            }}
                          >
                            {signingOut ? 'Signing Out...' : 'Sign Out'}
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
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
          {profile?.role === 'customer' && (
            <>
              <Link
                href="/orders"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
              >
                My Orders
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
              >
                Contact
              </Link>
            </>
          )}
          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              className="text-red-600 hover:text-red-700 text-sm font-medium py-2"
            >
              Admin
            </Link>
          )}
          {!user && (
            <>
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
              >
                Contact
              </Link>
            </>
          )}
        </div>
      </div>

      <CartSheet open={showCart} onClose={() => setShowCart(false)} />
    </nav>
  );
}