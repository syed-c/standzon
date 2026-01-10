"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
    FiCalendar,
    FiMapPin,
    FiUsers,
    FiTrendingUp,
    FiSearch,
    FiFilter,
    FiArrowRight,
    FiGlobe,
    FiStar,
    FiEye,
} from "react-icons/fi";
import { TradeShow, Industry, TradeShowUtils } from "@/lib/data/tradeShows";

interface TradeShowsClientProps {
    initialTradeShows: TradeShow[];
    industries: Industry[];
}

export default function TradeShowsClient({ initialTradeShows, industries }: TradeShowsClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("all");
    const [selectedIndustry, setSelectedIndustry] = useState("all");
    const [selectedYear, setSelectedYear] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    // Get unique countries and years
    const countries = useMemo(() => {
        return Array.from(
            new Set(initialTradeShows.map((show) => show.country))
        ).sort();
    }, [initialTradeShows]);

    const years = useMemo(() => {
        return Array.from(new Set(initialTradeShows.map((show) => show.year))).sort();
    }, [initialTradeShows]);

    // Filter exhibitions based on search and filters
    const filteredShows = useMemo(() => {
        return initialTradeShows.filter((show) => {
            const matchesSearch =
                searchTerm === "" ||
                show.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                show.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                show.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                show.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCountry =
                selectedCountry === "all" || show.country === selectedCountry;
            const matchesIndustry =
                selectedIndustry === "all" ||
                show.industries.some((industry) => industry.slug === selectedIndustry);
            const matchesYear =
                selectedYear === "all" || show.year.toString() === selectedYear;

            return matchesSearch && matchesCountry && matchesIndustry && matchesYear;
        });
    }, [initialTradeShows, searchTerm, selectedCountry, selectedIndustry, selectedYear]);

    // Get major shows
    const majorShows = useMemo(() => {
        return initialTradeShows.filter((show) => show.significance === "Major");
    }, [initialTradeShows]);

    // Enhanced statistics
    const enhancedStats = useMemo(() => {
        const totalShows = initialTradeShows.length;
        const totalCountries = countries.length;
        const totalIndustries = industries.length;
        const totalExpectedVisitors = initialTradeShows.reduce(
            (sum, show) => sum + show.expectedVisitors,
            0
        );
        const totalExpectedExhibitors = initialTradeShows.reduce(
            (sum, show) => sum + show.expectedExhibitors,
            0
        );

        const upcomingShows = initialTradeShows.filter((show) => new Date(show.startDate) > new Date());

        return {
            totalShows,
            totalCountries,
            totalCities: Array.from(new Set(initialTradeShows.map((show) => show.city))).length,
            totalIndustries,
            totalExpectedVisitors,
            totalExpectedExhibitors,
            averageShowSize: totalShows > 0 ? Math.round(totalExpectedVisitors / totalShows) : 0,
            upcomingCount: upcomingShows.length,
            majorCount: majorShows.length,
            countryBreakdown: countries.reduce(
                (acc, country) => {
                    acc[country] = initialTradeShows.filter((s) => s.country === country).length;
                    return acc;
                },
                {} as Record<string, number>
            ),
        };
    }, [initialTradeShows, countries, industries, majorShows]);

    return (
        <div className="font-inter min-h-screen bg-background-gray">
            {/* Professional Hero Section */}
            <section className="pt-20 pb-16 bg-gradient-to-br from-deep-navy via-gray-800 to-primary-blue text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                            <FiTrendingUp className="w-4 h-4 mr-2 text-industry-green" />
                            Professional Trade Show Database
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Global Trade Shows
                            <span className="block text-primary-blue bg-gradient-to-r from-primary-blue to-industry-green bg-clip-text text-transparent">
                                &amp; Exhibitions Directory
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                            Access {enhancedStats.totalShows}+ verified trade shows across{" "}
                            {enhancedStats.totalCountries} countries. Connect with exhibition
                            stand builders and maximize your ROI at industry-leading events.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-lg mb-8">
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-12 h-12 bg-primary-blue/20 rounded-full flex items-center justify-center">
                                    <FiCalendar className="text-primary-blue w-6 h-6" />
                                </div>
                                <span className="font-semibold">{enhancedStats.totalShows}+</span>
                                <span className="text-gray-300 text-sm">Trade Shows</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-12 h-12 bg-industry-green/20 rounded-full flex items-center justify-center">
                                    <FiMapPin className="text-industry-green w-6 h-6" />
                                </div>
                                <span className="font-semibold">{enhancedStats.totalCountries}</span>
                                <span className="text-gray-300 text-sm">Countries</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-12 h-12 bg-warning-orange/20 rounded-full flex items-center justify-center">
                                    <FiUsers className="text-warning-orange w-6 h-6" />
                                </div>
                                <span className="font-semibold">
                                    {(enhancedStats.totalExpectedVisitors / 1000000).toFixed(1)}M+
                                </span>
                                <span className="text-gray-300 text-sm">Visitors</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center">
                                    <FiTrendingUp className="text-purple-400 w-6 h-6" />
                                </div>
                                <span className="font-semibold">{enhancedStats.totalIndustries}</span>
                                <span className="text-gray-300 text-sm">Industries</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Professional Statistics Banner */}
            <section className="py-8 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6 text-center">
                        <div className="border-r border-gray-200 last:border-r-0">
                            <div className="text-3xl font-bold text-primary-blue">{enhancedStats.totalShows}</div>
                            <div className="text-sm text-gray-600 font-medium">Total Shows</div>
                        </div>
                        <div className="border-r border-gray-200 last:border-r-0">
                            <div className="text-3xl font-bold text-industry-green">{enhancedStats.upcomingCount}</div>
                            <div className="text-sm text-gray-600 font-medium">Upcoming</div>
                        </div>
                        <div className="border-r border-gray-200 last:border-r-0">
                            <div className="text-3xl font-bold text-warning-orange">{enhancedStats.majorCount}</div>
                            <div className="text-sm text-gray-600 font-medium">Major Events</div>
                        </div>
                        <div className="border-r border-gray-200 last:border-r-0">
                            <div className="text-3xl font-bold text-deep-navy">{enhancedStats.totalCountries}</div>
                            <div className="text-sm text-gray-600 font-medium">Countries</div>
                        </div>
                        <div className="border-r border-gray-200 last:border-r-0">
                            <div className="text-3xl font-bold text-purple-600">{enhancedStats.totalIndustries}</div>
                            <div className="text-sm text-gray-600 font-medium">Industries</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-red-600">
                                {(enhancedStats.totalExpectedVisitors / 1000000).toFixed(1)}M
                            </div>
                            <div className="text-sm text-gray-600 font-medium">Total Visitors</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Professional Filters */}
            <section className="py-6 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
                            >
                                <FiFilter className="w-4 h-4" />
                                Advanced Filters
                                {(selectedCountry !== "all" || selectedIndustry !== "all" || selectedYear !== "all") && (
                                    <span className="bg-primary-blue text-white text-xs px-2 py-1 rounded-full ml-1">
                                        {[selectedCountry, selectedIndustry, selectedYear].filter((f) => f !== "all").length}
                                    </span>
                                )}
                            </Button>
                            <div className="text-gray-600 font-medium">
                                <span className="text-primary-blue font-bold">{filteredShows.length}</span> of{" "}
                                {initialTradeShows.length} exhibitions
                            </div>
                        </div>

                        {(showFilters || selectedCountry !== "all" || selectedIndustry !== "all" || selectedYear !== "all") && (
                            <div className="flex flex-wrap gap-4">
                                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                    <SelectTrigger className="w-40 border-gray-300">
                                        <SelectValue placeholder="All Countries" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Countries ({countries.length})</SelectItem>
                                        {countries.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country} ({enhancedStats.countryBreakdown[country] || 0})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                                    <SelectTrigger className="w-48 border-gray-300">
                                        <SelectValue placeholder="All Industries" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Industries</SelectItem>
                                        {industries.map((industry) => (
                                            <SelectItem key={industry.slug} value={industry.slug}>
                                                {industry.icon} {industry.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="w-32 border-gray-300">
                                        <SelectValue placeholder="All Years" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Years</SelectItem>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {(selectedCountry !== "all" || selectedIndustry !== "all" || selectedYear !== "all") && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedCountry("all");
                                            setSelectedIndustry("all");
                                            setSelectedYear("all");
                                        }}
                                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Major Shows Section */}
            {searchTerm === "" && selectedCountry === "all" && selectedIndustry === "all" && (
                <section className="py-16 bg-background-gray">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center px-4 py-2 bg-primary-blue/10 rounded-full text-primary-blue text-sm font-medium mb-4">
                                <FiStar className="w-4 h-4 mr-2" />
                                Premier Exhibitions
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-4">
                                Major International Trade Shows
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Industry-leading exhibitions featuring global audiences and exceptional networking opportunities.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {majorShows.slice(0, 6).map((show) => (
                                <Link key={show.id} href={`/trade-shows/${show.slug}`} className="group">
                                    <Card className="hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border-0 shadow-lg h-full">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <Badge
                                                    variant="secondary"
                                                    style={{
                                                        backgroundColor: (show.industries[0]?.color || "#3B82F6") + "15",
                                                        color: show.industries[0]?.color || "#3B82F6",
                                                        border: `1px solid ${show.industries[0]?.color || "#3B82F6"}30`,
                                                    }}
                                                    className="font-medium"
                                                >
                                                    {show.industries[0]?.icon} {show.industries[0]?.name}
                                                </Badge>
                                                <Badge variant="outline" className="bg-warning-orange/10 text-warning-orange">
                                                    {show.significance}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-primary-blue transition-colors font-bold">
                                                {show.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <FiMapPin className="w-4 h-4 mr-3 text-primary-blue" />
                                                    {show.city}, {show.country}
                                                </div>
                                                <div className="flex items-center">
                                                    <FiCalendar className="w-4 h-4 mr-3 text-primary-blue" />
                                                    {TradeShowUtils.formatDate(show.startDate)}
                                                </div>
                                                <div className="flex items-center">
                                                    <FiUsers className="w-4 h-4 mr-3 text-primary-blue" />
                                                    {show.expectedVisitors.toLocaleString()} Expected Visitors
                                                </div>
                                                <p className="text-gray-700 line-clamp-2 mt-3">{show.description}</p>
                                            </div>
                                            <div className="mt-4 pt-4 border-t">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    View Details
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Shows Grid */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-4">
                            {filteredShows.length} Professional Trade Shows
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredShows.map((show) => (
                            <Link key={show.id} href={`/trade-shows/${show.slug}`} className="group">
                                <Card className="h-full hover:shadow-lg transition-all duration-300 border border-gray-200">
                                    <CardHeader className="pb-3">
                                        <Badge variant="secondary" className="w-fit mb-2">
                                            {show.industries[0]?.name}
                                        </Badge>
                                        <CardTitle className="text-lg group-hover:text-primary-blue transition-colors font-semibold">
                                            {show.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <FiMapPin className="w-3 h-3 mr-2" />
                                                {show.city}, {show.country}
                                            </div>
                                            <div className="flex items-center">
                                                <FiCalendar className="w-3 h-3 mr-2" />
                                                {TradeShowUtils.formatDate(show.startDate)}
                                            </div>
                                            <p className="text-gray-700 text-xs line-clamp-2 mt-2">{show.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
