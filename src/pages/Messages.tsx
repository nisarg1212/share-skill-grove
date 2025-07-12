import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Search, MoreVertical, User, MessageSquare } from 'lucide-react';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: "Sarah Chen",
      lastMessage: "Great! Looking forward to our photography session.",
      timestamp: "2 hours ago",
      unread: true,
      avatar: "SC"
    },
    {
      id: 2,
      name: "Mike Johnson",
      lastMessage: "Thanks for the guitar lesson tips!",
      timestamp: "1 day ago",
      unread: false,
      avatar: "MJ"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      lastMessage: "When would be a good time for Spanish practice?",
      timestamp: "2 days ago",
      unread: true,
      avatar: "ER"
    },
    {
      id: 4,
      name: "Alex Thompson",
      lastMessage: "The cooking class was amazing! Thank you.",
      timestamp: "3 days ago",
      unread: false,
      avatar: "AT"
    }
  ];

  const messages = [
    {
      id: 1,
      senderId: 2,
      senderName: "Sarah Chen",
      content: "Hi John! I saw your profile and I'm really interested in learning web development from you.",
      timestamp: "Yesterday, 2:30 PM",
      isOwn: false
    },
    {
      id: 2,
      senderId: 1,
      senderName: "You",
      content: "Hi Sarah! I'd be happy to help you with web development. I noticed you offer photography lessons - I've been wanting to improve my photography skills!",
      timestamp: "Yesterday, 3:15 PM",
      isOwn: true
    },
    {
      id: 3,
      senderId: 2,
      senderName: "Sarah Chen",
      content: "Perfect! That sounds like a great skill swap. I'm available on weekends. What works best for you?",
      timestamp: "Yesterday, 4:20 PM",
      isOwn: false
    },
    {
      id: 4,
      senderId: 1,
      senderName: "You",
      content: "Weekends work great for me too! How about we start with a photography session this Saturday, and then we can do a web dev session next weekend?",
      timestamp: "Today, 9:30 AM",
      isOwn: true
    },
    {
      id: 5,
      senderId: 2,
      senderName: "Sarah Chen",
      content: "Great! Looking forward to our photography session.",
      timestamp: "Today, 10:15 AM",
      isOwn: false
    }
  ];

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Simulate sending message
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

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
                  <Input placeholder="Search messages..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  {conversations.map((conversation) => (
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
                            {conversation.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {conversation.name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {conversation.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
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
                          {selectedConversationData.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {selectedConversationData.name}
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
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                            message.isOwn
                              ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          } rounded-lg px-4 py-3`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              message.isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
