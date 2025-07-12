
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Search, MoreVertical, User, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
  otherUser: {
    id: string;
    username: string;
    email: string;
  };
  lastMessage?: {
    content: string;
    created_at: string;
  };
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

const Messages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user1_id,
          user2_id,
          last_message_at,
          created_at
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;

      // Get other user details for each conversation
      const conversationsWithUsers = await Promise.all(
        (data || []).map(async (conv) => {
          const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
          
          const { data: otherUser } = await supabase
            .from('profiles')
            .select('id, username, email')
            .eq('id', otherUserId)
            .single();

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at')
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            otherUser: otherUser || { id: otherUserId, username: 'Unknown User', email: '' },
            lastMessage
          };
        })
      );

      return conversationsWithUsers as Conversation[];
    },
    enabled: !!user,
  });

  // Fetch messages for selected conversation
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedConversation, user?.id],
    queryFn: async () => {
      if (!selectedConversation || !user) return [];

      const selectedConv = conversations?.find(c => c.id === selectedConversation);
      if (!selectedConv) return [];

      const otherUserId = selectedConv.otherUser.id;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedConversation && !!user && !!conversations,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, receiverId }: { content: string; receiverId: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim()
        });

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation);
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      toast.error('Failed to send message');
      console.error('Send message error:', error);
    },
  });

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const selectedConv = conversations?.find(c => c.id === selectedConversation);
    if (!selectedConv) return;

    sendMessageMutation.mutate({
      content: newMessage,
      receiverId: selectedConv.otherUser.id
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const selectedConversationData = conversations?.find(c => c.id === selectedConversation);

  const filteredConversations = conversations?.filter(conv =>
    conv.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Connect and coordinate with your skill swap partners</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search messages..." 
                    className="pl-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  {conversationsLoading ? (
                    <div className="p-4 text-center">Loading conversations...</div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">No conversations yet</p>
                      <p className="text-xs text-gray-400 mt-1">Start connecting with people to begin messaging!</p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                          selectedConversation === conversation.id 
                            ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                              {conversation.otherUser.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">
                                {conversation.otherUser.username}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {conversation.lastMessage ? formatTime(conversation.lastMessage.created_at) : formatTime(conversation.last_message_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedConversationData ? (
              <Card className="h-full flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                          {selectedConversationData.otherUser.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {selectedConversationData.otherUser.username}
                        </h2>
                        <p className="text-sm text-green-600">Online</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[calc(100vh-380px)] p-4">
                    {messagesLoading ? (
                      <div className="text-center">Loading messages...</div>
                    ) : !messages || messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isOwn = message.sender_id === user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                                isOwn
                                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              } rounded-lg px-4 py-3`}>
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-2 ${
                                  isOwn ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {formatTime(message.created_at)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendMessage}
                      className="bg-gradient-to-r from-blue-600 to-green-600"
                      disabled={sendMessageMutation.isPending || !newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p>Choose a conversation from the left to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
