"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Award,
  ArrowRight,
  ArrowLeft,
  Star,
  Info,
  Loader2,
} from "lucide-react";
import { tier1Countries, allCountries } from "@/lib/data/countries";
import { toast } from "sonner";

interface SignupFormData {
  // Step 1: Company Basics
  companyName: string;
  contactName: string;
  contactTitle: string;
  primaryEmail: string;
  phoneNumber: string;
  website: string;
  password: string;
  confirmPassword: string;

  // Step 2: Business Details
  establishedYear: number;
  businessType: "individual" | "company" | "partnership";
  teamSize: string;
  yearsOfExperience: number;
  projectsCompleted: number;
  companyDescription: string;

  // Step 3: Location & Address
  country: string;
  city: string;
  address: string;
  postalCode: string;

  // Step 4: Services & Locations
  services: {
    name: string;
    description: string;
    priceRange: string;
  }[];
  serviceCountries: string[];
  serviceCities: string[];
  specializations: string[];

  // Step 5: Verification & Terms
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
  otpCode: string;
  emailVerified: boolean;
}

const SPECIALIZATIONS = [
  "Custom Stand Design",
  "Modular Systems",
  "Portable Displays",
  "Double Deck Stands",
  "Sustainable/Eco Stands",
  "Technology Integration",
  "Interactive Displays",
  "LED & Lighting",
  "Furniture Rental",
  "Graphics & Printing",
  "Installation Services",
  "Project Management",
];

const TEAM_SIZES = [
  "1-5 employees",
  "6-15 employees",
  "16-30 employees",
  "31-50 employees",
  "51-100 employees",
  "100+ employees",
];

