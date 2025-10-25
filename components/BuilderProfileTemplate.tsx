'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Star, Users, Clock, Shield, Award, Quote, Eye, Target, Building as BuildingIcon, Camera
} from 'lucide-react';

type ContentOverrides = {
  heroTagline?: string;
  aboutTitle?: string;
  strengthsTitle?: string;
  establishedTitle?: string;
  specializationsTitle?: string;
  locationsTitle?: string;
  locationsSubtitle?: string;
  portfolioTitle?: string;
  portfolioSubtitle?: string;
  ctaRequestQuote?: string;
  ctaRequestPortfolio?: string;
};

interface BuilderProfileTemplateProps {
  builder: any;
  isGmbImported: boolean;
  displayServices: any[];
  onOpenQuote: () => void;
  content?: ContentOverrides;
}

export default function BuilderProfileTemplate({ builder, isGmbImported, displayServices, onOpenQuote, content }: BuilderProfileTemplateProps) {
  // Defaults mirroring the provided screenshots (spacing and layout)
  const c = {
    heroTagline: content?.heroTagline || builder.companyDescription,
    aboutTitle: content?.aboutTitle || 'Company Information',
    strengthsTitle: content?.strengthsTitle || 'Key Strengths',
    establishedTitle: content?.establishedTitle || 'Established',
    specializationsTitle: content?.specializationsTitle || 'Specializations',
    locationsTitle: content?.locationsTitle || 'Service Locations',
    locationsSubtitle: content?.locationsSubtitle || `Countries and cities where ${builder.companyName} provides services`,
    portfolioTitle: content?.portfolioTitle || 'Portfolio Gallery',
    portfolioSubtitle: content?.portfolioSubtitle || `Request a quote to view ${builder.companyName}'s complete portfolio and project gallery.`,
    ctaRequestQuote: content?.ctaRequestQuote || 'Request Quote',
    ctaRequestPortfolio: content?.ctaRequestPortfolio || 'Request Portfolio Access',
  };

  return (
    <>
      {/* Hero Section – spacing tuned to match screenshots */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                  {builder.logo && builder.logo !== '/images/builders/default-logo.png' ? (
                    <img 
                      src={builder.logo} 
                      alt={builder.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BuildingIcon className="w-10 h-10 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{builder.companyName}</h1>
                  <div className="flex items-center gap-4 text-blue-100">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{builder.headquarters.city}, {builder.headquarters.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-300" />
                      <span>{builder.rating} ({builder.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xl text-blue-100 mb-6 max-w-2xl">{c.heroTagline}</p>

              <div className="flex flex-wrap gap-3">
                {builder.verified && (
                  <Badge className="bg-green-500 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified Builder
                  </Badge>
                )}
                {isGmbImported && !builder.verified && (
                  <Badge className="bg-orange-500 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    GMB Imported
                  </Badge>
                )}
                {builder.premiumMember && (
                  <Badge className="bg-yellow-500 text-yellow-900">
                    <Award className="w-3 h-3 mr-1" />
                    Premium Member
                  </Badge>
                )}
                <Badge className="bg-blue-500 text-white">
                  <Users className="w-3 h-3 mr-1" />
                  {builder.projectsCompleted} Projects
                </Badge>
                <Badge className="bg-purple-500 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {builder.responseTime}
                </Badge>
              </div>
            </div>

            {/* Lead Form Card – right column */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Quote className="w-5 h-5" />
                    Get Free Quote
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Connect with verified exhibition stand builders in {`${builder.headquarters.city}, ${builder.headquarters.country}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <Badge variant="outline" className="text-gray-900">{builder.responseTime}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Projects Completed</span>
                      <Badge variant="outline" className="text-gray-900">{builder.projectsCompleted}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average Rating</span>
                      <Badge variant="outline" className="text-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        {builder.rating}/5
                      </Badge>
                    </div>
                  </div>

                  <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" onClick={onOpenQuote}>
                    <Quote className="w-4 h-4 mr-2" />
                    {c.ctaRequestQuote}
                  </Button>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" size="sm" className="w-full text-gray-900" onClick={onOpenQuote}>
                      <Eye className="w-3 h-3 mr-2" />
                      View Portfolio
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Your request will be sent to verified builders in this location
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        <span>Multiple builders will respond with quotes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BuildingIcon className="w-5 h-5" />
                      {c.aboutTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">About Us</h4>
                        <p className="text-gray-700">{builder.companyDescription}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{c.strengthsTitle}</h4>
                        <ul className="space-y-1">
                          {builder.keyStrengths?.map((s: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-gray-700">
                              <Shield className="w-4 h-4 text-green-500" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{c.establishedTitle}</h4>
                        <p className="text-gray-700">{builder.establishedYear}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {c.specializationsTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {(builder.specializations || []).map((spec: any, index: number) => (
                        <div key={spec?.id || spec?.slug || spec?.name || index} className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: spec.color + '10', borderColor: spec.color + '30' }}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: spec.color + '20', color: spec.color }}>
                            {spec.icon}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{spec.name}</h5>
                            <p className="text-sm text-gray-600">{spec.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayServices.map((service: any, index: number) => (
                  <Card key={index} className={service.autoAssigned ? 'border-blue-200 bg-blue-50/50' : ''}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {service.name}
                        {service.autoAssigned && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300">Available</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3">{service.description}</p>
                      {service.priceFrom && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">From ${service.priceFrom}</span>
                          {service.unit && <span> {service.unit}</span>}
                        </div>
                      )}
                      {service.turnoverTime && (
                        <div className="text-xs text-gray-500 mt-2">Typical delivery: {service.turnoverTime}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              {builder.portfolio && builder.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {builder.portfolio.map((project: any, index: number) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gray-100">
                        {project.imageUrl ? (
                          <img 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Camera className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-lg mb-2">{project.title}</h4>
                        {project.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                        )}
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <div>
                            {project.projectYear && <span>{project.projectYear}</span>}
                            {project.tradeShow && <span> • {project.tradeShow}</span>}
                          </div>
                          {project.standSize && project.standSize > 0 && (
                            <span>{project.standSize} sqm</span>
                          )}
                        </div>
                        {project.client && (
                          <div className="mt-2 text-xs text-gray-500">
                            Client: {project.client}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">{c.portfolioTitle}</h3>
                  <p className="text-gray-500 mb-4">{c.portfolioSubtitle}</p>
                  <Button onClick={onOpenQuote}>
                    <Quote className="w-4 h-4 mr-2" />
                    {c.ctaRequestPortfolio}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="locations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {c.locationsTitle}
                  </CardTitle>
                  <CardDescription>{c.locationsSubtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {builder.serviceLocations.map((location: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{location.city}, {location.country}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">Client Reviews</h3>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-2xl font-bold text-yellow-600">{builder.rating}/5</div>
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className={`w-5 h-5 ${star <= Math.floor(builder.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <div className="text-gray-600">({builder.reviewCount} reviews)</div>
                </div>
                <Button onClick={onOpenQuote}>
                  <Quote className="w-4 h-4 mr-2" />
                  {c.ctaRequestQuote}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}


