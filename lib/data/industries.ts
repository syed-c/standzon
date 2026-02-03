export interface Industry {
    id: string;
    name: string;
    slug: string;
    description: string;
    subcategories: string[];
    color: string;
    icon: string;
    annualGrowthRate: number;
    averageBoothCost: number;
    popularCountries: string[];
}

export const industries: Industry[] = [
    {
        id: "technology",
        name: "Technology & Innovation",
        slug: "technology",
        description: "Cutting-edge tech, software, AI, and digital innovation exhibitions",
        subcategories: ["Software", "Hardware", "AI & Machine Learning", "Cybersecurity", "Fintech", "EdTech"],
        color: "#3B82F6",
        icon: "💻",
        annualGrowthRate: 12.5,
        averageBoothCost: 450,
        popularCountries: ["United States", "Germany", "United Kingdom", "Singapore"],
    },
    {
        id: "healthcare",
        name: "Healthcare & Medical",
        slug: "healthcare",
        description: "Medical equipment, pharmaceuticals, healthcare services and innovations",
        subcategories: ["Medical Devices", "Pharmaceuticals", "Digital Health", "Biotechnology", "Healthcare Services"],
        color: "#10B981",
        icon: "🏥",
        annualGrowthRate: 8.3,
        averageBoothCost: 520,
        popularCountries: ["Germany", "United States", "Switzerland", "Netherlands"],
    },
    {
        id: "automotive",
        name: "Automotive & Mobility",
        slug: "automotive",
        description: "Cars, electric vehicles, automotive parts and mobility solutions",
        subcategories: ["Electric Vehicles", "Automotive Parts", "Mobility Services", "Autonomous Driving", "Connected Cars"],
        color: "#F59E0B",
        icon: "🚗",
        annualGrowthRate: 6.8,
        averageBoothCost: 380,
        popularCountries: ["Germany", "Italy", "United States", "Japan"],
    },
    {
        id: "manufacturing",
        name: "Manufacturing & Industrial",
        slug: "manufacturing",
        description: "Industrial machinery, automation, and manufacturing technologies",
        subcategories: ["Industrial Automation", "Manufacturing Technology", "Robotics", "Supply Chain", "Quality Control"],
        color: "#8B5CF6",
        icon: "🏭",
        annualGrowthRate: 5.2,
        averageBoothCost: 420,
        popularCountries: ["Germany", "China", "United States", "Italy"],
    },
    {
        id: "food-beverage",
        name: "Food & Beverage",
        slug: "food-beverage",
        description: "Food products, beverages, food technology and culinary innovations",
        subcategories: ["Food Products", "Beverages", "Food Technology", "Packaging", "Culinary Equipment"],
        color: "#EF4444",
        icon: "🍕",
        annualGrowthRate: 4.7,
        averageBoothCost: 350,
        popularCountries: ["Germany", "France", "Italy", "United States"],
    },
    {
        id: "fashion-beauty",
        name: "Fashion & Beauty",
        slug: "fashion-beauty",
        description: "Fashion, textiles, beauty products and lifestyle brands",
        subcategories: ["Fashion", "Beauty Products", "Textiles", "Accessories", "Luxury Goods"],
        color: "#EC4899",
        icon: "👗",
        annualGrowthRate: 3.9,
        averageBoothCost: 480,
        popularCountries: ["France", "Italy", "United Kingdom", "United States"],
    },
    {
        id: "energy",
        name: "Energy & Environment",
        slug: "energy",
        description: "Renewable energy, environmental technology and sustainability solutions",
        subcategories: ["Solar Energy", "Wind Energy", "Energy Storage", "Environmental Tech", "Sustainability"],
        color: "#059669",
        icon: "🌱",
        annualGrowthRate: 15.2,
        averageBoothCost: 400,
        popularCountries: ["Germany", "Netherlands", "Denmark", "United States"],
    },
    {
        id: "construction",
        name: "Construction & Architecture",
        slug: "construction",
        description: "Building materials, architecture, construction technology and real estate",
        subcategories: ["Building Materials", "Architecture", "Construction Tech", "Real Estate", "Urban Planning"],
        color: "#D97706",
        icon: "🏗️",
        annualGrowthRate: 4.1,
        averageBoothCost: 360,
        popularCountries: ["Germany", "United States", "United Kingdom", "France"],
    },
];
