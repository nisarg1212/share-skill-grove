
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      setShowAuth(true);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SG</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  SkillGrove
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={`text-gray-600 hover:text-blue-600 transition-colors ${
                      isActive('/dashboard') ? 'text-blue-600 font-medium' : ''
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className={`text-gray-600 hover:text-blue-600 transition-colors ${
                      isActive('/profile') ? 'text-blue-600 font-medium' : ''
                    }`}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/messages"
                    className={`text-gray-600 hover:text-blue-600 transition-colors ${
                      isActive('/messages') ? 'text-blue-600 font-medium' : ''
                    }`}
                  >
                    Messages
                  </Link>
                </>
              )}
              <Button
                onClick={handleAuthAction}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {user ? (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Sign Out
                  </>
                ) : (
                  'Get Started'
                )}
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`text-gray-600 hover:text-blue-600 transition-colors ${
                        isActive('/dashboard') ? 'text-blue-600 font-medium' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className={`text-gray-600 hover:text-blue-600 transition-colors ${
                        isActive('/profile') ? 'text-blue-600 font-medium' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/messages"
                      className={`text-gray-600 hover:text-blue-600 transition-colors ${
                        isActive('/messages') ? 'text-blue-600 font-medium' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Messages
                    </Link>
                  </>
                )}
                <Button
                  onClick={() => {
                    handleAuthAction();
                    setIsMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 w-full"
                >
                  {user ? (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      Sign Out
                    </>
                  ) : (
                    'Get Started'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Header;
