import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FiMapPin, FiStar, FiUsers, FiPhone, FiMail, FiGlobe, FiCheckCircle, FiAward, FiTrendingUp, FiCamera } from 'react-icons/fi';
import { notFound } from 'next/navigation';

// Company data - in a real app this would come from a database
const companies: { [key: string]: any } = {
  "smart-spaces-design": {
    name: "Smart Spaces Design",
    tagline: "Creating Immersive Brand Experiences",
    location: "Las Vegas, Nevada, USA",
    founded: "2015",
    employees: "25-50",
    rating: 4.9,
    reviews: 127,
    projects: 450,
    countries: 15,
    description: "Smart Spaces Design is an award-winning exhibition stand builder specializing in immersive brand experiences with cutting-edge technology integration. We transform ordinary exhibition spaces into extraordinary brand showcases that captivate audiences and drive business results.",
    specialties: [
      "Custom Exhibition Stands",
      "Technology Integration", 
      "Interactive Displays",
      "Modular Systems",
      "Brand Activation",
      "Trade Show Marketing"
    ],
    services: [
      "3D Design & Visualization",
      "Stand Construction & Installation",
      "Audio Visual Integration",
      "Project Management",
      "Logistics & Storage",
      "On-site Support"
    ],
    contact: {
      phone: "+1 (702) 555-0123",
      email: "info@smartspacesdesign.com",
      website: "www.smartspacesdesign.com"
    },
    portfolio: [
      {
        title: "CES Technology Pavilion",
        size: "200 sqm",
        event: "CES Las Vegas 2024",
        industry: "Technology",
        description: "Multi-level interactive showcase featuring VR demonstrations and product launches"
      },
      {
        title: "Medical Innovation Hub",
        size: "150 sqm", 
        event: "HIMSS Chicago 2024",
        industry: "Healthcare",
        description: "Clean, modern design highlighting breakthrough medical device technologies"
      },
      {
        title: "Automotive Experience Center",
        size: "300 sqm",
        event: "SEMA Las Vegas 2023",
        industry: "Automotive",
        description: "Dynamic space showcasing electric vehicle innovation with interactive demos"
      }
    ],
    awards: [
      "Best Stand Design - CES 2024",
      "Innovation in Technology Integration - ExhibitorLive 2023",
      "Sustainability Award - IAEE 2023"
    ],
    certifications: [
      "IAEE Certified",
      "ISO 9001:2015",
      "OSHA Compliant",
      "Green Building Certified"
    ]
  }
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const company = companies[slug];
  
  if (!company) {
    return {
      title: "Company Not Found | ExhibitBay",
      description: "The requested company profile could not be found."
    };
  }

  return {
    title: `${company.name} - Exhibition Stand Builder | ExhibitBay`,
    description: `${company.description.substring(0, 160)}...`,
    keywords: `${company.name}, exhibition stands, ${company.location}, trade show displays`,
  };
}

export default async function CompanyProfile({ params }: Props) {
  const { slug } = await params;
  console.log("Company Profile: Page loaded for", slug);
  
  const company = companies[slug];
  
  if (!company) {
    notFound();
  }

  return (
    <div className="font-inter min-h-screen">
      <Navigation />
      
      {/* Company Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-navy-900 via-navy-800 to-blue-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-blue-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {company.name.split(' ').map((word: string) => word[0]).join('').substring(0, 2)}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{company.name}</h1>
                  <p className="text-blue-primary font-medium">{company.tagline}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <FiMapPin className="text-blue-primary" />
                <span>{company.location}</span>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-1">
                  <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{company.rating}</span>
                  <span className="text-gray-300">({company.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiUsers className="w-5 h-5 text-blue-primary" />
                  <span>{company.projects} projects completed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiTrendingUp className="w-5 h-5 text-blue-primary" />
                  <span>{company.countries} countries served</span>
                </div>
              </div>

              <p className="text-gray-200 text-lg leading-relaxed">
                {company.description}
              </p>
            </div>

            <div>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-white">Get Quote</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FiPhone className="text-blue-primary" />
                      <span className="text-white">{company.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiMail className="text-blue-primary" />
                      <span className="text-white">{company.contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiGlobe className="text-blue-primary" />
                      <span className="text-white">{company.contact.website}</span>
                    </div>
                    <Button className="w-full bg-blue-primary hover:bg-blue-dark text-white mt-4">
                      Request Free Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Specialties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Specialties</h2>
              <div className="grid grid-cols-2 gap-3">
                {company.specialties.map((specialty: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{specialty}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Services</h2>
              <div className="grid grid-cols-1 gap-3">
                {company.services.map((service: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FiCheckCircle className="w-5 h-5 text-blue-primary" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-navy-900 mb-12">Recent Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {company.portfolio.map((project: any, index: number) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <FiCamera className="w-5 h-5 text-blue-primary" />
                    <span className="text-sm font-medium text-blue-primary">{project.size}</span>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">{project.title}</h3>
                  <div className="text-sm text-gray-500 mb-3">
                    {project.event} • {project.industry}
                  </div>
                  <p className="text-gray-700">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Certifications */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Awards & Recognition</h2>
              <div className="space-y-3">
                {company.awards.map((award: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FiAward className="w-5 h-5 text-gold-primary" />
                    <span className="text-gray-700">{award}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Certifications</h2>
              <div className="space-y-3">
                {company.certifications.map((cert: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Work with {company.name}?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get a free, no-obligation quote for your next exhibition stand project. 
            Our team is ready to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-primary hover:bg-gray-100 px-8 py-4 text-lg">
              Request Free Quote
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-primary px-8 py-4 text-lg">
              View More Projects
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}