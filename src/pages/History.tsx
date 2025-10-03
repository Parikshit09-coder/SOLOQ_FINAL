import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Atom, LogOut, BookOpen, Target, TrendingUp, Zap, 
  Shield, Sparkles, BarChart3, PieChart as PieChartIcon
} from "lucide-react";

import { useEffect, useState } from "react";
import {
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

const staticLogs = [
  {"timestamp":"2025-07-21T15:48:38.977Z","modelType":"SoloQ","modelFile":"final_SoloQ_model_.pkl","csvFile":"test.csv","result":{"accuracy":0.88,"precision":0.975,"recall":0.78,"specificity":0.98,"f1_score":0.8666666667}},
  {"timestamp":"2025-07-21T15:50:39.749Z","modelType":"SoloQ","modelFile":"final_SoloQ_model_.pkl","csvFile":"test.csv","result":{"accuracy":0.88,"precision":0.975,"recall":0.78,"specificity":0.98,"f1_score":0.8666666667}},
  {"timestamp":"2025-07-21T16:08:56.373Z","modelType":"QAOA","modelFile":"final_qaoa_model.pkl","csvFile":"test.csv","result":{"accuracy":0.865,"precision":0.9740259740,"recall":0.75,"specificity":0.98,"f1_score":0.8474576271}},
  {"timestamp":"2025-07-22T11:34:10.790Z","modelType":"SoloQ","modelFile":"final_SoloQ_model_.pkl","csvFile":"test.csv","result":{"accuracy":0.88,"precision":0.975,"recall":0.78,"specificity":0.98,"f1_score":0.8666666667}},
  {"timestamp":"2025-07-22T11:34:13.754Z","modelType":"SoloQ","modelFile":"final_SoloQ_model_.pkl","csvFile":"test.csv","result":{"accuracy":0.88,"precision":0.975,"recall":0.78,"specificity":0.98,"f1_score":0.8666666667}},
  {"timestamp":"2025-07-25T10:57:20.210Z","modelType":"SoloQ","modelFile":"final_SoloQ_model_.pkl","csvFile":"test.csv","result":{"accuracy":0.88,"precision":0.975,"recall":0.78,"specificity":0.98,"f1_score":0.8666666667}},
  {"timestamp":"2025-07-25T10:59:00.024Z","modelType":"SoloQ","modelFile":"pulsar_SoloQ_model.pkl","csvFile":"pulsar_test_data.csv","result":{"accuracy":0.875,"precision":0.9622641509,"recall":0.796875,"specificity":0.9642857143,"f1_score":0.8717948718}},
  {"timestamp":"2025-08-14T12:56:27.794Z","modelType":"SoloQ","modelFile":"final_SoloQ_model_.pkl","csvFile":"test.csv","result":{"accuracy":0.88,"precision":0.975,"recall":0.78,"specificity":0.98,"f1_score":0.8666666667}},
  {"timestamp":"2025-08-15T10:22:18.890Z","modelType":"SoloQ","modelFile":"final_SoloQ_model_.pkl","csvFile":"test.csv","result":{"accuracy":0.88,"precision":0.975,"recall":0.78,"specificity":0.98,"f1_score":0.8666666667}},
  {"timestamp":"2025-08-15T10:23:19.250Z","modelType":"QAOA","modelFile":"final_qaoa_model.pkl","csvFile":"test.csv","result":{"accuracy":0.865,"precision":0.9740259740,"recall":0.75,"specificity":0.98,"f1_score":0.8474576271}},
  {"timestamp":"2025-09-09T13:33:52.141Z","modelType":"SoloQ","modelFile":"final_SoloQ_model_.pkl","csvFile":"test.csv","result":{"accuracy":0.88,"precision":0.975,"recall":0.78,"specificity":0.98,"f1_score":0.8666666667}}
];

const History = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLogIndex, setSelectedLogIndex] = useState(0);
  const [chartType, setChartType] = useState("radar");

  // ✅ Load static logs
  useEffect(() => {
    setLogs(staticLogs);
  }, []);

  const formatDate = (timestamp: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(timestamp).toLocaleString(undefined, options);
  };

  const renderMetric = (label: string, value: string, icon: any) => (
    <div className="p-3 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-lg border border-slate-700 hover:border-primary/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-primary/20 text-primary">
          {icon}
        </div>
        <div>
          <p className="font-medium text-white">{label}</p>
          <p className="text-sm text-slate-300">{value}</p>
        </div>
      </div>
    </div>
  );

  const getChartData = (log: any) => {
    if (!log) return [];
    return [
      { metric: "Accuracy", value: log.result.accuracy, fullMark: 1 },
      { metric: "Precision", value: log.result.precision, fullMark: 1 },
      { metric: "Recall", value: log.result.recall, fullMark: 1 },
      { metric: "Specificity", value: log.result.specificity, fullMark: 1 },
      { metric: "F1 Score", value: log.result.f1_score, fullMark: 1 },
    ];
  };

  const renderChart = (log: any) => {
    const data = getChartData(log);
    if (!data.length) return null;

    switch (chartType) {
      case "radar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={data}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Radar 
                name="Performance" 
                dataKey="value" 
                stroke="#6366f1" 
                fill="#6366f1" 
                fillOpacity={0.6} 
                strokeWidth={2} 
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Legend />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ metric, value }) => `${metric}: ${(value * 100).toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444'][index % 5]} 
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case "radar": return <Target className="w-4 h-4" />;
      case "bar": return <BarChart3 className="w-4 h-4" />;
      case "pie": return <PieChartIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Atom className="h-8 w-8 text-primary animate-pulse" />
              <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SoloQ
              </h1>
              <p className="text-xs text-slate-400">Evaluation Logs</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300 hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">Evaluation History</h2>
          <p className="text-slate-400">
            {logs.length > 0 
              ? `Showing ${logs.length} evaluation${logs.length !== 1 ? 's' : ''}`
              : 'No evaluation logs available'}
          </p>
        </div>

        {logs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Log List */}
            <div className="space-y-4 lg:col-span-1">
              {logs.map((log, index) => (
                <Card 
                  key={index} 
                  className={`bg-slate-800/50 backdrop-blur-lg border-slate-700 cursor-pointer transition-all hover:border-primary/10 ${
                    selectedLogIndex === index ? 'border-primary/20 ring-8 ring-primary/40' : ''
                  }`}
                  onClick={() => setSelectedLogIndex(index)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center text-white">
                          <div className="p-2 rounded-lg bg-primary/20 mr-3">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          Evaluation #{logs.length - index}
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                          {formatDate(log.timestamp)}
                        </CardDescription>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        log.modelType === 'SoloQ' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'
                      }`}>
                        {log.modelType}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Log Details */}
            <div className="lg:col-span-2 space-y-6">
              {logs[selectedLogIndex] && (
                <>
                  <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Evaluation Details</CardTitle>
                      <CardDescription className="text-slate-400">
                        Detailed metrics for selected evaluation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-700/30 p-4 rounded-lg">
                          <p className="text-sm text-slate-400">Model File</p>
                          <p className="font-medium text-white">{logs[selectedLogIndex].modelFile}</p>
                        </div>
                        <div className="bg-slate-700/30 p-4 rounded-lg">
                          <p className="text-sm text-slate-400">Test Data</p>
                          <p className="font-medium text-white">{logs[selectedLogIndex].csvFile}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {renderMetric(
                          "Accuracy",
                          `${(logs[selectedLogIndex].result.accuracy * 100).toFixed(1)}%`,
                          <Target className="h-5 w-5 text-primary" />
                        )}
                        {renderMetric(
                          "Precision",
                          `${(logs[selectedLogIndex].result.precision * 100).toFixed(1)}%`,
                          <Zap className="h-5 w-5 text-primary" />
                        )}
                        {renderMetric(
                          "Recall",
                          `${(logs[selectedLogIndex].result.recall * 100).toFixed(1)}%`,
                          <TrendingUp className="h-5 w-5 text-primary" />
                        )}
                        {renderMetric(
                          "Specificity",
                          `${(logs[selectedLogIndex].result.specificity * 100).toFixed(1)}%`,
                          <Shield className="h-5 w-5 text-primary" />
                        )}
                        {renderMetric(
                          "F1 Score",
                          logs[selectedLogIndex].result.f1_score.toFixed(3),
                          <Target className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chart Visualization */}
                  <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-white text-xl mb-2">Performance Visualization</CardTitle>
                          <CardDescription className="text-slate-400">
                            Interactive charts to visualize evaluation metrics
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {["radar", "bar", "pie"].map((type) => (
                            <Button
                              key={type}
                              variant={chartType === type ? "default" : "outline"}
                              size="sm"
                              onClick={() => setChartType(type)}
                              className={`flex items-center gap-2 ${
                                chartType === type 
                                  ? "bg-primary hover:bg-primary/90" 
                                  : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                              }`}
                            >
                              {getChartIcon(type)}
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center">
                        {renderChart(logs[selectedLogIndex])}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
