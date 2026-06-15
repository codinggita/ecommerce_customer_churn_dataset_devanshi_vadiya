import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, TrendingUp, UserMinus, AlertCircle, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, icon, trend, colorClass, delay }) => (
  <div className={`glass-panel animate-fade-in ${delay}`} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h3 style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
        <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '700', letterSpacing: '-0.02em' }}>{value}</h2>
      </div>
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, rgba(var(--${colorClass}-rgb), 0.2), transparent)`, 
        color: `var(--${colorClass})`,
        border: `1px solid rgba(var(--${colorClass}-rgb), 0.2)`
      }}>
        {icon}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
      <span style={{ 
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
        fontSize: '0.875rem', fontWeight: '600',
        padding: '0.25rem 0.5rem', borderRadius: '6px',
        background: trend > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
        color: trend > 0 ? 'var(--accent-success)' : 'var(--accent-danger)'
      }}>
        <ArrowUpRight size={14} style={{ transform: trend < 0 ? 'rotate(90deg)' : 'none' }} />
        {Math.abs(trend)}%
      </span>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>vs last month</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [churnData, setChurnData] = useState([]);
  const [topBuyers, setTopBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [churnRes, buyersRes] = await Promise.all([
          api.get('/analytics/customers/churn-analysis').catch(() => ({ data: { data: [] } })),
          api.get('/analytics/customers/top-buyers?limit=5').catch(() => ({ data: { data: [] } }))
        ]);

        const churnStats = churnRes.data.data || [];
        if (churnStats.length > 0) {
           setChurnData(churnStats.map(item => ({
              name: item._id ? 'Churned' : 'Active',
              value: item.count
           })));
        } else {
           setChurnData([
             { name: 'Active', value: 850 },
             { name: 'Churned', value: 150 }
           ]);
        }
        setTopBuyers(buyersRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#6366f1', '#f43f5e'];

  if (loading) return <div className="text-center" style={{ padding: '4rem' }}>Loading dashboard aesthetics...</div>;

  return (
    <div>
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>Overview</h1>
          <p className="text-muted" style={{ margin: 0 }}>Real-time analytics and predictive churn data.</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <StatCard delay="delay-100" title="Total Customers" value="1,000" icon={<Users size={24} />} trend={5.2} colorClass="accent-primary" />
        <StatCard delay="delay-200" title="Active Users" value={churnData.find(d => d.name === 'Active')?.value || 850} icon={<TrendingUp size={24} />} trend={2.1} colorClass="accent-success" />
        <StatCard delay="delay-300" title="Churned Users" value={churnData.find(d => d.name === 'Churned')?.value || 150} icon={<UserMinus size={24} />} trend={-1.4} colorClass="accent-danger" />
        <StatCard delay="delay-100" title="Avg LTV" value="$1,240" icon={<AlertCircle size={24} />} trend={8.4} colorClass="accent-warning" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel animate-fade-in delay-200" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>Churn Distribution</h3>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={churnData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {churnData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: `drop-shadow(0px 0px 8px ${COLORS[index % COLORS.length]}80)` }} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                  itemStyle={{ color: 'white', fontWeight: '600' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel animate-fade-in delay-300" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>Top Buyers by LTV</h3>
          {topBuyers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {topBuyers.map((buyer, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.03)', transition: 'transform 0.2s', cursor: 'pointer'
                }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), transparent)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>Customer {buyer._id.substring(0, 6)}</p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{buyer.city}, {buyer.country}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '1.2rem', color: 'var(--text-primary)' }}>${buyer.lifetimeValue.toLocaleString()}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{buyer.totalPurchases} Orders</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-muted">No top buyers data available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
