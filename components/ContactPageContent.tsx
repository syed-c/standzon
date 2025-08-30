"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";

const contactInfo: Array<{
  icon: React.ReactNode;
  title: string;
  details: string[];
  description?: string;
}> = [];

const standSizes = [
  "Under 25 sqm",
  "25-50 sqm",
  "50-100 sqm",
  "100-200 sqm",
  "200-500 sqm",
  "500+ sqm",
];

const budgetRanges = [
  "Under €10,000",
  "€10,000 - €25,000",
  "€25,000 - €50,000",
  "€50,000 - €100,000",
  "€100,000 - €250,000",
  "€250,000+",
];

const services = [
  "Stand Design & Build",
  "Modular Stand Systems",
  "Custom Exhibition Stands",
  "Stand Installation",
  "Graphics & Signage",
  "AV & Technology Integration",
  "Project Management",
  "Storage & Logistics",
];

const industries = [
  "Technology & IT",
  "Healthcare & Medical",
  "Automotive",
  "Manufacturing & Industrial",
  "Fashion & Lifestyle",
  "Food & Beverage",
  "Financial Services",
  "Education",
  "Other",
];

export default function ContactPageContent() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    eventName: "",
    eventLocation: "",
    eventDates: "",
    standSize: "",
    budget: "",
    services: [] as string[],
    industry: "",
    message: "",
    urgency: "normal",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Production: no console spam

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Wire actual submit endpoint
    setIsSubmitting(false);
    toast({
      title: "Request submitted",
      description: "Thank you. We'll get back to you shortly.",
    });
  };

  return (
    <div className="font-inter min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-navy-900 via-navy-800 to-blue-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get Your Free
              <span className="block text-blue-primary">
                Exhibition Stand Quote
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Connect with up to 5 pre-vetted exhibition stand contractors. Free
              quotes, expert advice, and guaranteed quality.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-lg">
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="text-claret-400" />
                <span>Free Quotes</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="text-claret-400" />
                <span>Pre-Vetted Contractors</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="text-claret-400" />
                <span>24h Response</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-navy-900 mb-4">
                      Request Your Quote
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and we'll connect you with the
                      best exhibition stand contractors for your specific needs
                      and location.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="your.email@company.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <Input
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <Input
                          value={formData.company}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                          placeholder="Your Company Ltd."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <Input
                          value={formData.website}
                          onChange={(e) =>
                            handleInputChange("website", e.target.value)
                          }
                          placeholder="www.yourcompany.com"
                        />
                      </div>
                    </div>

                    {/* Event Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold text-navy-900 mb-4">
                        Event Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event/Trade Show Name *
                          </label>
                          <Input
                            value={formData.eventName}
                            onChange={(e) =>
                              handleInputChange("eventName", e.target.value)
                            }
                            placeholder="e.g., IFA Berlin 2025"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Location *
                          </label>
                          <Input
                            value={formData.eventLocation}
                            onChange={(e) =>
                              handleInputChange("eventLocation", e.target.value)
                            }
                            placeholder="e.g., Berlin, Germany"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Dates
                        </label>
                        <Input
                          value={formData.eventDates}
                          onChange={(e) =>
                            handleInputChange("eventDates", e.target.value)
                          }
                          placeholder="e.g., March 5-8, 2025"
                        />
                      </div>
                    </div>

                    {/* Stand Requirements */}
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold text-navy-900 mb-4">
                        Stand Requirements
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stand Size
                          </label>
                          <Select
                            value={formData.standSize}
                            onValueChange={(value) =>
                              handleInputChange("standSize", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select stand size" />
                            </SelectTrigger>
                            <SelectContent>
                              {standSizes.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Budget Range
                          </label>
                          <Select
                            value={formData.budget}
                            onValueChange={(value) =>
                              handleInputChange("budget", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              {budgetRanges.map((budget) => (
                                <SelectItem key={budget} value={budget}>
                                  {budget}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Industry
                        </label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value) =>
                            handleInputChange("industry", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Required Services (Select all that apply)
                        </label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {services.map((service) => (
                            <label
                              key={service}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.services.includes(service)}
                                onChange={() => handleServiceToggle(service)}
                                className="rounded border-gray-300 text-blue-primary focus:ring-blue-primary"
                              />
                              <span className="text-sm text-gray-700">
                                {service}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="border-t pt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Requirements or Message
                        </label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) =>
                            handleInputChange("message", e.target.value)
                          }
                          placeholder="Tell us more about your project requirements, design preferences, or any specific needs..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Urgency
                        </label>
                        <Select
                          value={formData.urgency}
                          onValueChange={(value) =>
                            handleInputChange("urgency", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">
                              Urgent (within 1 week)
                            </SelectItem>
                            <SelectItem value="normal">
                              Normal (within 1 month)
                            </SelectItem>
                            <SelectItem value="planning">
                              Planning (2+ months)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-primary hover:bg-blue-dark text-white py-4 text-lg"
                    >
                      {isSubmitting ? (
                        "Submitting Request..."
                      ) : (
                        <>
                          <FiSend className="mr-2" />
                          Get Free Quotes Now
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information Sidebar */}
            {contactInfo.length > 0 && (
              <div className="space-y-6">
                {/* Contact Info Cards */}
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">{info.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-navy-900 mb-2">
                            {info.title}
                          </h3>
                          {info.details.map((detail, idx) => (
                            <div key={idx} className="text-gray-600 mb-1">
                              {detail}
                            </div>
                          ))}
                          {info.description && (
                            <p className="text-sm text-gray-500 mt-2">
                              {info.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Process Overview */}
                <Card className="bg-blue-primary text-white">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">
                      What Happens Next?
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-white text-blue-primary rounded-full flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <div className="text-sm">
                          <div className="font-semibold">
                            Instant Confirmation
                          </div>
                          <div className="text-blue-100">
                            You'll receive confirmation of your request
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-white text-blue-primary rounded-full flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <div className="text-sm">
                          <div className="font-semibold">Review</div>
                          <div className="text-blue-100">
                            We review your request and contact you
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-white text-blue-primary rounded-full flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        <div className="text-sm">
                          <div className="font-semibold">Next Steps</div>
                          <div className="text-blue-100">
                            We'll outline the next steps and timeline
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
