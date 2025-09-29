import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import Navbar from '../components/Navbar';
import '../styles/market.css'

const InternshipDashboard = () => {
    // Internship Demand by City
    const locationDemandData = [
        { location: 'Bangalore', internship_count: 1200 },
        { location: 'Pune', internship_count: 950 },
        { location: 'Delhi NCR', internship_count: 800 },
        { location: 'Hyderabad', internship_count: 700 },
        { location: 'Chennai', internship_count: 500 }
    ];

    // Internship demand by domain
    const domainDemandData = [
        { domain: 'Software Development', demand: 980 },
        { domain: 'Data Science', demand: 720 },
        { domain: 'UI/UX Design', demand: 460 },
        { domain: 'Product Management', demand: 350 },
        { domain: 'Digital Marketing', demand: 540 },
        { domain: 'Cloud/DevOps', demand: 400 }
    ];

    // Average stipend by city (in ₹ per month)
    const stipendByLocationData = [
        { location: 'Bangalore', avg_stipend: 15000 },
        { location: 'Pune', avg_stipend: 12000 },
        { location: 'Delhi NCR', avg_stipend: 10000 },
        { location: 'Hyderabad', avg_stipend: 11000 },
        { location: 'Chennai', avg_stipend: 9000 }
    ];

    // Skill demand for internships
    const skillDemandData = [
        { skill: 'Python', demand: 22 },
        { skill: 'JavaScript', demand: 18 },
        { skill: 'React', demand: 15 },
        { skill: 'SQL', demand: 12 },
        { skill: 'Machine Learning', demand: 14 },
        { skill: 'Figma', demand: 9 }
    ];

    // Internship duration preferences
    const durationDistributionData = [
        { duration: '1-2 months', count: 2200 },
        { duration: '3-6 months', count: 1400 },
        { duration: '6+ months', count: 600 }
    ];

    // Industry offering internships
    const industryDistributionData = [
        { industry: 'IT Services', count: 35 },
        { industry: 'Finance', count: 15 },
        { industry: 'EdTech', count: 18 },
        { industry: 'E-commerce', count: 20 },
        { industry: 'Healthcare', count: 12 }
    ];

    const COLORS = ['#FF9933', '#138808', '#4F46E5', '#EF4444', '#8B5CF6', '#EC4899'];
    const BAR_COLORS = ['#FF9933', '#138808', '#FF6B35', '#059669', '#F59E0B'];

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background: "linear-gradient(to right, rgba(255,153,51,0.15) 0%, rgba(255,255,255,0.95) 33%, rgba(255,255,255,0.95) 67%, rgba(19,136,8,0.15) 100%)",
            }}
        >
            {/* Decorative Pattern Overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main className="p-6 flex-grow relative z-10">
                <div className="max-w-7xl mx-auto">

                    {/* Header Section */}
                    <div className="rounded-2xl shadow-lg p-8 mb-8 text-center bg-white/95 backdrop-blur-md border border-orange-100/50">
                        <div className="flex items-center justify-center mb-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center mr-3 shadow-md"
                                style={{
                                    background: "linear-gradient(135deg, #FF9933 0%, #FF6B35 100%)",
                                }}
                            >
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h1
                                className="text-4xl font-bold"
                                style={{
                                    fontFamily: "Playfair Display, serif",
                                    background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text"
                                }}
                            >
                                Internship Market Insights
                            </h1>
                        </div>

                        <div className="flex items-center justify-center mb-4">
                            <div className="flex space-x-1">
                                <div className="w-3 h-1 rounded-full bg-orange-400"></div>
                                <div className="w-8 h-1 rounded-full bg-blue-500"></div>
                                <div className="w-3 h-1 rounded-full bg-green-500"></div>
                            </div>
                        </div>

                        <p
                            className="text-lg max-w-3xl mx-auto leading-relaxed"
                            style={{
                                fontFamily: "Inter, sans-serif",
                                color: "#4B5563",
                                lineHeight: "1.7"
                            }}
                        >
                            Real-time analytics and trends from India's dynamic internship ecosystem.
                            <span className="font-medium text-orange-600"> Data-driven insights to guide your career decisions.</span>
                        </p>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="dashboard-grid">
                        {/* Skill Demand */}
                        <div className="dashboard-card">
                            <div className="flex items-center mb-4">
                                <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
                                <h2
                                    className="text-xl font-semibold"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        color: "#1F2937"
                                    }}
                                >
                                    Skill Demand Distribution
                                </h2>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={skillDemandData}
                                            dataKey="demand"
                                            nameKey="skill"
                                            cx="50%" cy="50%"
                                            outerRadius={80} innerRadius={40}
                                            paddingAngle={2}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {skillDemandData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderColor: '#E5E7EB',
                                                borderRadius: '0.5rem',
                                                color: '#1F2937',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                            formatter={(value, name, props) => [`${value}%`, props.payload.skill]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>



                        {/* Internship Demand by City */}
                        <div className="dashboard-card">
                            <div className="flex items-center mb-4">
                                <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
                                <h2
                                    className="text-xl font-semibold"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        color: "#1F2937"
                                    }}
                                >
                                    Internship Demand by City
                                </h2>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={locationDemandData}>
                                        <XAxis dataKey="location" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#D1D5DB' }} />
                                        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#D1D5DB' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderColor: '#E5E7EB',
                                                borderRadius: '0.5rem',
                                                color: '#1F2937',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="internship_count" fill={BAR_COLORS[0]} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Internship Duration Distribution */}
                        <div className="dashboard-card">
                            <div className="flex items-center mb-4">
                                <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
                                <h2
                                    className="text-xl font-semibold"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        color: "#1F2937"
                                    }}
                                >
                                    Internship Duration Distribution
                                </h2>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={durationDistributionData}>
                                        <XAxis dataKey="duration" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#D1D5DB' }} />
                                        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#D1D5DB' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderColor: '#E5E7EB',
                                                borderRadius: '0.5rem',
                                                color: '#1F2937',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="count" fill={BAR_COLORS[3]} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Stipend by Location */}
                        <div className="dashboard-card">
                            <div className="flex items-center mb-4">
                                <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                                <h2
                                    className="text-xl font-semibold"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        color: "#1F2937"
                                    }}
                                >
                                    Average Stipend by Location (₹)
                                </h2>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stipendByLocationData}>
                                        <XAxis dataKey="location" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#D1D5DB' }} />
                                        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#D1D5DB' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderColor: '#E5E7EB',
                                                borderRadius: '0.5rem',
                                                color: '#1F2937',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="avg_stipend" fill={BAR_COLORS[2]} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>




                        {/* Internship Demand by Domain */}
                        <div className="dashboard-card">
                            <div className="flex items-center mb-4">
                                <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                                <h2
                                    className="text-xl font-semibold"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        color: "#1F2937"
                                    }}
                                >
                                    Internship Demand by Domain
                                </h2>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={domainDemandData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                        <XAxis
                                            dataKey="domain"
                                            tick={{ fill: '#6B7280', fontSize: 10 }}
                                            axisLine={{ stroke: '#D1D5DB' }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={100}
                                        />
                                        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#D1D5DB' }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderColor: '#E5E7EB',
                                                borderRadius: '0.5rem',
                                                color: '#1F2937',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="demand" fill={BAR_COLORS[1]} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Industry Distribution */}
                        <div className="dashboard-card">
                            <div className="flex items-center mb-4">
                                <div className="w-1 h-6 bg-pink-500 rounded-full mr-3"></div>
                                <h2
                                    className="text-xl font-semibold"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        color: "#1F2937"
                                    }}
                                >
                                    Industries Offering Internships
                                </h2>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={industryDistributionData}
                                            dataKey="count"
                                            nameKey="industry"
                                            cx="50%" cy="50%"
                                            outerRadius={80} innerRadius={40}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {industryDistributionData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderColor: '#E5E7EB',
                                                borderRadius: '0.5rem',
                                                color: '#1F2937',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                            formatter={(value, name, props) => [`${value}%`, props.payload.industry]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                        </div>

                    </div>


                    {/* Footer Stats */}
                    <div className="mt-8 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100/50">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="text-center md:text-left">
                                <p
                                    className="text-sm text-gray-500"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                    Data last updated: {new Date().toLocaleString()}
                                </p>
                                <p
                                    className="text-sm text-gray-500 mt-1"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                    Total internships analyzed: 4,200
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-center">
                                    <div
                                        className="text-2xl font-bold"
                                        style={{
                                            fontFamily: "Playfair Display, serif",
                                            background: "linear-gradient(135deg, #FF9933 0%, #138808 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}
                                    >
                                        92%
                                    </div>
                                    <div
                                        className="text-xs text-gray-500"
                                        style={{ fontFamily: "Inter, sans-serif" }}
                                    >
                                        Match Accuracy
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 bg-white/95 backdrop-blur-md border-t border-orange-100/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center space-y-4">
                        {/* Decorative Element */}
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full"></div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-orange-400 shadow-sm"></div>
                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                            </div>
                            <div className="w-8 h-0.5 bg-gradient-to-l from-green-400 to-green-300 rounded-full"></div>
                        </div>

                        {/* Footer Text */}
                        <div className="text-center">
                            <p
                                className="text-lg font-semibold"
                                style={{
                                    fontFamily: "Playfair Display, serif",
                                    background: "linear-gradient(135deg, #FF9933 0%, #138808 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text"
                                }}
                            >
                                भारत सरकार | Government of India
                            </p>
                            <p
                                className="text-sm text-gray-500 mt-1"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                Skill Development & Entrepreneurship Initiative
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default InternshipDashboard;