import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faEye, faChartBar, faPercentage } from '@fortawesome/free-solid-svg-icons';
import StatCard from './StatCard';
import { apiService } from '@/services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const [period, setPeriod] = useState('daily');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      const data = await apiService.fetchStats(period);
      setStats(data);
      setIsLoading(false);
    };
    loadStats();
  }, [period]);

  if (isLoading || !stats) {
    return <div className="p-8 text-center text-blue-600 animate-pulse font-medium">Chargement des statistiques...</div>;
  }

  const data = stats.chartData;
  const totalPublications = stats.totalPublications;
  const totalViews = stats.totalViews;

  // Calculer le taux d'engagement réel : (Likes + Commentaires) / Vues
  const totalInteractions = stats.totalLikes + stats.totalComments;
  const engagementRate = totalViews > 0 ? (totalInteractions / totalViews) * 100 : 0;

  const statsDataForPie = [
    { name: 'Vues', value: stats.totalViews },
    { name: 'Likes', value: stats.totalLikes },
    { name: 'Commentaires', value: stats.totalComments },
    { name: 'Engagement', value: totalInteractions },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h2 className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard Général</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sélectionner la période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Par Jour</SelectItem>
            <SelectItem value="weekly">Par Semaine</SelectItem>
            <SelectItem value="monthly">Par Mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Publications"
          value={totalPublications}
          description={period === 'daily' ? 'Cette semaine' : period === 'weekly' ? 'Ce mois' : 'Cette année'}
          icon={faFileAlt}
          iconColor="text-blue-500"
        />

        <StatCard
          title="Total Vues"
          value={totalViews.toLocaleString()}
          description="Vues cumulées"
          icon={faEye}
          iconColor="text-green-500"
        />

        <StatCard
          title="Moyenne Vues/Pub"
          value={totalPublications > 0 ? Math.floor(totalViews / totalPublications) : 0}
          description="Par publication"
          icon={faChartBar}
          iconColor="text-purple-500"
        />

        <StatCard
          title="Taux d'Engagement"
          value={`${engagementRate.toFixed(2)}%`}
          description="Likes + Commentaires / Vues"
          icon={faPercentage}
          iconColor="text-orange-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Publications et Vues
            </CardTitle>
            <CardDescription>Évolution selon la période sélectionnée</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey={period === 'daily' ? 'jour' : period === 'weekly' ? 'semaine' : 'mois'} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="publications" fill="url(#colorPublications)" name="Publications" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="vues" fill="url(#colorVues)" name="Vues" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorPublications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorVues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Tendance des Vues
            </CardTitle>
            <CardDescription>Évolution dans le temps</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey={period === 'daily' ? 'jour' : period === 'weekly' ? 'semaine' : 'mois'} />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="vues" stroke="url(#colorLine)" strokeWidth={3} name="Vues" dot={{ fill: '#8b5cf6', r: 5 }} activeDot={{ r: 8 }} />
                <defs>
                  <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Statistiques Générales d'Engagement
          </CardTitle>
          <CardDescription>Répartition des interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statsDataForPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statsDataForPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}