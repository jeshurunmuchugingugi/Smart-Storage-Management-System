import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, AreaChart, Area } from 'recharts';

const Reports = ({ units, bookings, payments }) => {
  // Storage utilization over time (Area Chart)
  const storageUtilization = [
    { month: 'Jan', occupied: 45, available: 83 },
    { month: 'Feb', occupied: 52, available: 76 },
    { month: 'Mar', occupied: 58, available: 70 },
    { month: 'Apr', occupied: 65, available: 63 },
    { month: 'May', occupied: 71, available: 57 },
    { month: 'Jun', occupied: 75, available: 53 },
    { month: 'Jul', occupied: 78, available: 50 },
    { month: 'Aug', occupied: 82, available: 46 },
    { month: 'Sep', occupied: 89, available: 39 }
  ];

  // Unit sizes distribution (Pie Chart)
  const unitSizeData = units.reduce((acc, u) => {
    const size = u.size || 'Unknown';
    const existing = acc.find(item => item.name === size);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: `${size} m²`, value: 1 });
    }
    return acc;
  }, []);

  // Customer growth trend
  const customerGrowth = [
    { month: 'Jan', customers: 15 },
    { month: 'Feb', customers: 28 },
    { month: 'Mar', customers: 45 },
    { month: 'Apr', customers: 67 },
    { month: 'May', customers: 92 },
    { month: 'Jun', customers: 124 },
    { month: 'Jul', customers: 158 },
    { month: 'Aug', customers: 201 },
    { month: 'Sep', customers: 248 }
  ];

  // Payment status (Horizontal Bar)
  const paymentStatusData = payments.reduce((acc, p) => {
    const status = p.status || 'Unknown';
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.count += 1;
      existing.amount += parseFloat(p.amount || 0);
    } else {
      acc.push({ 
        name: status.charAt(0).toUpperCase() + status.slice(1), 
        count: 1,
        amount: parseFloat(p.amount || 0)
      });
    }
    return acc;
  }, []);

  // Monthly bookings trend (Line Chart)
  const monthlyBookings = [
    { month: 'Jan', bookings: 8 },
    { month: 'Feb', bookings: 12 },
    { month: 'Mar', bookings: 15 },
    { month: 'Apr', bookings: 22 },
    { month: 'May', bookings: 28 },
    { month: 'Jun', bookings: 35 },
    { month: 'Jul', bookings: 42 },
    { month: 'Aug', bookings: 48 },
    { month: 'Sep', bookings: 54 }
  ];

  // Unit occupancy rate over time (Area Chart)
  const occupancyRate = [
    { month: 'Jan', rate: 45 },
    { month: 'Feb', rate: 52 },
    { month: 'Mar', rate: 58 },
    { month: 'Apr', rate: 65 },
    { month: 'May', rate: 71 },
    { month: 'Jun', rate: 75 },
    { month: 'Jul', rate: 78 },
    { month: 'Aug', rate: 82 },
    { month: 'Sep', rate: 85 }
  ];

  const COLORS = ['#8B0000', '#1e3a8a', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2>Analytics & Reports</h2>
        <p>Comprehensive data visualization and insights</p>
      </div>

      <div className="reports-grid">
        {/* Storage Utilization Over Time - Stacked Area Chart */}
        <div className="report-card large">
          <h3>Storage Utilization Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={storageUtilization}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value) => `${value} units`}
              />
              <Legend verticalAlign="top" height={36} />
              <Area 
                type="monotone" 
                dataKey="occupied" 
                stackId="1"
                stroke="#8B0000" 
                fill="#8B0000" 
                fillOpacity={0.8}
                isAnimationActive={false}
              />
              <Area 
                type="monotone" 
                dataKey="available" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Unit Sizes Distribution - Pie Chart */}
        <div className="report-card">
          <h3>Unit Sizes Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={unitSizeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                isAnimationActive={false}
              >
                {unitSizeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Growth - Line Chart */}
        <div className="report-card">
          <h3>Customer Growth Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={customerGrowth}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                interval={2}
                tick={{fontSize: 12}}
              />
              <YAxis axisLine={false} tickLine={false} domain={[0, 300]} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value) => [`${value} customers`, 'Total']}
              />
              <Line 
                type="monotone" 
                dataKey="customers" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 6 }}
                activeDot={{ r: 8 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status - Horizontal Bar */}
        <div className="report-card large">
          <h3>Payment Status Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paymentStatusData} layout="vertical">
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value, name) => [
                  name === 'count' ? `${value} payments` : `KSh ${value.toLocaleString()}`,
                  name === 'count' ? 'Count' : 'Amount'
                ]}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} isAnimationActive={false}>
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Bookings Trend - Line Chart */}
        <div className="report-card">
          <h3>Monthly Bookings Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyBookings}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#1e3a8a" 
                strokeWidth={3}
                dot={{ fill: '#1e3a8a', r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Rate - Area Chart */}
        <div className="report-card">
          <h3>Unit Occupancy Rate (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={occupancyRate}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value) => `${value}%`}
              />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.4}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`
        .reports-page {
          padding: 0;
        }

        .reports-header {
          margin-bottom: 30px;
        }

        .reports-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .reports-header p {
          color: #6b7280;
          font-size: 14px;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .report-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .report-card.large {
          grid-column: span 2;
        }

        .report-card h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }

        @media (max-width: 1200px) {
          .reports-grid {
            grid-template-columns: 1fr;
          }
          
          .report-card.large {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;
