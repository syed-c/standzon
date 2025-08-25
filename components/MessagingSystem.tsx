'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Search, 
  Phone,
  Video,
  Info,
  Image,
  File,
  Smile,
  CheckCheck,
  Clock,
  MessageSquare
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'client' | 'builder' | 'admin';
  content: string;
  timestamp: string;
  read: boolean;
  messageType: 'text' | 'file' | 'quote' | 'system';
  attachments?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
  }[];
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    type: 'client' | 'builder' | 'admin';
    avatar?: string;
    lastSeen?: string;
    online: boolean;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  tradeShowContext?: string;
  updatedAt: string;
}

interface MessagingSystemProps {
  userId: string;
  userType: 'client' | 'builder';
}

export default function MessagingSystem({ userId, userType }: MessagingSystemProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - In production, this would come from real-time socket connections
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockConversations: Conversation[] = [
        {
          id: 'conv-1',
          participants: [
            {
              id: 'user-1',
              name: userType === 'client' ? 'Expo Design Germany' : 'TechCorp Industries',
              type: userType === 'client' ? 'builder' : 'client',
              avatar: '/images/avatars/user1.jpg',
              lastSeen: '2024-12-19T10:30:00',
              online: true
            }
          ],
          lastMessage: {
            id: 'msg-1',
            senderId: 'user-1',
            senderName: userType === 'client' ? 'Expo Design Germany' : 'TechCorp Industries',
            senderType: userType === 'client' ? 'builder' : 'client',
            content: 'Thanks for your interest in our services. We\'d love to discuss your CES 2025 exhibition stand requirements.',
            timestamp: '2024-12-19T10:30:00',
            read: false,
            messageType: 'text'
          },
          unreadCount: 2,
          tradeShowContext: 'CES 2025',
          updatedAt: '2024-12-19T10:30:00'
        },
        {
          id: 'conv-2',
          participants: [
            {
              id: 'user-2',
              name: userType === 'client' ? 'Premier Exhibits USA' : 'Global Manufacturing Ltd',
              type: userType === 'client' ? 'builder' : 'client',
              avatar: '/images/avatars/user2.jpg',
              lastSeen: '2024-12-19T09:15:00',
              online: false
            }
          ],
          lastMessage: {
            id: 'msg-2',
            senderId: userId,
            senderName: 'You',
            senderType: userType,
            content: 'What\'s your timeline for the Hannover Messe project?',
            timestamp: '2024-12-19T09:15:00',
            read: true,
            messageType: 'text'
          },
          unreadCount: 0,
          tradeShowContext: 'Hannover Messe 2025',
          updatedAt: '2024-12-19T09:15:00'
        },
        {
          id: 'conv-3',
          participants: [
            {
              id: 'user-3',
              name: userType === 'client' ? 'Custom Displays UK' : 'Innovation Dynamics',
              type: userType === 'client' ? 'builder' : 'client',
              avatar: '/images/avatars/user3.jpg',
              lastSeen: '2024-12-18T16:45:00',
              online: false
            }
          ],
          lastMessage: {
            id: 'msg-3',
            senderId: 'user-3',
            senderName: userType === 'client' ? 'Custom Displays UK' : 'Innovation Dynamics',
            senderType: userType === 'client' ? 'builder' : 'client',
            content: 'Quote sent! Please review the attached proposal.',
            timestamp: '2024-12-18T16:45:00',
            read: true,
            messageType: 'text'
          },
          unreadCount: 0,
          tradeShowContext: 'Mobile World Congress 2025',
          updatedAt: '2024-12-18T16:45:00'
        }
      ];
      
      setConversations(mockConversations);
      setLoading(false);
    };

    loadConversations();
  }, [userId, userType]);

  useEffect(() => {
    const loadMessages = async (conversationId: string) => {
      if (!conversationId) return;
      
      // Mock messages for the active conversation
      const mockMessages: Message[] = [
        {
          id: 'msg-conv-1-1',
          senderId: 'user-1',
          senderName: userType === 'client' ? 'Klaus Mueller' : 'Sarah Johnson',
          senderType: userType === 'client' ? 'builder' : 'client',
          content: 'Hello! I saw your quote request for CES 2025. We have extensive experience with technology exhibitions in Las Vegas.',
          timestamp: '2024-12-19T09:00:00',
          read: true,
          messageType: 'text'
        },
        {
          id: 'msg-conv-1-2',
          senderId: userId,
          senderName: 'You',
          senderType: userType,
          content: 'That\'s great! Can you tell me more about your previous CES projects?',
          timestamp: '2024-12-19T09:15:00',
          read: true,
          messageType: 'text'
        },
        {
          id: 'msg-conv-1-3',
          senderId: 'user-1',
          senderName: userType === 'client' ? 'Klaus Mueller' : 'Sarah Johnson',
          senderType: userType === 'client' ? 'builder' : 'client',
          content: 'Absolutely! We\'ve built stands for major tech companies including BMW, Siemens, and Google. I\'ll send you our CES portfolio.',
          timestamp: '2024-12-19T09:20:00',
          read: true,
          messageType: 'text'
        },
        {
          id: 'msg-conv-1-4',
          senderId: 'user-1',
          senderName: userType === 'client' ? 'Klaus Mueller' : 'Sarah Johnson',
          senderType: userType === 'client' ? 'builder' : 'client',
          content: 'Thanks for your interest in our services. We\'d love to discuss your CES 2025 exhibition stand requirements.',
          timestamp: '2024-12-19T10:30:00',
          read: false,
          messageType: 'text'
        }
      ];
      
      setMessages(mockMessages);
    };

    if (activeConversation) {
      loadMessages(activeConversation);
    }
  }, [activeConversation, userId, userType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || sending) return;
    
    setSending(true);
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      senderName: 'You',
      senderType: userType,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
      messageType: 'text'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate message sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setSending(false);
    
    console.log('Message sent:', message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getActiveConversationData = () => {
    return conversations.find(conv => conv.id === activeConversation);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || conv.tradeShowContext?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(600px-73px)]">
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => {
              const participant = conversation.participants[0];
              const isActive = activeConversation === conversation.id;
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive ? 'bg-blue-100 border-blue-200 border' : 'hover:bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {participant.online && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {participant.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(conversation.updatedAt)}
                        </p>
                      </div>
                      {conversation.tradeShowContext && (
                        <p className="text-xs text-blue-600 mb-1">
                          {conversation.tradeShowContext}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage?.content}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-1">
                          {conversation.lastMessage?.senderId === userId && (
                            <CheckCheck className="h-3 w-3 text-blue-500" />
                          )}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 min-w-5 text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={getActiveConversationData()?.participants[0].avatar} />
                  <AvatarFallback>
                    {getActiveConversationData()?.participants[0].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {getActiveConversationData()?.participants[0].name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getActiveConversationData()?.participants[0].online ? 'Online' : 
                     `Last seen ${formatTime(getActiveConversationData()?.participants[0].lastSeen || '')}`}
                  </p>
                </div>
                {getActiveConversationData()?.tradeShowContext && (
                  <Badge variant="outline" className="ml-2">
                    {getActiveConversationData()?.tradeShowContext}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isOwnMessage = message.senderId === userId;
                  const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex space-x-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {showAvatar && !isOwnMessage && (
                          <Avatar className="h-6 w-6 mt-1">
                            <AvatarFallback className="text-xs">
                              {message.senderName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`rounded-lg px-3 py-2 ${
                          isOwnMessage 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-between mt-1 ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">
                              {formatTime(message.timestamp)}
                            </span>
                            {isOwnMessage && (
                              <CheckCheck className="h-3 w-3 ml-2" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                  />
                </div>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}