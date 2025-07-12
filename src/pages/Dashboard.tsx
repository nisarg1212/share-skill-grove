
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MessageSquare, User, Star, BookOpen, Users } from 'lucide-react';

const Dashboard = () => {
  const suggestedMatches = [
    {
      id: 1,
      name: "Sarah Chen",
      skills_offered: ["Web Design", "UX/UI"],
      skills_wanted: ["Photography"],
      rating: 4.9,
      matches: 2
    },
    {
      id: 2,
      name: "Mike Johnson",
      skills_offered: ["Guitar", "Music Theory"],
      skills_wanted: ["Cooking"],
      rating: 4.8,
      matches: 1
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      skills_offered: ["Spanish", "Translation"],
      skills_wanted: ["Yoga"],
      rating: 5.0,
      matches: 3
    }
  ];

  const recentMessages = [
    {
      id: 1,
      from: "Alex Thompson",
      message: "Hey! I'd love to learn photography from you.",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      from: "Lisa Wang",
      message: "Thanks for the coding lesson! Same time next week?",
      time: "1 day ago",
      unread: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Ready to share skills and learn something new today?</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Find Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input placeholder="Search for skills..." className="flex-1" />
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600">Search</Button>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Suggested Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedMatches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{match.name}</h3>
                          <p className="text-sm text-gray-600">
                            Offers: {match.skills_offered.join(", ")}
                          </p>
                          <p className="text-sm text-gray-600">
                            Wants: {match.skills_wanted.join(", ")}
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{match.rating}</span>
                            <span className="text-sm text-gray-500 ml-2">• {match.matches} mutual skills</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">JD</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">John Doe</h3>
                  <p className="text-sm text-gray-600">john@example.com</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Skills I Offer:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Web Development</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Photography</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Skills I Want:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Cooking</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Guitar</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Messages
                  </div>
                  <Button size="sm" variant="ghost">View All</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900">{message.from}</span>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{message.message}</p>
                      {message.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
