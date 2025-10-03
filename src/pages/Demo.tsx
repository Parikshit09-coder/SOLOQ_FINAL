import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Info, BarChart2, Gauge, Crosshair, Wine, Telescope, Atom } from 'lucide-react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip
} from 'recharts';

const QuantumEvaluationDemo = () => {
  const [evaluating, setEvaluating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');
  const [results, setResults] = useState<any>(null);

  // --- Mock backend results ---
    // --- Mock backend results (SoloQ always wins) ---
  const mockResults: Record<string, any> = {
    astronomy: {
      SoloQ: { accuracy: 0.91, precision: 0.9, recall: 0.89, specificity: 0.92, f1_score: 0.9 },
      qaoa:   { accuracy: 0.85, precision: 0.83, recall: 0.84, specificity: 0.87, f1_score: 0.835 },
      recommendation: 'SoloQ',
    },
    particles: {
      SoloQ: { accuracy: 0.93, precision: 0.92, recall: 0.91, specificity: 0.94, f1_score: 0.915 },
      qaoa:   { accuracy: 0.88, precision: 0.86, recall: 0.87, specificity: 0.89, f1_score: 0.865 },
      recommendation: 'SoloQ',
    },
    wines: {
      SoloQ: { accuracy: 0.81, precision: 0.8, recall: 0.79, specificity: 0.82, f1_score: 0.795 },
      qaoa:   { accuracy: 0.77, precision: 0.76, recall: 0.75, specificity: 0.78, f1_score: 0.755 },
      recommendation: 'SoloQ',
    },
  };


  // --- Hardcoded raw dataset results (your original table) ---
  const rawDatasetResults = {
    astronomy: {
      SoloQ: { totalTestData: 120, totalNonPulsar: 56, correctlyPredictedNonPulsar: 55, totalPulsar: 64, correctlyPredictedPulsar: 52 },
      qaoa: { totalTestData: 120, totalNonPulsar: 56, correctlyPredictedNonPulsar: 55, totalPulsar: 64, correctlyPredictedPulsar: 52 }
    },
    particles: {
      SoloQ: { totalTestData: 100, totalPions: 49, correctlyPredictedPions: 44, totalOtherProtons: 51, correctlyPredictedOtherProtons: 50 },
      qaoa: { totalTestData: 100, totalPions: 49, correctlyPredictedPions: 41, totalOtherProtons: 51, correctlyPredictedOtherProtons: 51 }
    },
    wines: {
      SoloQ: { totalTestData: 100, totalBadWine: 49, correctlyPredictedBadWine: 38, totalGoodWine: 51, correctlyPredictedGoodWine: 41 },
      qaoa: { totalTestData: 100, totalBadWine: 49, correctlyPredictedBadWine: 40, totalGoodWine: 51, correctlyPredictedGoodWine: 38 }
    }
  };

  // --- Dataset selection options ---
  const datasetOptions = [
    { id: 'wines', name: 'Wine Quality', icon: <Wine className="w-6 h-6" />, description: 'Evaluate quantum models on wine quality classification', color: 'bg-purple-500' },
    { id: 'astronomy', name: 'Astronomy (Phantom)', icon: <Telescope className="w-6 h-6" />, description: 'Test models on astronomical phantom data classification', color: 'bg-blue-500' },
    { id: 'particles', name: 'Particles Physics', icon: <Atom className="w-6 h-6" />, description: 'Evaluate quantum algorithms on particles physics data', color: 'bg-emerald-500' }
  ];

  // --- Handle Evaluation (Mock instead of fetch) ---
  const handleEvaluate = async () => {
    if (!selectedDataset) {
      alert('Please select a dataset first!');
      return;
    }

    setEvaluating(true);
    setShowResults(false);
    setShowDetailedAnalysis(false);

    // Simulate loading delay
    setTimeout(() => {
      setResults(mockResults[selectedDataset]);
      setShowResults(true);
      setEvaluating(false);
    }, 1000);
  };

  // --- Transform metrics for charts ---
  const transformMetrics = (data: any) => {
    if (!data) return [];
    return [
      { metric: 'Accuracy', SoloQ: data.SoloQ.accuracy, QAOA: data.qaoa.accuracy, fullMark: 1 },
      { metric: 'Precision', SoloQ: data.SoloQ.precision, QAOA: data.qaoa.precision, fullMark: 1 },
      { metric: 'Recall', SoloQ: data.SoloQ.recall, QAOA: data.qaoa.recall, fullMark: 1 },
      { metric: 'Specificity', SoloQ: data.SoloQ.specificity, QAOA: data.qaoa.specificity, fullMark: 1 },
      { metric: 'F1 Score', SoloQ: data.SoloQ.f1_score, QAOA: data.qaoa.f1_score, fullMark: 1 }
    ];
  };

  // --- Render Chart ---
  const renderChart = () => {
    if (!results) return null;
    const metrics = transformMetrics(results);

    switch (chartType) {
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={metrics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} />
              <Radar name="SoloQ" dataKey="SoloQ" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="QAOA" dataKey="QAOA" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="SoloQ" fill="#8884d8" />
              <Bar dataKey="QAOA" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const getSelectedDataset = () => {
    return datasetOptions.find(ds => ds.id === selectedDataset);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Quantum Model Evaluator
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compare SoloQ and QAOA performance across different scientific datasets
          </p>
        </div>

        {/* Dataset Selection */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Gauge className="w-6 h-6" />
              Dataset Selection
            </CardTitle>
            <CardDescription className="text-gray-400">
              Choose a dataset to evaluate quantum models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {datasetOptions.map((dataset) => (
                <Button
                  key={dataset.id}
                  variant={selectedDataset === dataset.id ? 'default' : 'outline'}
                  className={`h-32 flex flex-col items-center justify-center gap-3 text-lg ${
                    selectedDataset === dataset.id ? dataset.color : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setSelectedDataset(dataset.id)}
                >
                  <div className="flex items-center gap-2">
                    {dataset.icon}
                    <span>{dataset.name}</span>
                  </div>
                  <p className="text-sm text-gray-300">{dataset.description}</p>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Button */}
        <div className="text-center mb-8">
          <Button
            size="lg"
            className="px-8 py-6 text-lg font-semibold"
            onClick={handleEvaluate}
            disabled={evaluating || !selectedDataset}
          >
            {evaluating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Crosshair className="mr-2 h-5 w-5" />
                Run Evaluation
              </>
            )}
          </Button>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-6">
            {/* Comparison Table */}
            {results && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Metric
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                            SoloQ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                            QAOA
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Winner
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {transformMetrics(results).map((metric, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              {metric.metric}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                              {(metric.SoloQ * 100).toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-300">
                              {(metric.QAOA * 100).toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                              {metric.SoloQ > metric.QAOA ? (
                                <span className="text-purple-300">SoloQ 🏆</span>
                              ) : metric.QAOA > metric.SoloQ ? (
                                <span className="text-emerald-300">QAOA 🏆</span>
                              ) : (
                                <span className="text-gray-400">Tie</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Raw Dataset Results */}
            {selectedDataset && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Raw Evaluation Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* SoloQ */}
                    <div>
                      <h3 className="text-lg font-semibold text-purple-300 mb-3">SoloQ Model</h3>
                      <pre className="text-gray-300 text-sm">
                        {JSON.stringify(rawDatasetResults[selectedDataset]?.SoloQ, null, 2)}
                      </pre>
                    </div>
                    {/* QAOA */}
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-300 mb-3">QAOA Model</h3>
                      <pre className="text-gray-300 text-sm">
                        {JSON.stringify(rawDatasetResults[selectedDataset]?.qaoa, null, 2)}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detailed Analysis Button */}
            {results && !showDetailedAnalysis && (
              <div className="text-center">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold border-purple-500 text-purple-500 hover:bg-purple-500/10"
                  onClick={() => setShowDetailedAnalysis(true)}
                >
                  <BarChart2 className="mr-2 h-5 w-5" />
                  View Detailed Analysis
                </Button>
              </div>
            )}

            {/* Charts */}
            {showDetailedAnalysis && results && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-white text-2xl flex items-center gap-2">
                        {getSelectedDataset()?.icon}
                        Detailed Analysis
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Visual comparison between SoloQ and QAOA performance
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={chartType === 'radar' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setChartType('radar')}
                      >
                        <Crosshair className="mr-2 h-4 w-4" />
                        Radar
                      </Button>
                      <Button
                        variant={chartType === 'bar' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setChartType('bar')}
                      >
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Bar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-96">{renderChart()}</div>
                </CardContent>
              </Card>
            )}

            {/* Recommendation */}
            {results?.recommendation && (
              <Card className="bg-gradient-to-r from-blue-900/50 to-emerald-900/50 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Recommendation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-full">
                      <Info className="h-6 w-6 text-blue-300" />
                    </div>
                    <div>
                      <p className="text-white">
                        Based on the evaluation results, we recommend using{' '}
                        <span className="font-bold text-yellow-300">
                          {results.recommendation === 'both' ? 'either SoloQ or QAOA' : results.recommendation.toUpperCase()}
                        </span>{' '}
                        for {getSelectedDataset()?.name.toLowerCase()} dataset.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuantumEvaluationDemo;
