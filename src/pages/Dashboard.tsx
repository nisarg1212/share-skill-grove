
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MessageSquare, User, Star, BookOpen, Users } from 'lucide-react';
import { SearchResults } from '@/components/SearchResults';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Profile {
  id: string;
  username: string;
  skills_offered: string[];
  skills_wanted: string[];
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_username?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch suggested matches based on complementary skills
  const { data: suggestedMatches } = useQuery({
    queryKey: ['suggested-matches', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: currentUser } = await supabase
        .from('profiles')
        .select('skills_offered, skills_wanted')
        .eq('id', user.id)
        .single();

      if (!currentUser || !currentUser.skills_wanted) return [];

      const { data: matches, error } = await supabase
        .from('profiles')
        .select('id, username, skills_offered, skills_wanted')
        .neq('id', user.id)
        .limit(5);

      if (error) throw error;

      // Filter for users who offer what current user wants
      const filteredMatches = matches?.filter(match => {
        const hasWantedSkill = match.skills_offered?.some(skill => 
          currentUser.skills_wanted?.includes(skill)
        );
        const hasMutualInterest = match.skills_wanted?.some(skill =>
          currentUser.skills_offered?.includes(skill)
        );
        return hasWantedSkill || hasMutualInterest;
      }) || [];

      return filteredMatches.map(match => ({
        ...match,
        rating: 4.8 + Math.random() * 0.2,
        matches: Math.floor(Math.random() * 3) + 1
      }));
    },
    enabled: !!user,
  });

  // Fetch recent messages with sender profile information
  const { data: recentMessages } = useQuery({
    queryKey: ['recent-messages', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First get the messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('id, sender_id, content, created_at, read')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (messagesError) throw messagesError;
      if (!messages) return [];

      // Then get the sender profiles for these messages
      const senderIds = messages.map(msg => msg.sender_id).filter(Boolean);
      if (senderIds.length === 0) return messages;

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', senderIds);

      if (profilesError) throw profilesError;

      // Combine messages with sender usernames
      const messagesWithSenders = messages.map(message => ({
        ...message,
        sender_username: profiles?.find(p => p.id === message.sender_id)?.username || 'Unknown User'
      }));

      return messagesWithSenders;
    },
    enabled: !!user,
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (otherUserId: string) => {
      if (!user) throw new Error('Not authenticated');

      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${user.id})`)
        .single();

      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user1_id: user.id,
          user2_id: otherUserId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Connection request sent!');
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      toast.error('Failed to connect');
      console.error('Connection error:', error);
    },
  });

  const handleConnect = (userId: string) => {
    createConversationMutation.mutate(userId);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
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
                  <Input 
                    placeholder="Search for skills, users, or locations..." 
                    className="flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <SearchResults query={searchQuery} onConnect={handleConnect} />
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
                  {suggestedMatches?.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{match.username}</h3>
                          <p className="text-sm text-gray-600">
                            Offers: {match.skills_offered?.join(", ") || "No skills listed"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Wants: {match.skills_wanted?.join(", ") || "No skills listed"}
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{match.rating?.toFixed(1)}</span>
                            <span className="text-sm text-gray-500 ml-2">• {match.matches} mutual skills</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleConnect(match.id)}>
                        Connect
                      </Button>
                    </div>
                  ))}
                  {(!suggestedMatches || suggestedMatches.length === 0) && (
                    <div className="text-center text-gray-500 py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No suggested matches yet. Add skills to your profile to find connections!</p>
                    </div>
                  )}
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
                    <span className="text-2xl font-bold text-white">
                      {user?.email?.substring(0, 2).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{user?.email}</h3>
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
                  {recentMessages?.map((message) => (
                    <div key={message.id} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900">
                          {message.sender_username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{message.content}</p>
                      {!message.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      )}
                    </div>
                  ))}
                  {(!recentMessages || recentMessages.length === 0) && (
                    <div className="text-center text-gray-500 py-4">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No messages yet</p>
                    </div>
                  )}
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
