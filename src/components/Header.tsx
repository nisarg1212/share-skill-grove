
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, User, MessageSquare, BookOpen } from 'lucide-react';
import { AuthModal } from './AuthModal';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-2 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SkillGrove
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Browse Skills</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Community</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
              <Button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Get Started
              </Button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <nav className="flex flex-col space-y-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">Browse Skills</a>
                <a href="#" className="text-gray-600 hover:text-blue-600">How it Works</a>
                <a href="#" className="text-gray-600 hover:text-blue-600">Community</a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="ghost" onClick={() => setShowAuthModal(true)}>Sign In</Button>
                  <Button onClick={() => setShowAuthModal(true)}>Get Started</Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
