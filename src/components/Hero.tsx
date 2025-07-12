
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, BookOpen, MessageSquare, Zap } from 'lucide-react';
import { AuthModal } from './AuthModal';

export const Hero = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
              Share Skills,
              <br />
              Grow Together
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              Connect with people in your community to exchange skills and knowledge. 
              Teach what you know, learn what you need.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="What skill do you want to learn?"
                  className="pl-10 py-3 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8"
                onClick={() => setShowAuthModal(true)}
              >
                Start Learning
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-gray-600">Find skilled people in your community ready to share knowledge</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Learn</h3>
                <p className="text-gray-600">Exchange skills and grow your knowledge in areas that matter to you</p>
              </div>
              
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Grow</h3>
                <p className="text-gray-600">Build meaningful connections while developing new abilities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
