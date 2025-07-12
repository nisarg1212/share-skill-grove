
import React from 'react';
import { UserPlus, Search, MessageSquare, BookOpen } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Sign up and tell us what skills you can teach and what you'd like to learn."
    },
    {
      icon: Search,
      title: "Find Perfect Matches",
      description: "Browse our community or let our smart matching system find ideal skill swap partners."
    },
    {
      icon: MessageSquare,
      title: "Connect & Coordinate",
      description: "Message potential partners to discuss your skill exchange and schedule sessions."
    },
    {
      icon: BookOpen,
      title: "Start Learning",
      description: "Begin your skill swap journey and grow together with your community."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started with skill sharing is simple - just follow these four easy steps
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center mb-12 last:mb-0">
              <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                <div className="bg-gradient-to-br from-blue-600 to-green-600 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <div className="bg-gradient-to-br from-blue-100 to-green-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                      <step.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 mt-32">
                  <div className="w-1 h-16 bg-gradient-to-b from-blue-300 to-green-300 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
