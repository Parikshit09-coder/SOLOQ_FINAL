
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

interface ComparisonChartProps {
  qaumMetrics: {
    accuracy: number;
    precision: number;
    recall: number;
    specificity: number;
    f1Score: number;
  };
  qaoaMetrics: {
    accuracy: number;
    precision: number;
    recall: number;
    specificity: number;
    f1Score: number;
  };
}

export const ComparisonChart = ({ qaumMetrics, qaoaMetrics }: ComparisonChartProps) => {
  const data = [
    {
      metric: "Accuracy",
      QAUM: qaumMetrics.accuracy * 100,
      QAOA: qaoaMetrics.accuracy * 100,
    },
    {
      metric: "Precision",
      QAUM: qaumMetrics.precision * 100,
      QAOA: qaoaMetrics.precision * 100,
    },
    {
      metric: "Recall",
      QAUM: qaumMetrics.recall * 100,
      QAOA: qaoaMetrics.recall * 100,
    },
    {
      metric: "Specificity",
      QAUM: qaumMetrics.specificity * 100,
      QAOA: qaoaMetrics.specificity * 100,
    },
    {
      metric: "F1 Score",
      QAUM: qaumMetrics.f1Score * 100,
      QAOA: qaoaMetrics.f1Score * 100,
    },
  ];

  const chartConfig = {
    QAUM: {
      label: "QAUM",
      color: "hsl(var(--primary))",
    },
    QAOA: {
      label: "QAOA", 
      color: "hsl(var(--accent))",
    },
  };

  return (
    <div className="w-full h-96">
      <ChartContainer config={chartConfig}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis 
            domain={[0, 100]} 
            tick={false}
            axisLine={false}
          />
          <Radar
            name="QAUM"
            dataKey="QAUM"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar
            name="QAOA"
            dataKey="QAOA"
            stroke="hsl(var(--accent))"
            fill="hsl(var(--accent))"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
        </RadarChart>
      </ChartContainer>
    </div>
  );
};
