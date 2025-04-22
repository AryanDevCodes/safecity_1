import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck 
} from 'lucide-react';

interface CrimeStatCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down';
  trendValue: string;
  icon: 'alert' | 'shield';
  description?: string;
}

const CrimeStatCard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon, 
  description 
}: CrimeStatCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-2xl font-bold">
          {value}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center">
          {trend === 'down' ? (
            <div className="flex items-center text-green-600">
              <TrendingDown className="mr-1 h-4 w-4" />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          ) : (
            <div className="flex items-center text-emergency-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
          <span className="text-xs text-muted-foreground ml-1">vs last month</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
          <span>{description}</span>
          {icon === 'alert' ? (
            <AlertTriangle className="h-4 w-4 text-emergency-500" />
          ) : (
            <ShieldCheck className="h-4 w-4 text-police-500" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CrimeStatCard;
