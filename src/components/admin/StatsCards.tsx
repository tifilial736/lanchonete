import { useQuery } from '@tanstack/react-query';
import { Sandwich, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Stats {
  totalProducts: number;
  todayOrders: number;
  todayRevenue: string;
  averageOrderValue: string;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  const statsData = [
    {
      icon: Sandwich,
      label: 'Produtos',
      value: stats?.totalProducts || 0,
      color: 'bg-primary/10 text-primary',
      testId: 'stat-products',
    },
    {
      icon: ShoppingCart,
      label: 'Pedidos Hoje',
      value: stats?.todayOrders || 0,
      color: 'bg-secondary/10 text-secondary',
      testId: 'stat-orders',
    },
    {
      icon: DollarSign,
      label: 'Receita Hoje',
      value: `R$ ${stats?.todayRevenue || '0,00'}`,
      color: 'bg-green-100 text-green-600',
      testId: 'stat-revenue',
    },
    {
      icon: Clock,
      label: 'Ticket Médio',
      value: `R$ ${stats?.averageOrderValue || '0,00'}`,
      color: 'bg-blue-100 text-blue-600',
      testId: 'stat-average',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p 
                  className="text-2xl font-bold text-foreground"
                  data-testid={stat.testId}
                >
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
