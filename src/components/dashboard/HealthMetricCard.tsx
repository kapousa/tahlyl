
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthMetric } from "@/types";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface HealthMetricCardProps {
  metric: HealthMetric;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({ metric }) => {
  const getTrendIcon = () => {
    switch (metric.trend) {
      case "up":
        return <ArrowUpIcon className="h-4 w-4" />;
      case "down":
        return <ArrowDownIcon className="h-4 w-4" />;
      default:
        return <MinusIcon className="h-4 w-4" />;
    }
  };

  const getTrendClass = () => {
    switch (metric.trend) {
      case "up":
        return metric.name.includes("Glucose") || metric.name.includes("Cholesterol") || metric.name.includes("Blood Pressure") 
          ? "health-metric-trend negative" 
          : "health-metric-trend positive";
      case "down":
        return metric.name.includes("Glucose") || metric.name.includes("Cholesterol") || metric.name.includes("Blood Pressure") 
          ? "health-metric-trend positive" 
          : "health-metric-trend negative";
      default:
        return "health-metric-trend neutral";
    }
  };

  const getStatusClass = () => {
    switch (metric.status) {
      case "normal":
        return "bg-health-secondary/10 text-health-secondary";
      case "warning":
        return "bg-health-warning/10 text-health-warning";
      case "critical":
        return "bg-health-danger/10 text-health-danger";
      default:
        return "bg-health-gray/10 text-health-gray";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{metric.name}</CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
            {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-end justify-between">
          <div className="health-metric">
            <span className="health-metric-value">{metric.value} <span className="text-sm font-normal">{metric.unit}</span></span>
            <span className={getTrendClass()}>
              {getTrendIcon()}
              {metric.change > 0 && "+"}{metric.change} from previous
            </span>
          </div>
        </div>
        
        <div className="h-[100px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={metric.history}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value) => [`${value} ${metric.unit}`, metric.name]}
                labelFormatter={(label) => formatDate(label)}
              />
              <defs>
                <linearGradient id={`color-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0e98eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0e98eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#0e98eb" 
                fillOpacity={1}
                fill={`url(#color-${metric.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetricCard;
