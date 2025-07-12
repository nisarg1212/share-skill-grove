
import React from 'react';
import { Search, Users, MessageSquare, Shield, Star, Globe } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Search,
      title: "Smart Skill Matching",
      description: "Our algorithm connects you with people whose skills complement yours perfectly."
    },
    {
      icon: Users,
      title: "Community Profiles",
      description: "Detailed profiles showing skills offered, skills wanted, and community ratings."
    },
    {
      icon: MessageSquare,
      title: "Built-in Messaging",
      description: "Coordinate skill swaps with integrated messaging and scheduling tools."
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Verified profiles and secure authentication keep your exchanges safe."
    },
    {
      icon: Star,
      title: "Rating System",
      description: "Build trust through our community rating and review system."
    },
    {
      icon: Globe,
      title: "Local & Remote",
      description: "Connect locally or remotely - learn skills from anywhere in the world."
    }
  ];

  return (
    <section className="py-20 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            SkillGrove provides all the tools you need to connect, learn, and grow with your community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="bg-gradient-to-br from-blue-100 to-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
