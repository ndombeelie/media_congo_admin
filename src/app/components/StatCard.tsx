import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: IconDefinition;
  iconColor?: string;
  trend?: string;
}

export default function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  iconColor = 'text-gray-500',
  trend 
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 border-white/20 bg-white/80 backdrop-blur-sm group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm">{title}</CardTitle>
        <div className={`${iconColor} text-2xl transition-all duration-300 group-hover:scale-125 group-hover:rotate-12`}>
          <FontAwesomeIcon icon={icon} className="drop-shadow-lg" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl mb-1 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {trend && (
          <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>
        )}
      </CardContent>
    </Card>
  );
}