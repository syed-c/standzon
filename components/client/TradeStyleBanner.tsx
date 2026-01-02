'use client';

import React from 'react';
import { sanitizeHtml } from '@/lib/utils/html';
import { FiCalendar, FiMapPin, FiUsers, FiTrendingUp, FiSearch } from 'react-icons/fi';
import { Input } from '@/components/shared/input';

type StatItem = {
	icon: 'calendar' | 'map-pin' | 'users' | 'chart-line';
	value: string;
	label: string;
	color?: string;
};

interface TradeStyleBannerProps {
	badgeText?: string;
	mainHeading: string;
	highlightHeading: string;
	description: string;
	stats?: StatItem[];
	showSearch?: boolean;
	searchPlaceholder?: string;
}

export default function TradeStyleBanner({
	badgeText = 'Professional Trade Show Database',
	mainHeading,
	highlightHeading,
	description,
	stats = [],
	showSearch = true,
	searchPlaceholder = 'Search by show name, city, industry, or venue...'
}: TradeStyleBannerProps) {
	return (
		<section className="pt-20 pb-16 bg-gradient-to-b from-[#1a2b45] to-[#204e80] text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<div className="inline-flex items-center px-4 py-2 bg-[#2c3e55] rounded-full text-sm font-medium mb-6">
						{badgeText}
					</div>
					<h1 className="text-3xl md:text-4xl font-bold mb-6">
						{mainHeading}
						<span className="block" style={{ color: '#2ec4b6' }}>{highlightHeading}</span>
					</h1>
                    <p
                        className="text-lg md:text-xl text-[#cfd8e3] mb-8 max-w-3xl mx-auto"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
                    />

					{stats && stats.length > 0 && (
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-lg mb-8">
							{stats.map((s, idx) => (
								<div key={idx} className="flex flex-col items-center space-y-2">
									<div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: (s.color || '#2ec4b6') + '20' }}>
										{renderIcon(s.icon, s.color)}
									</div>
									<span className="font-semibold">{s.value}</span>
									<span className="text-gray-200 text-sm">{s.label}</span>
								</div>
							))}
						</div>
					)}

					{showSearch && (
						<div className="max-w-2xl mx-auto">
							<div className="relative">
								<FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
								<Input
									type="text"
									placeholder={searchPlaceholder}
									className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 text-[#1a2b45] placeholder-gray-500 shadow-lg"
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

function renderIcon(icon: StatItem['icon'], color?: string) {
	const cls = `w-6 h-6`;
	switch (icon) {
		case 'calendar':
			return <FiCalendar className={cls} style={{ color: color || '#2ec4b6' }} />;
		case 'map-pin':
			return <FiMapPin className={cls} style={{ color: color || '#3dd598' }} />;
		case 'users':
			return <FiUsers className={cls} style={{ color: color || '#f4a261' }} />;
		case 'chart-line':
			return <FiTrendingUp className={cls} style={{ color: color || '#a06cd5' }} />;
		default:
			return null;
	}
}