export default function EnhancedBuilderSignup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpResponse, setOtpResponse] = useState<any | null>(null);

  const [formData, setFormData] = useState<SignupFormData>({
    companyName: "",
    contactName: "",
    contactTitle: "",
    primaryEmail: "",
    phoneNumber: "",
    website: "",
    password: "",
    confirmPassword: "",

    establishedYear: new Date().getFullYear(),
    businessType: "company",
    teamSize: "",
    yearsOfExperience: 0,
    projectsCompleted: 0,
    companyDescription: "",

    country: "",
    city: "",
    address: "",
    postalCode: "",

    services: [{ name: "", description: "", priceRange: "" }],
    serviceCountries: [],
    serviceCities: [],
    specializations: [],

    agreeToTerms: false,
    agreeToMarketing: false,
    otpCode: "",
    emailVerified: false,
  });

  const updateFormData = (field: keyof SignupFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleArrayUpdate = (
    field: keyof SignupFormData,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter((item) => item !== value),
    }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { name: "", description: "", priceRange: "" },
      ],
    }));
  };

  const updateService = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.companyName)
          newErrors.companyName = "Company name is required";
        if (!formData.contactName)
          newErrors.contactName = "Contact person name is required";
        if (!formData.primaryEmail)
          newErrors.primaryEmail = "Email is required";
        if (!formData.phoneNumber)
          newErrors.phoneNumber = "Phone number is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password && formData.password.length < 8)
          newErrors.password = "Password must be at least 8 characters";
        if (!formData.confirmPassword)
          newErrors.confirmPassword = "Please confirm your password";
        if (
          formData.password &&
          formData.confirmPassword &&
          formData.password !== formData.confirmPassword
        ) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
      case 2:
        if (!formData.companyDescription)
          newErrors.companyDescription = "Company description is required";
        if (formData.yearsOfExperience < 1)
          newErrors.yearsOfExperience = "Years of experience is required";
        if (!formData.teamSize) newErrors.teamSize = "Team size is required";
        break;
      case 3:
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.address) newErrors.address = "Address is required";
        break;
      case 4:
        if (formData.serviceCountries.length === 0)
          newErrors.serviceCountries = "Select at least one service country";
        if (formData.specializations.length === 0)
          newErrors.specializations = "Select at least one specialization";
        if (formData.services.some((s) => !s.name))
          newErrors.services = "All services must have a name";
        break;
      case 5:
        if (!formData.agreeToTerms)
          newErrors.agreeToTerms = "You must agree to the terms and conditions";
        if (!formData.emailVerified)
          newErrors.emailVerified = "Email verification is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    console.log(
      "📧 Sending OTP for enhanced signup to:",
      formData.primaryEmail
    );
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.primaryEmail,
          userType: "builder",
          companyName: formData.companyName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOtpSent(true);
        setOtpResponse(result.data);

        // Show demo OTP if available
        if (result.data.demoOTP) {
          toast.success(`OTP sent! Demo OTP: ${result.data.demoOTP}`);
        } else {
          toast.success("Verification code sent to your email");
        }

        console.log("✅ OTP sent successfully");
      } else {
        console.error("❌ Failed to send OTP:", result.error);
        setErrors({ otpCode: result.error || "Failed to send OTP" });
      }
    } catch (error) {
      console.error("❌ Network error sending OTP:", error);
      setErrors({
        otpCode: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOTP = async () => {
    console.log("🔐 Verifying OTP for enhanced signup:", formData.otpCode);
    console.log("Email being used:", formData.primaryEmail);
    setIsSubmitting(true);

    // Validate OTP format before sending to server
    if (!formData.otpCode || formData.otpCode.length !== 6) {
      setErrors({ otpCode: "OTP must be 6 digits" });
      setIsSubmitting(false);
      return;
    }

    try {
      // Log the exact payload being sent
      const payload = {
        action: "verify",
        email: formData.primaryEmail,
        otp: formData.otpCode,
        userType: "builder",
      };
      console.log("Sending OTP verification payload:", payload);

      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Log the raw response for debugging
      console.log("OTP verification response status:", response.status);
      const result = await response.json();
      console.log("OTP verification response:", result);

      if (result.success) {
        updateFormData("emailVerified", true);
        toast.success("Email verified successfully!");
        console.log("✅ OTP verified successfully");
        setErrors((prev) => ({ ...prev, otpCode: "" }));
      } else {
        // More detailed error handling
        console.error("❌ OTP verification failed:", result.error);
        
        // Show a more user-friendly error message
        if (result.error === "Invalid or expired OTP") {
          toast.error("The verification code is invalid or has expired. Please request a new code.");
        } else if (result.error === "OTP has expired") {
          toast.error("The verification code has expired. Please request a new code.");
        } else if (result.error === "Invalid OTP") {
          toast.error("Incorrect verification code. Please check and try again.");
        }
        
        setErrors({ otpCode: result.error || "Invalid OTP code" });
      }
    } catch (error) {
      console.error("❌ Network error verifying OTP:", error);
      toast.error("Network error. Please check your connection and try again.");
      setErrors({ otpCode: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    console.log("🚀 Submitting enhanced builder registration:", formData);

    try {
      // Create unified builder profile structure
      const unifiedBuilderData = {
        // Core Profile
        companyName: formData.companyName,
        slug: formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        contactName: formData.contactName,
        contactTitle: formData.contactTitle,
        primaryEmail: formData.primaryEmail,
        phoneNumber: formData.phoneNumber,
        website: formData.website,
        companyDescription: formData.companyDescription,

        // Business Details
        establishedYear: formData.establishedYear,
        businessType: formData.businessType,
        teamSize: formData.teamSize,
        yearsOfExperience: formData.yearsOfExperience,
        projectsCompleted: formData.projectsCompleted,

        // Location Information
        headquarters: {
          country: formData.country,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
          countryCode: formData.country.slice(0, 2).toUpperCase(),
          latitude: 0,
          longitude: 0,
          isHeadquarters: true,
        },

        // Services & Locations - ENHANCED STRUCTURE
        services: formData.services
          .filter((s) => s.name)
          .map((service) => ({
            id: service.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            name: service.name,
            description: service.description,
            category: "Design",
            priceRange: service.priceRange,
            popular: true,
            turnoverTime: "4-6 weeks",
          })),

        // Service Locations - CRITICAL FOR LISTING VISIBILITY
        serviceLocations: formData.serviceCountries.map((country) => ({
          country: country,
          cities: formData.serviceCities.filter((city) => city.trim() !== ""),
          countryCode: country.slice(0, 2).toUpperCase(),
          active: true,
        })),

        specializations: formData.specializations.map((spec) => ({
          name: spec,
          slug: spec.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        })),

        // Account & Verification
        password: formData.password, // Will be hashed server-side
        emailVerified: formData.emailVerified,
        verified: true, // Auto-verify since email was verified
        claimed: true, // Mark as claimed since they registered manually
        subscriptionPlan: "free",

        // Meta
        source: "enhanced_registration",
        registrationDate: new Date().toISOString(),
        loginEnabled: true,

        // Marketing preferences
        marketingOptIn: formData.agreeToMarketing,
      };

      console.log(
        "📡 Sending unified builder data to API:",
        unifiedBuilderData
      );

      // Submit to unified builder API
      const response = await fetch("/api/admin/builders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unifiedBuilderData),
      });

      const result = await response.json();
      console.log("📡 Enhanced Registration API Response:", result);

      if (result.success) {
        console.log("✅ Enhanced builder registration successful!");

        const createdId = result.data?.id || `enhanced_${Date.now()}`;
        const createdSlug =
          result.data?.slug ||
          formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, "-");

        // Store unified profile data for immediate dashboard access
        const profileData = {
          id: createdId,
          slug: createdSlug,
          profile: {
            businessName: formData.companyName,
            contactName: formData.contactName,
            email: formData.primaryEmail,
            phone: formData.phoneNumber,
            website: formData.website,
            description: formData.companyDescription,
            country: formData.country,
            city: formData.city,
            address: formData.address,
            businessType: formData.businessType,
            establishedYear: formData.establishedYear,
            teamSize: formData.teamSize,
            yearsOfExperience: formData.yearsOfExperience,
            projectsCompleted: formData.projectsCompleted,
            specializations: formData.specializations,
            serviceCountries: formData.serviceCountries,
            subscriptionPlan: "free",
            verified: true,
            claimed: true,
          },
          services: formData.services,
          serviceLocations: formData.serviceCountries.map((country) => ({
            country,
            cities: formData.serviceCities,
          })),
          source: "enhanced_registration",
        };

        // Store for dashboard access
        localStorage.setItem("builderUserData", JSON.stringify(profileData));
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: createdId,
            email: formData.primaryEmail,
            name: formData.contactName,
            role: "builder",
            companyName: formData.companyName,
            verified: true,
            isLoggedIn: true,
            loginMethod: "registration",
          })
        );

        // Force refresh of platform data
        try {
          await fetch("/api/admin/builders?action=reload");
          console.log("🔄 Platform data refreshed after enhanced registration");
        } catch (refreshError) {
          console.log("⚠️ Could not refresh platform data:", refreshError);
        }

        setShowSuccess(true);

        // Redirect to unified dashboard and enable public profile link
        setTimeout(() => {
          router.push(
            "/builder/dashboard?signup=success&enhanced=true&id=" + createdId
          );
          // Also open public profile in a new tab for confirmation
          window.open(`/builders/${createdSlug}`, "_blank");
        }, 1500);
      } else {
        console.error("❌ Enhanced registration failed:", result.error);
        setErrors({
          submit: result.error || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("❌ Network Error during enhanced registration:", error);
      setErrors({
        submit: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Registration Successful! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Your builder profile has been created and is now live on our
              platform. You'll be redirected to your dashboard in a few seconds.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• ✅ Your profile is now visible to potential clients</li>
                <li>
                  • 🔍 You'll appear in searches for your service locations
                </li>
                <li>• 📧 Start receiving quote requests immediately</li>
                <li>• 📊 Access your unified dashboard to manage everything</li>
                <li>• 🚀 Complete your profile to increase visibility</li>
              </ul>
            </div>
            <Button
              onClick={() => router.push("/builder/dashboard")}
              className="mr-4"
            >
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              View Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stepTitles = [
    "Company Information",
    "Business Details",
    "Location & Address",
    "Services & Specializations",
    "Verification & Launch",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 5 && (
                  <div
                    className={`w-12 h-0.5 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Launch Your Builder Profile
          </h1>
          <p className="text-gray-600 mb-4">
            Step {currentStep} of 5: {stepTitles[currentStep - 1]}
          </p>
          <Progress
            value={(currentStep / 5) * 100}
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Company Information
                </h2>
                <p className="text-gray-600 mb-6">
                  Tell us about your exhibition stand building business
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) =>
                      updateFormData("companyName", e.target.value)
                    }
                    placeholder="Your company name"
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactName">Contact Person Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) =>
                      updateFormData("contactName", e.target.value)
                    }
                    placeholder="Full name of primary contact"
                    className={errors.contactName ? "border-red-500" : ""}
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactTitle">Job Title/Position</Label>
                  <Input
                    id="contactTitle"
                    value={formData.contactTitle}
                    onChange={(e) =>
                      updateFormData("contactTitle", e.target.value)
                    }
                    placeholder="CEO, Manager, Director, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="primaryEmail">Business Email Address *</Label>
                  <Input
                    id="primaryEmail"
                    type="email"
                    value={formData.primaryEmail}
                    onChange={(e) =>
                      updateFormData("primaryEmail", e.target.value)
                    }
                    placeholder="contact@yourcompany.com"
                    className={errors.primaryEmail ? "border-red-500" : ""}
                  />
                  {errors.primaryEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.primaryEmail}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      updateFormData("phoneNumber", e.target.value)
                    }
                    placeholder="+1 234 567 8900"
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website">Company Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    placeholder="https://www.yourcompany.com"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    placeholder="Create a secure password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      updateFormData("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Business Details</h2>
                <p className="text-gray-600 mb-6">
                  Help clients understand your expertise and capabilities
                </p>
              </div>

              <div>
                <Label htmlFor="companyDescription">
                  Company Description *
                </Label>
                <Textarea
                  id="companyDescription"
                  value={formData.companyDescription}
                  onChange={(e) =>
                    updateFormData("companyDescription", e.target.value)
                  }
                  placeholder="Describe your company, experience, and what makes you unique..."
                  rows={5}
                  className={errors.companyDescription ? "border-red-500" : ""}
                />
                {errors.companyDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.companyDescription}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) =>
                      updateFormData(
                        "establishedYear",
                        parseInt(e.target.value) || new Date().getFullYear()
                      )
                    }
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <Label htmlFor="teamSize">Team Size *</Label>
                  <Select
                    value={formData.teamSize}
                    onValueChange={(value) => updateFormData("teamSize", value)}
                  >
                    <SelectTrigger
                      className={errors.teamSize ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select your team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.teamSize && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.teamSize}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="yearsOfExperience">
                    Years of Experience *
                  </Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      updateFormData(
                        "yearsOfExperience",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="5"
                    min="0"
                    max="50"
                    className={errors.yearsOfExperience ? "border-red-500" : ""}
                  />
                  {errors.yearsOfExperience && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.yearsOfExperience}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="projectsCompleted">
                    Projects Completed (Approximate)
                  </Label>
                  <Input
                    id="projectsCompleted"
                    type="number"
                    value={formData.projectsCompleted}
                    onChange={(e) =>
                      updateFormData(
                        "projectsCompleted",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="50"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Address */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Location & Address
                </h2>
                <p className="text-gray-600 mb-6">
                  Where is your company headquartered?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => updateFormData("country", value)}
                  >
                    <SelectTrigger
                      className={errors.country ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCountries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    placeholder="Your city"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Business Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Street address, building number"
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal/ZIP Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) =>
                      updateFormData("postalCode", e.target.value)
                    }
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Services & Specializations */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Services & Specializations
                </h2>
                <p className="text-gray-600 mb-6">
                  Define your services and where you operate
                </p>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">
                  Service Countries *
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  Select countries where you provide services
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-lg p-4">
                  {allCountries.map((country) => (
                    <div
                      key={country.code}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={country.code}
                        checked={formData.serviceCountries.includes(
                          country.name
                        )}
                        onCheckedChange={(checked) =>
                          handleArrayUpdate(
                            "serviceCountries",
                            country.name,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={country.code}
                        className="text-sm cursor-pointer"
                      >
                        {country.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.serviceCountries && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.serviceCountries}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">
                  Specializations *
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  Select your areas of expertise
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SPECIALIZATIONS.map((specialization) => (
                    <div
                      key={specialization}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={specialization}
                        checked={formData.specializations.includes(
                          specialization
                        )}
                        onCheckedChange={(checked) =>
                          handleArrayUpdate(
                            "specializations",
                            specialization,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={specialization}
                        className="text-sm cursor-pointer"
                      >
                        {specialization}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.specializations && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.specializations}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">
                  Services Offered
                </Label>
                <p className="text-sm text-gray-600 mb-3">
                  Define your main services with pricing
                </p>
                {formData.services.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <Input
                        placeholder="Service name"
                        value={service.name}
                        onChange={(e) =>
                          updateService(index, "name", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Price range (e.g., €200-500/sqm)"
                        value={service.priceRange}
                        onChange={(e) =>
                          updateService(index, "priceRange", e.target.value)
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeService(index)}
                        disabled={formData.services.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Service description"
                      value={service.description}
                      onChange={(e) =>
                        updateService(index, "description", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addService}
                  className="w-full"
                >
                  Add Another Service
                </Button>
                {errors.services && (
                  <p className="text-red-500 text-sm mt-1">{errors.services}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Verification & Launch */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Verification & Launch
                </h2>
                <p className="text-gray-600 mb-6">
                  Complete email verification and launch your profile
                </p>
              </div>

              {!formData.emailVerified ? (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium text-blue-900 mb-2">
                          Email Verification Required
                        </h3>
                        <p className="text-blue-800 text-sm mb-4">
                          Verify your email: {formData.primaryEmail}
                        </p>

                        {!otpSent ? (
                          <Button onClick={sendOTP} disabled={isSubmitting}>
                            {isSubmitting ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Mail className="w-4 h-4 mr-2" />
                            )}
                            Send Verification Code
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="otpCode">
                                Enter 6-digit verification code
                              </Label>
                              <Input
                                id="otpCode"
                                value={formData.otpCode}
                                onChange={(e) =>
                                  updateFormData("otpCode", e.target.value)
                                }
                                placeholder="123456"
                                maxLength={6}
                                className={
                                  errors.otpCode ? "border-red-500" : ""
                                }
                              />
                              {errors.otpCode && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.otpCode}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={verifyOTP}
                                disabled={
                                  isSubmitting || formData.otpCode.length !== 6
                                }
                              >
                                {isSubmitting ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : null}
                                Verify Code
                              </Button>
                              <Button
                                variant="outline"
                                onClick={sendOTP}
                                disabled={isSubmitting}
                              >
                                Resend Code
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Email verification completed successfully! 🎉
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      updateFormData("agreeToTerms", checked)
                    }
                    className={errors.agreeToTerms ? "border-red-500" : ""}
                  />
                  <div>
                    <Label htmlFor="agreeToTerms" className="cursor-pointer">
                      I agree to the Terms of Service and Privacy Policy *
                    </Label>
                    {errors.agreeToTerms && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.agreeToTerms}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToMarketing"
                    checked={formData.agreeToMarketing}
                    onCheckedChange={(checked) =>
                      updateFormData("agreeToMarketing", checked)
                    }
                  />
                  <Label htmlFor="agreeToMarketing" className="cursor-pointer">
                    I agree to receive updates about the platform and new
                    features
                  </Label>
                </div>
              </div>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-900 mb-2">
                        Ready to Launch!
                      </h3>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>
                          • Your profile will be immediately visible to clients
                        </li>
                        <li>
                          • You'll appear in searches for your service locations
                        </li>
                        <li>• Start receiving quote requests right away</li>
                        <li>
                          • Access your unified dashboard to manage everything
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {errors.submit && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {errors.submit}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < 5 ? (
                <Button onClick={() => nextStep()} disabled={isSubmitting}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !formData.agreeToTerms ||
                  !formData.emailVerified
                }
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Launching...
                  </>
                ) : (
                  <>
                    🚀 Launch My Profile
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
