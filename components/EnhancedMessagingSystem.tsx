'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Paperclip, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Star,
  Clock,
  CheckCircle,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Download,
  Archive,
  Trash2,
  Pin,
  Flag
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'client' | 'builder' | 'admin';
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'quote' | 'system';
  attachments?: Attachment[];
  quoteData?: QuoteData;
  edited?: boolean;
  editedAt?: string;
  reactions?: Reaction[];
  replyTo?: string;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface QuoteData {
  id: string;
  projectName: string;
  amount: number;
  currency: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

interface Reaction {
  emoji: string;
  users: string[];
}

interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'support';
  name: string;
  participants: Participant[];
  lastMessage: Message;
  unreadCount: number;
  pinned: boolean;
  archived: boolean;
  quoteRequestId?: string;
  projectId?: string;
}

interface Participant {
  id: string;
  name: string;
  type: 'client' | 'builder' | 'admin';
  avatar?: string;
  online: boolean;
  lastSeen?: string;
}

interface EnhancedMessagingSystemProps {
  userId: string;
  userType: 'client' | 'builder' | 'admin';
  userName: string;
  initialConversationId?: string;
}

export default function EnhancedMessagingSystem({ 
  userId, 
  userType, 
  userName,
  initialConversationId 
}: EnhancedMessagingSystemProps) {
  console.log('EnhancedMessagingSystem: Component loaded for user:', userName);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data loading
  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockConversations: Conversation[] = [
        {
          id: 'conv-1',
          type: 'direct',
          name: 'Klaus Mueller (Expo Design Germany)',
          participants: [
            { id: 'builder-1', name: 'Klaus Mueller', type: 'builder', online: true },
            { id: userId, name: userName, type: userType, online: true }
          ],
          lastMessage: {
            id: 'msg-1',
            senderId: 'builder-1',
            senderName: 'Klaus Mueller',
            senderType: 'builder',
            content: 'I\'ve prepared a detailed quote for your CES 2025 booth. The design includes LED integration and interactive displays.',
            timestamp: '2024-12-19T14:30:00Z',
            type: 'text'
          },
          unreadCount: 2,
          pinned: true,
          archived: false,
          quoteRequestId: 'quote-123'
        },
        {
          id: 'conv-2',
          type: 'direct',
          name: 'Sarah Johnson (Premium Exhibits)',
          participants: [
            { id: 'builder-2', name: 'Sarah Johnson', type: 'builder', online: false, lastSeen: '2024-12-19T12:00:00Z' },
            { id: userId, name: userName, type: userType, online: true }
          ],
          lastMessage: {
            id: 'msg-2',
            senderId: userId,
            senderName: userName,
            senderType: userType,
            content: 'Thank you for the quote. Could you also include shipping costs to Las Vegas?',
            timestamp: '2024-12-19T11:45:00Z',
            type: 'text'
          },
          unreadCount: 0,
          pinned: false,
          archived: false
        },
        {
          id: 'conv-3',
          type: 'support',
          name: 'ExhibitBay Support',
          participants: [
            { id: 'admin-1', name: 'Support Team', type: 'admin', online: true },
            { id: userId, name: userName, type: userType, online: true }
          ],
          lastMessage: {
            id: 'msg-3',
            senderId: 'admin-1',
            senderName: 'Support Team',
            senderType: 'admin',
            content: 'Your verification documents have been approved. Your builder profile is now live!',
            timestamp: '2024-12-18T16:20:00Z',
            type: 'system'
          },
          unreadCount: 1,
          pinned: false,
          archived: false
        }
      ];
      
      setConversations(mockConversations);
      
      // Select initial conversation
      if (initialConversationId) {
        const initialConv = mockConversations.find(c => c.id === initialConversationId);
        if (initialConv) {
          setSelectedConversation(initialConv);
          loadMessages(initialConv.id);
        }
      }
      
      setIsLoading(false);
    };

    loadConversations();
  }, [userId, initialConversationId]);

  const loadMessages = async (conversationId: string) => {
    console.log('Loading messages for conversation:', conversationId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        senderId: 'builder-1',
        senderName: 'Klaus Mueller',
        senderType: 'builder',
        content: 'Hello! Thank you for your interest in our exhibition stand services. I\'ve reviewed your requirements for CES 2025.',
        timestamp: '2024-12-19T10:00:00Z',
        type: 'text'
      },
      {
        id: 'msg-2',
        senderId: userId,
        senderName: userName,
        senderType: userType,
        content: 'Hi Klaus! Yes, we\'re looking for a 400 sqm custom booth with interactive technology integration. Our budget is around $45,000.',
        timestamp: '2024-12-19T10:15:00Z',
        type: 'text'
      },
      {
        id: 'msg-3',
        senderId: 'builder-1',
        senderName: 'Klaus Mueller',
        senderType: 'builder',
        content: 'Perfect! That budget range works well for what you\'re looking for. I\'ll prepare a detailed proposal with 3D renderings.',
        timestamp: '2024-12-19T10:30:00Z',
        type: 'text'
      },
      {
        id: 'msg-4',
        senderId: 'builder-1',
        senderName: 'Klaus Mueller',
        senderType: 'builder',
        content: 'Here\'s our proposal for your CES 2025 booth:',
        timestamp: '2024-12-19T14:30:00Z',
        type: 'quote',
        quoteData: {
          id: 'quote-123',
          projectName: 'CES 2025 Interactive Tech Booth',
          amount: 42500,
          currency: 'USD',
          validUntil: '2024-12-25T23:59:59Z',
          status: 'pending'
        }
      },
      {
        id: 'msg-5',
        senderId: 'builder-1',
        senderName: 'Klaus Mueller',
        senderType: 'builder',
        content: 'I\'ve also attached some reference images from similar projects we\'ve completed.',
        timestamp: '2024-12-19T14:35:00Z',
        type: 'file',
        attachments: [
          {
            id: 'att-1',
            name: 'CES_2024_Reference_1.jpg',
            type: 'image/jpeg',
            size: 2048576,
            url: '/images/attachments/ces-ref-1.jpg'
          },
          {
            id: 'att-2',
            name: 'CES_2024_Reference_2.jpg',
            type: 'image/jpeg',
            size: 1835792,
            url: '/images/attachments/ces-ref-2.jpg'
          }
        ]
      }
    ];
    
    setMessages(mockMessages);
    
    // Mark messages as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;
    
    setIsSending(true);
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      senderName: userName,
      senderType: userType,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    // Add message immediately for better UX
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Update conversation
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: message }
        : conv
    ));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Message sent:', message);
      
      // Simulate typing indicator and response (for demo)
      if (userType === 'client') {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const response: Message = {
              id: `msg-${Date.now() + 1}`,
              senderId: 'builder-1',
              senderName: 'Klaus Mueller',
              senderType: 'builder',
              content: 'Thank you for your message! I\'ll get back to you with more details shortly.',
              timestamp: new Date().toISOString(),
              type: 'text'
            };
            setMessages(prev => [...prev, response]);
            setIsTyping(false);
          }, 2000);
        }, 1000);
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    console.log('Uploading file:', file.name);
    
    // Create file message
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      senderName: userName,
      senderType: userType,
      content: `Shared ${file.type.startsWith('image/') ? 'an image' : 'a file'}: ${file.name}`,
      timestamp: new Date().toISOString(),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      attachments: [{
        id: `att-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }]
    };
    
    setMessages(prev => [...prev, message]);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleQuoteAction = (messageId: string, action: 'accept' | 'decline') => {
    console.log(`${action} quote in message:`, messageId);
    
    setMessages(prev => prev.map(msg => 
      msg.id === messageId && msg.quoteData
        ? {
            ...msg,
            quoteData: {
              ...msg.quoteData,
              status: action === 'accept' ? 'accepted' : 'declined'
            }
          }
        : msg
    ));
    
    // Send system message
    const systemMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'system',
      senderName: 'System',
      senderType: 'admin',
      content: `Quote ${action === 'accept' ? 'accepted' : 'declined'} by ${userName}`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'quotes' && conv.quoteRequestId) ||
                      (activeTab === 'support' && conv.type === 'support') ||
                      (activeTab === 'archived' && conv.archived);
    
    return matchesSearch && matchesTab && !conv.archived;
  });

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
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
    <div className="flex h-[600px] border rounded-lg overflow-hidden bg-white">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 text-xs">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="archived">Archive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => {
                setSelectedConversation(conversation);
                loadMessages(conversation.id);
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.participants.some(p => p.id !== userId && p.online) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                      {conversation.pinned && <Pin className="w-3 h-3 text-gray-400" />}
                      {conversation.type === 'support' && <Badge className="text-xs">Support</Badge>}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage.type === 'quote' ? '💰 Quote sent' : 
                     conversation.lastMessage.type === 'file' ? '📎 File attachment' :
                     conversation.lastMessage.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {filteredConversations.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedConversation.name}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {selectedConversation.participants.find(p => p.id !== userId)?.online ? (
                      <span className="text-green-600">● Online</span>
                    ) : (
                      <span>Last seen {formatTime(selectedConversation.participants.find(p => p.id !== userId)?.lastSeen || '')}</span>
                    )}
                    {selectedConversation.quoteRequestId && (
                      <Badge variant="outline" className="text-xs">Quote Request</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowInfo(!showInfo)}>
                  <Info className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md ${message.senderId === userId ? 'order-2' : 'order-1'}`}>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.senderId === userId 
                        ? 'bg-blue-500 text-white' 
                        : message.type === 'system'
                        ? 'bg-gray-100 text-gray-700 text-center text-sm'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.type === 'text' && (
                        <p className="text-sm">{message.content}</p>
                      )}
                      
                      {message.type === 'quote' && message.quoteData && (
                        <div className="bg-white text-gray-900 p-3 rounded border">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-sm">Quote</span>
                            <Badge className={`text-xs ${
                              message.quoteData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              message.quoteData.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              message.quoteData.status === 'declined' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {message.quoteData.status}
                            </Badge>
                          </div>
                          <h4 className="font-medium">{message.quoteData.projectName}</h4>
                          <div className="text-2xl font-bold text-green-600 my-2">
                            {message.quoteData.currency} {message.quoteData.amount.toLocaleString()}
                          </div>
                          <p className="text-xs text-gray-500 mb-3">
                            Valid until: {new Date(message.quoteData.validUntil).toLocaleDateString()}
                          </p>
                          
                          {message.senderId !== userId && message.quoteData.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleQuoteAction(message.id, 'accept')}
                              >
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleQuoteAction(message.id, 'decline')}
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {(message.type === 'file' || message.type === 'image') && message.attachments && (
                        <div className="space-y-2">
                          {message.content && <p className="text-sm mb-2">{message.content}</p>}
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id} className="bg-white text-gray-900 p-2 rounded border">
                              <div className="flex items-center space-x-2">
                                {attachment.type.startsWith('image/') ? (
                                  <ImageIcon className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <FileText className="w-4 h-4 text-blue-600" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                                </div>
                                <Button size="sm" variant="ghost">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                              {attachment.type.startsWith('image/') && (
                                <img 
                                  src={attachment.url} 
                                  alt={attachment.name}
                                  className="mt-2 max-w-full h-auto rounded"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className={`text-xs text-gray-500 mt-1 ${message.senderId === userId ? 'text-right' : 'text-left'}`}>
                      {message.senderId !== userId && message.senderName} • {formatTime(message.timestamp)}
                      {message.edited && ' (edited)'}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <div className="flex-1">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={1}
                    className="resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </>
        )}
      </div>

      {/* Info Sidebar */}
      {showInfo && selectedConversation && (
        <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Conversation Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2 capitalize">{selectedConversation.type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Participants:</span>
                  <span className="ml-2">{selectedConversation.participants.length}</span>
                </div>
                {selectedConversation.quoteRequestId && (
                  <div>
                    <span className="text-gray-500">Quote ID:</span>
                    <span className="ml-2 font-mono text-xs">{selectedConversation.quoteRequestId}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Participants</h3>
              <div className="space-y-2">
                {selectedConversation.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{participant.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{participant.type}</p>
                    </div>
                    {participant.online && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Conversation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Flag className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Conversation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}