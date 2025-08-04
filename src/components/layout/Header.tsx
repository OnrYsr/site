'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X, ChevronDown, LogOut, Settings, FileText, Package } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session, status } = useSession();
  const { totalItems } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchOpen) {
        setIsSearchOpen(false);
      }
      // Close profile dropdown when clicking outside
      if (isProfileOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, isProfileOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        // Only show main categories (no parentId) and sort by displayOrder
        const mainCategories = data.data
          .filter((cat: Category & {parentId?: string}) => !cat.parentId)
          .sort((a: Category & {displayOrder: number}, b: Category & {displayOrder: number}) => 
            a.displayOrder - b.displayOrder
          );
        setCategories(mainCategories);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setIsProfileOpen(false);
  };

  const ProfileDropdown = () => (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center space-x-1 p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
      >
        <User className="h-6 w-6" />
        <span className="hidden lg:inline">{session?.user?.name || session?.user?.email}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
            <p className="text-sm text-gray-500 truncate">{session?.user?.email}</p>
          </div>
          
          <Link 
            href="/profile" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsProfileOpen(false)}
          >
            <Settings className="h-4 w-4 mr-3" />
            Profil Ayarları
          </Link>
          
          <Link 
            href="/profile/orders" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsProfileOpen(false)}
          >
            <Package className="h-4 w-4 mr-3" />
            Siparişlerim
          </Link>
          
          <Link 
            href="/profile/invoices" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsProfileOpen(false)}
          >
            <FileText className="h-4 w-4 mr-3" />
            Fatura Bilgileri
          </Link>
          
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">3D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Muse3DStudio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Anasayfa
            </Link>
            
            {/* Categories - Direct Links */}
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}

            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              İletişim
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Compact */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                {!isSearchOpen ? (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="absolute right-0 top-0 z-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Ürün ara..."
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-lg"
                        autoFocus
                        onBlur={(e) => {
                          // Delay closing to allow for clicks on search results
                          setTimeout(() => setIsSearchOpen(false), 150);
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            
            {/* Login/Profile Section */}
            <div className="hidden md:block">
              {status === 'loading' ? (
                <div className="flex items-center space-x-1 p-2">
                  <User className="h-6 w-6 text-gray-400" />
                  <span className="text-gray-400">...</span>
                </div>
              ) : session ? (
                <ProfileDropdown />
              ) : (
                <Link href="/auth/login" className="flex items-center space-x-1 p-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <User className="h-6 w-6" />
                  <span>Giriş</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Anasayfa
              </Link>
              
              {/* Mobile Categories - Direct Links */}
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}

              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Hakkımızda
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                İletişim
              </Link>
              
              {/* Mobile Auth Section */}
              {session ? (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">{session.user?.name}</p>
                  </div>
                  <Link href="/profile" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Profil Ayarları
                  </Link>
                  <Link href="/profile/orders" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Siparişlerim
                  </Link>
                  <Link href="/profile/invoices" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Fatura Bilgileri
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-red-600 hover:text-red-700 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Giriş
                </Link>
              )}
            </nav>
            
            {/* Mobile Search */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 