import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import '../styles/market.css';

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

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const BAR_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Indian Internship Trends Dashboard</h1>
      </div>
      
      <div className="dashboard-grid">
        {/* Internship Demand by City */}
        <div className="dashboard-card">
          <h2>Internship Demand by City</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationDemandData}>
                <XAxis dataKey="location" tick={{ fill: '#E5E7EB' }} axisLine={{ stroke: '#4B5563' }} />
                <YAxis tick={{ fill: '#E5E7EB' }} axisLine={{ stroke: '#4B5563' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', borderRadius: '0.5rem', color: '#F3F4F6' }} />
                <Bar dataKey="internship_count" fill={BAR_COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Internship Demand by Domain */}
        <div className="dashboard-card">
          <h2>Internship Demand by Domain</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={domainDemandData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <XAxis dataKey="domain" tick={{ fill: '#E5E7EB', fontSize: 12 }} axisLine={{ stroke: '#4B5563' }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fill: '#E5E7EB' }} axisLine={{ stroke: '#4B5563' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', borderRadius: '0.5rem', color: '#F3F4F6' }} />
                <Bar dataKey="demand" fill={BAR_COLORS[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stipend by Location */}
        <div className="dashboard-card">
          <h2>Average Stipend by Location (₹)</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stipendByLocationData}>
                <XAxis dataKey="location" tick={{ fill: '#E5E7EB' }} axisLine={{ stroke: '#4B5563' }} />
                <YAxis tick={{ fill: '#E5E7EB' }} axisLine={{ stroke: '#4B5563' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', borderRadius: '0.5rem', color: '#F3F4F6' }} />
                <Bar dataKey="avg_stipend" fill={BAR_COLORS[2]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Demand */}
        <div className="dashboard-card">
          <h2>Skill Demand</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={skillDemandData} 
                  dataKey="demand" 
                  nameKey="skill" 
                  cx="50%" cy="50%"
                  outerRadius={100} innerRadius={60}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {skillDemandData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ color: '#E5E7EB', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', borderRadius: '0.5rem', color: '#F3F4F6' }} formatter={(value, name, props) => [`${value}%`, props.payload.skill]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Internship Duration Distribution */}
        <div className="dashboard-card">
          <h2>Internship Duration Distribution</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={durationDistributionData}>
                <XAxis dataKey="duration" tick={{ fill: '#E5E7EB' }} axisLine={{ stroke: '#4B5563' }} />
                <YAxis tick={{ fill: '#E5E7EB' }} axisLine={{ stroke: '#4B5563' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', borderRadius: '0.5rem', color: '#F3F4F6' }} />
                <Bar dataKey="count" fill={BAR_COLORS[3]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Distribution */}
        <div className="dashboard-card">
          <h2>Industries Offering Internships</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={industryDistributionData} 
                  dataKey="count" 
                  nameKey="industry" 
                  cx="50%" cy="50%"
                  outerRadius={100} innerRadius={60}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {industryDistributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ color: '#E5E7EB', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', borderRadius: '0.5rem', color: '#F3F4F6' }} formatter={(value, name, props) => [`${value}%`, props.payload.industry]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="dashboard-footer">
        <p>Data last updated: {new Date().toLocaleString()}</p>
        <p>Total internships analyzed: 4,200</p>
      </div>
    </div>
  );
};

export default InternshipDashboard;
