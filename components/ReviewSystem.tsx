'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  Filter,
  Calendar,
  MessageSquare,
  Award,
  TrendingUp
} from 'lucide-react';

interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerType: 'client' | 'builder';
  targetId: string;
  targetType: 'builder' | 'client';
  tradeShow: string;
  tradeShowYear: number;
  projectId?: string;
  rating: {
    overall: number;
    quality: number;
    communication: number;
    timeline: number;
    value: number;
    professionalism: number;
  };
  comment: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
  anonymous: boolean;
  createdAt: string;
  helpful: number;
  reported: boolean;
  verified: boolean;
  photos?: string[];
  response?: {
    id: string;
    responderId: string;
    content: string;
    createdAt: string;
  };
}

interface ReviewSystemProps {
  targetId: string;
  targetType: 'builder' | 'client';
  userType: 'client' | 'builder';
  userId: string;
  canWrite?: boolean;
}

export default function ReviewSystem({ 
  targetId, 
  targetType, 
  userType, 
  userId,
  canWrite = false 
}: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful' | 'rating'>('newest');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    overall: 5,
    quality: 5,
    communication: 5,
    timeline: 5,
    value: 5,
    professionalism: 5,
    comment: '',
    pros: [''],
    cons: [''],
    wouldRecommend: true,
    anonymous: false,
    tradeShow: '',
    tradeShowYear: new Date().getFullYear()
  });

  // Mock data loading
  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReviews: Review[] = [
        {
          id: 'review-1',
          reviewerId: 'client-1',
          reviewerName: 'Sarah Johnson',
          reviewerType: 'client',
          targetId: targetId,
          targetType: targetType,
          tradeShow: 'CES 2024',
          tradeShowYear: 2024,
          projectId: 'project-1',
          rating: {
            overall: 5,
            quality: 5,
            communication: 5,
            timeline: 4,
            value: 5,
            professionalism: 5
          },
          comment: 'Exceptional work on our CES booth! The team was professional, creative, and delivered exactly what we envisioned. The stand attracted many visitors and helped us achieve our exhibition goals.',
          pros: [
            'Outstanding design creativity',
            'Professional project management',
            'On-time delivery',
            'Excellent customer service'
          ],
          cons: [
            'Minor delays in initial concept approval'
          ],
          wouldRecommend: true,
          anonymous: false,
          createdAt: '2024-02-15T10:30:00Z',
          helpful: 12,
          reported: false,
          verified: true,
          photos: ['/images/reviews/ces-2024-1.jpg', '/images/reviews/ces-2024-2.jpg']
        },
        {
          id: 'review-2',
          reviewerId: 'client-2',
          reviewerName: 'Michael Chen',
          reviewerType: 'client',
          targetId: targetId,
          targetType: targetType,
          tradeShow: 'Hannover Messe 2024',
          tradeShowYear: 2024,
          rating: {
            overall: 4,
            quality: 4,
            communication: 5,
            timeline: 4,
            value: 4,
            professionalism: 4
          },
          comment: 'Good overall experience. The team was responsive and delivered a quality stand. There were some minor issues with the initial design, but they were quickly resolved.',
          pros: [
            'Responsive communication',
            'Quality construction',
            'Professional team'
          ],
          cons: [
            'Initial design needed revisions',
            'Setup took longer than expected'
          ],
          wouldRecommend: true,
          anonymous: false,
          createdAt: '2024-05-20T14:15:00Z',
          helpful: 8,
          reported: false,
          verified: true,
          response: {
            id: 'response-1',
            responderId: targetId,
            content: 'Thank you for your feedback, Michael. We appreciate your patience during the design revision process and are glad we could deliver a successful outcome for your Hannover Messe participation.',
            createdAt: '2024-05-21T09:00:00Z'
          }
        },
        {
          id: 'review-3',
          reviewerId: 'client-3',
          reviewerName: 'Emma Rodriguez',
          reviewerType: 'client',
          targetId: targetId,
          targetType: targetType,
          tradeShow: 'Mobile World Congress 2024',
          tradeShowYear: 2024,
          rating: {
            overall: 5,
            quality: 5,
            communication: 5,
            timeline: 5,
            value: 4,
            professionalism: 5
          },
          comment: 'Outstanding partner for our MWC presence. The innovative design incorporated the latest technology trends and created an immersive experience for visitors.',
          pros: [
            'Innovative technology integration',
            'Stunning visual design',
            'Flawless execution',
            'Great attention to detail'
          ],
          cons: [
            'Premium pricing'
          ],
          wouldRecommend: true,
          anonymous: false,
          createdAt: '2024-03-10T16:45:00Z',
          helpful: 15,
          reported: false,
          verified: true
        }
      ];
      
      setReviews(mockReviews);
      setLoading(false);
    };

    loadReviews();
  }, [targetId, targetType]);

  const calculateAverageRatings = () => {
    if (reviews.length === 0) return null;
    
    const totals = reviews.reduce((acc, review) => ({
      overall: acc.overall + review.rating.overall,
      quality: acc.quality + review.rating.quality,
      communication: acc.communication + review.rating.communication,
      timeline: acc.timeline + review.rating.timeline,
      value: acc.value + review.rating.value,
      professionalism: acc.professionalism + review.rating.professionalism
    }), {
      overall: 0, quality: 0, communication: 0, 
      timeline: 0, value: 0, professionalism: 0
    });
    
    const count = reviews.length;
    return {
      overall: Number((totals.overall / count).toFixed(1)),
      quality: Number((totals.quality / count).toFixed(1)),
      communication: Number((totals.communication / count).toFixed(1)),
      timeline: Number((totals.timeline / count).toFixed(1)),
      value: Number((totals.value / count).toFixed(1)),
      professionalism: Number((totals.professionalism / count).toFixed(1))
    };
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      const rating = Math.round(review.rating.overall);
      distribution[rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const handleRatingChange = (category: string, value: number) => {
    setReviewForm(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmitReview = async () => {
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReview: Review = {
        id: `review-${Date.now()}`,
        reviewerId: userId,
        reviewerName: reviewForm.anonymous ? 'Anonymous' : 'Current User',
        reviewerType: userType,
        targetId: targetId,
        targetType: targetType,
        tradeShow: reviewForm.tradeShow,
        tradeShowYear: reviewForm.tradeShowYear,
        rating: {
          overall: reviewForm.overall,
          quality: reviewForm.quality,
          communication: reviewForm.communication,
          timeline: reviewForm.timeline,
          value: reviewForm.value,
          professionalism: reviewForm.professionalism
        },
        comment: reviewForm.comment,
        pros: reviewForm.pros.filter(pro => pro.trim() !== ''),
        cons: reviewForm.cons.filter(con => con.trim() !== ''),
        wouldRecommend: reviewForm.wouldRecommend,
        anonymous: reviewForm.anonymous,
        createdAt: new Date().toISOString(),
        helpful: 0,
        reported: false,
        verified: false
      };
      
      setReviews(prev => [newReview, ...prev]);
      setShowWriteReview(false);
      
      // Reset form
      setReviewForm({
        overall: 5,
        quality: 5,
        communication: 5,
        timeline: 5,
        value: 5,
        professionalism: 5,
        comment: '',
        pros: [''],
        cons: [''],
        wouldRecommend: true,
        anonymous: false,
        tradeShow: '',
        tradeShowYear: new Date().getFullYear()
      });
      
      console.log('Review submitted:', newReview);
      
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive = false, onChange?: (rating: number) => void) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const averageRatings = calculateAverageRatings();
  const ratingDistribution = getRatingDistribution();
  const filteredReviews = reviews.filter(review => 
    filterRating ? Math.round(review.rating.overall) === filterRating : true
  ).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'helpful':
        return b.helpful - a.helpful;
      case 'rating':
        return b.rating.overall - a.rating.overall;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Overview */}
      {averageRatings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Reviews & Ratings
              {canWrite && (
                <Button onClick={() => setShowWriteReview(true)}>
                  Write Review
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {reviews.length} review{reviews.length !== 1 ? 's' : ''} from verified {targetType === 'builder' ? 'clients' : 'builders'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Overall Rating */}
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">
                      {averageRatings.overall}
                    </div>
                    {renderStars(averageRatings.overall, 'lg')}
                    <p className="text-sm text-gray-500 mt-1">
                      {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm w-8">{rating}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Progress 
                        value={(ratingDistribution[rating] / reviews.length) * 100} 
                        className="flex-1 h-2" 
                      />
                      <span className="text-sm text-gray-500 w-12">
                        {ratingDistribution[rating]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Detailed Ratings */}
              <div>
                <h4 className="font-medium mb-4">Rating Breakdown</h4>
                <div className="space-y-3">
                  {[
                    { key: 'quality', label: 'Quality' },
                    { key: 'communication', label: 'Communication' },
                    { key: 'timeline', label: 'Timeline' },
                    { key: 'value', label: 'Value for Money' },
                    { key: 'professionalism', label: 'Professionalism' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{label}</span>
                      <div className="flex items-center space-x-2">
                        {renderStars(averageRatings[key as keyof typeof averageRatings], 'sm')}
                        <span className="text-sm font-medium w-8">
                          {averageRatings[key as keyof typeof averageRatings]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Write Review Form */}
      {showWriteReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>
              Share your experience to help others make informed decisions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rating Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'overall', label: 'Overall Rating' },
                { key: 'quality', label: 'Quality' },
                { key: 'communication', label: 'Communication' },
                { key: 'timeline', label: 'Timeline' },
                { key: 'value', label: 'Value for Money' },
                { key: 'professionalism', label: 'Professionalism' }
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label className="text-sm font-medium">{label}</Label>
                  <div className="mt-1">
                    {renderStars(
                      reviewForm[key as keyof typeof reviewForm] as number, 
                      'md', 
                      true, 
                      (rating) => handleRatingChange(key, rating)
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tradeShow">Trade Show</Label>
                <Input
                  id="tradeShow"
                  value={reviewForm.tradeShow}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, tradeShow: e.target.value }))}
                  placeholder="e.g., CES 2024"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={reviewForm.tradeShowYear}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, tradeShowYear: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            {/* Written Review */}
            <div>
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your detailed experience..."
                className="mt-1"
                rows={4}
              />
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>What went well?</Label>
                {reviewForm.pros.map((pro, index) => (
                  <Input
                    key={index}
                    value={pro}
                    onChange={(e) => {
                      const newPros = [...reviewForm.pros];
                      newPros[index] = e.target.value;
                      if (index === newPros.length - 1 && e.target.value.trim()) {
                        newPros.push('');
                      }
                      setReviewForm(prev => ({ ...prev, pros: newPros }));
                    }}
                    placeholder="e.g., Excellent communication"
                    className="mt-2"
                  />
                ))}
              </div>
              <div>
                <Label>Areas for improvement</Label>
                {reviewForm.cons.map((con, index) => (
                  <Input
                    key={index}
                    value={con}
                    onChange={(e) => {
                      const newCons = [...reviewForm.cons];
                      newCons[index] = e.target.value;
                      if (index === newCons.length - 1 && e.target.value.trim()) {
                        newCons.push('');
                      }
                      setReviewForm(prev => ({ ...prev, cons: newCons }));
                    }}
                    placeholder="e.g., Initial delays"
                    className="mt-2"
                  />
                ))}
              </div>
            </div>

            {/* Recommendation and Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="recommend"
                  checked={reviewForm.wouldRecommend}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="recommend">I would recommend this {targetType}</Label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={reviewForm.anonymous}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, anonymous: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="anonymous">Post anonymously</Label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3">
              <Button 
                onClick={handleSubmitReview}
                disabled={submitting || !reviewForm.comment.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowWriteReview(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filter by rating:</span>
            <select 
              value={filterRating || ''}
              onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="">All ratings</option>
              {[5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>{rating} stars</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="helpful">Most helpful</option>
            <option value="rating">Highest rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {review.reviewerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{review.reviewerName}</h4>
                      {review.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {review.reviewerType}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(review.rating.overall, 'sm')}
                      <span className="text-sm text-gray-500">
                        {review.tradeShow} {review.tradeShowYear}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">{review.comment}</p>

                {(review.pros.length > 0 || review.cons.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {review.pros.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-green-700 mb-2">Pros</h5>
                        <ul className="space-y-1">
                          {review.pros.map((pro, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <ThumbsUp className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.cons.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-red-700 mb-2">Cons</h5>
                        <ul className="space-y-1">
                          {review.cons.map((con, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <ThumbsDown className="h-3 w-3 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {review.wouldRecommend && (
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-700">Would recommend</span>
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Flag className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                  {review.verified && (
                    <Badge variant="outline" className="text-green-600">
                      Verified Project
                    </Badge>
                  )}
                </div>

                {/* Builder Response */}
                {review.response && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">Response from {targetType}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(review.response.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{review.response.content}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500">
            {canWrite 
              ? 'Be the first to write a review!' 
              : 'This profile doesn\'t have any reviews yet.'
            }
          </p>
          {canWrite && (
            <Button 
              onClick={() => setShowWriteReview(true)}
              className="mt-4"
            >
              Write the first review
            </Button>
          )}
        </div>
      )}
    </div>
  );
}