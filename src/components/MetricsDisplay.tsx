import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Zap, Shield, Atom, Sparkles } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

// Define the shape of a single set of metrics
interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  specificity: number;
  f1Score: number;
}

// Define the props for MetricsDisplay
interface MetricsDisplayProps {
  metrics: {
    qaum?: ModelMetrics; // Optional for QAUM only or QAOA only modes
    qaoa?: ModelMetrics; // Optional for QAOA only or QAUM only modes
  };
  evaluationMode: "qaum" | "qaoa" | "compare";
}

const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

const getScoreColor = (score: number) => {
  if (score >= 0.9) return "bg-green-500";
  if (score >= 0.8) return "bg-yellow-500";
  return "bg-red-500";
};

// Reusable component to render a single set of model metrics
const SingleModelMetrics = ({ modelName, metrics }: { modelName: string; metrics: ModelMetrics }) => {
  const metricItems = [
    {
      label: "Accuracy",
      value: metrics.accuracy,
      icon: Target,
      description: "Overall correctness",
    },
    {
      label: "Precision",
      value: metrics.precision,
      icon: Zap,
      description: "Relevant predictions",
    },
    {
      label: "Recall",
      value: metrics.recall,
      icon: TrendingUp,
      description: "Ability to find all relevant cases",
    },
    {
      label: "Specificity",
      value: metrics.specificity,
      icon: Shield,
      description: "Ability to identify true negatives",
    },
    {
      label: "F1 Score",
      value: metrics.f1Score,
      icon: Atom, // Changed to Atom for F1 Score
      description: "Harmonic mean of precision and recall",
    },
  ];

  const chartData = metricItems.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  return (
    <Card className="glass-effect p-4 h-full flex flex-col">
      <CardContent className="space-y-4 flex-grow">
        <h3 className="text-xl font-bold text-center mb-4 text-primary-foreground">{modelName} Metrics</h3>
        <div className="h-48"> {/* Fixed height for the chart */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /> {/* Darker grid */}
              <XAxis dataKey="name" stroke="#cbd5e0" /> {/* Light text for axes */}
              <YAxis stroke="#cbd5e0" domain={[0, 1]} tickFormatter={(value) => formatPercentage(value)} />
              <Tooltip
                formatter={(value: number) => formatPercentage(value)}
                contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '4px' }}
                labelStyle={{ color: '#cbd5e0' }}
              />
              <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} /> {/* Rounded top corners */}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4 mt-6">
          {metricItems.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between border-b border-border/30 pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <metric.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <p className="font-bold text-lg">{formatPercentage(metric.value)}</p>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getScoreColor(metric.value)} transition-all duration-300`}
                    style={{ width: `${metric.value * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


export const MetricsDisplay = ({ metrics, evaluationMode }: MetricsDisplayProps) => {
  if (!metrics) {
    return <p className="text-muted-foreground">No metrics to display.</p>;
  }

  // Prepare data for the comparison radar chart
  const radarChartData = [
    {
      metric: "Accuracy",
      QAUM: metrics.qaum?.accuracy || 0,
      QAOA: metrics.qaoa?.accuracy || 0,
      fullMark: 1,
    },
    {
      metric: "Precision",
      QAUM: metrics.qaum?.precision || 0,
      QAOA: metrics.qaoa?.precision || 0,
      fullMark: 1,
    },
    {
      metric: "Recall",
      QAUM: metrics.qaum?.recall || 0,
      QAOA: metrics.qaoa?.recall || 0,
      fullMark: 1,
    },
    {
      metric: "Specificity",
      QAUM: metrics.qaum?.specificity || 0,
      QAOA: metrics.qaoa?.specificity || 0,
      fullMark: 1,
    },
    {
      metric: "F1 Score",
      QAUM: metrics.qaum?.f1Score || 0,
      QAOA: metrics.qaoa?.f1Score || 0,
      fullMark: 1,
    },
  ];

  return (
    <div className="w-full">
      {evaluationMode === "qaum" && metrics.qaum && (
        <SingleModelMetrics modelName="QAUM Model" metrics={metrics.qaum} />
      )}

      {evaluationMode === "qaoa" && metrics.qaoa && (
        <SingleModelMetrics modelName="QAOA Model" metrics={metrics.qaoa} />
      )}

      {evaluationMode === "compare" && metrics.qaum && metrics.qaoa && (
        <div className="space-y-6">
          <Card className="glass-effect p-4">
            <CardContent className="h-80"> {/* Fixed height for the radar chart */}
              <h3 className="text-xl font-bold text-center mb-4 text-primary-foreground">Model Comparison</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                  <PolarGrid stroke="#4a5568" /> {/* Darker grid lines */}
                  <PolarAngleAxis dataKey="metric" stroke="#cbd5e0" /> {/* Light text for labels */}
                  <PolarRadiusAxis angle={90} domain={[0, 1]} stroke="#cbd5e0" tickFormatter={(value) => formatPercentage(value)} />
                  <Radar name="QAUM Model" dataKey="QAUM" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="QAOA Model" dataKey="QAOA" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Tooltip
                    formatter={(value: number) => formatPercentage(value)}
                    contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '4px' }}
                    labelStyle={{ color: '#cbd5e0' }}
                  />
                  <Legend wrapperStyle={{ color: '#cbd5e0' }} /> {/* Legend for the models */}
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SingleModelMetrics modelName="QAUM Model" metrics={metrics.qaum} />
            <SingleModelMetrics modelName="QAOA Model" metrics={metrics.qaoa} />
          </div>
        </div>
      )}

      {/* Fallback for cases where data might be missing despite mode */}
      {((evaluationMode === "qaum" && !metrics.qaum) ||
        (evaluationMode === "qaoa" && !metrics.qaoa) ||
        (evaluationMode === "compare" && (!metrics.qaum || !metrics.qaoa))) && (
        <p className="text-muted-foreground text-center py-4">
          Evaluation results are not available for the selected mode.
        </p>
      )}
    </div>
  );
};