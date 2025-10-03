import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, Play, BarChart3, FileText, Settings, Database, Brain, Target, TrendingUp, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import  {exportToPDF} from "@/lib/exportTopdf";
interface FormData {
  datasetChoice: string;
  trainFile: File | null;
  testFile: File | null;
  singleFile: File | null;
  class0Name: string;
  class1Name: string;
  numEpochs: number;
  numIterations: number;
  learningRate: number;
  testSize: number;
  valSize: number;
}

const Evaluation = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    datasetChoice: "",
    trainFile: null,
    testFile: null,
    singleFile: null,
    class0Name: "Class 0",
    class1Name: "Class 1",
    numEpochs: 100,
    numIterations: 1,
    learningRate: 0.1,
    testSize: 0.2,
    valSize: 0.25,
  });

  // Chart data
  const trainingData = [
    { epoch: 0, training: 45, validation: 42, test: 40 },
    { epoch: 20, training: 65, validation: 62, test: 58 },
    { epoch: 40, training: 78, validation: 75, test: 72 },
    { epoch: 60, training: 85, validation: 82, test: 79 },
    { epoch: 80, training: 90, validation: 87, test: 84 },
    { epoch: 100, training: 92.45, validation: 89.23, test: 87.65 },
  ];

  const metricsData = [
    { name: 'Accuracy', value: 87.65, color: '#8b5cf6' },
    { name: 'Precision', value: 88.92, color: '#06b6d4' },
    { name: 'Recall', value: 86.78, color: '#10b981' },
    { name: 'F1 Score', value: 87.84, color: '#f59e0b' },
  ];

  const confusionData = [
    { name: 'True Negative', value: 45.2, color: '#10b981' },
    { name: 'False Positive', value: 8.8, color: '#ef4444' },
    { name: 'False Negative', value: 7.3, color: '#f59e0b' },
    { name: 'True Positive', value: 38.7, color: '#06b6d4' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'train' | 'test' | 'single') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.csv')) {
        setFormData(prev => ({
          ...prev,
          [fileType === 'single' ? 'singleFile' : `${fileType}File`]: file
        }));
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded.`,
        });
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const simulateTraining = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    for (let i = 0; i <= 100; i += 2) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setShowResults(true);
    setIsProcessing(false);
    
    toast({
      title: "Training completed!",
      description: "Your quantum model has been successfully trained and evaluated.",
    });
  };

  const handleStartTraining = () => {
    if (!formData.datasetChoice) {
      toast({
        title: "Dataset choice required",
        description: "Please select a dataset configuration option.",
        variant: "destructive",
      });
      return;
    }

    if (formData.datasetChoice === "single" && !formData.singleFile) {
      toast({
        title: "File required",
        description: "Please upload your dataset file.",
        variant: "destructive",
      });
      return;
    }

    if (formData.datasetChoice === "separate" && (!formData.trainFile || !formData.testFile)) {
      toast({
        title: "Files required",
        description: "Please upload both training and test files.",
        variant: "destructive",
      });
      return;
    }

    simulateTraining();
  };

  const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${color} border border-white/20 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-white/80" />
       
      </div>
      <div className="text-2xl font-bold text-white">{value}%</div>
      <div className="text-sm text-white/80">{title}</div>
    </div>
  );

  const CircularProgress = ({ value, label, color }: any) => (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="30"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-300"
          />
          <circle
            cx="40"
            cy="40"
            r="30"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${(value / 100) * 188.4} 188.4`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{value}%</span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground mt-2">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quantum Model Evaluation
            </h1>
            <p className="text-muted-foreground">
              Configure and train your quantum machine learning model
            </p>
          </div>

          {!showResults ? (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Configuration */}
              <div className="space-y-6">
                {/* Dataset & Classes Combined */}
                <Card className="glass-effect">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Database className="h-4 w-4 text-primary" />
                      Dataset & Classes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm">Dataset Setup</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, datasetChoice: value }))}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select configuration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single file (auto-split)</SelectItem>
                          <SelectItem value="separate">Separate train/test files</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.datasetChoice === "single" && (
                      <div>
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={(e) => handleFileUpload(e, 'single')}
                          className="h-9"
                        />
                        {formData.singleFile && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ✓ {formData.singleFile.name}
                          </p>
                        )}
                      </div>
                    )}

                    {formData.datasetChoice === "separate" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            type="file"
                            accept=".csv"
                            onChange={(e) => handleFileUpload(e, 'train')}
                            placeholder="Train file"
                            className="h-9"
                          />
                          {formData.trainFile && (
                            <p className="text-xs text-muted-foreground mt-1">
                              ✓ {formData.trainFile.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            type="file"
                            accept=".csv"
                            onChange={(e) => handleFileUpload(e, 'test')}
                            placeholder="Test file"
                            className="h-9"
                          />
                          {formData.testFile && (
                            <p className="text-xs text-muted-foreground mt-1">
                              ✓ {formData.testFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">Class 0 Name</Label>
                        <Input
                          value={formData.class0Name}
                          onChange={(e) => setFormData(prev => ({ ...prev, class0Name: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Class 1 Name</Label>
                        <Input
                          value={formData.class1Name}
                          onChange={(e) => setFormData(prev => ({ ...prev, class1Name: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Training Parameters */}
                <Card className="glass-effect">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="h-4 w-4 text-primary" />
                      Training Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Epochs</Label>
                        <Input
                          type="number"
                          value={formData.numEpochs}
                          onChange={(e) => setFormData(prev => ({ ...prev, numEpochs: parseInt(e.target.value) || 100 }))}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Iterations</Label>
                        <Input
                          type="number"
                          value={formData.numIterations}
                          onChange={(e) => setFormData(prev => ({ ...prev, numIterations: parseInt(e.target.value) || 1 }))}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Learning Rate</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.learningRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, learningRate: parseFloat(e.target.value) || 0.1 }))}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Validation Size</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.valSize}
                          onChange={(e) => setFormData(prev => ({ ...prev, valSize: parseFloat(e.target.value) || 0.25 }))}
                          className="h-9"
                        />
                      </div>
                    </div>
                    {formData.datasetChoice === "single" && (
                      <div className="mt-3">
                        <Label className="text-sm">Test Size</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.testSize}
                          onChange={(e) => setFormData(prev => ({ ...prev, testSize: parseFloat(e.target.value) || 0.2 }))}
                          className="h-9"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Preview/Status */}
              <div className="space-y-6">
                {/* Configuration Preview */}
                <Card className="glass-effect">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-4 w-4 text-primary" />
                      Configuration Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Dataset Type:</span>
                        <span className="font-medium">{formData.datasetChoice || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Classes:</span>
                        <span className="font-medium">{formData.class0Name} vs {formData.class1Name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Epochs:</span>
                        <span className="font-medium">{formData.numEpochs}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Learning Rate:</span>
                        <span className="font-medium">{formData.learningRate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Files Ready:</span>
                        <span className="font-medium">
                          {formData.datasetChoice === 'single' 
                            ? (formData.singleFile ? '✓ Yes' : '✗ No')
                            : (formData.trainFile && formData.testFile ? '✓ Yes' : '✗ No')
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="glass-effect">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="h-4 w-4 text-primary" />
                      Expected Training Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        ~{Math.ceil((formData.numEpochs * formData.numIterations) / 20)} min
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Based on {formData.numEpochs} epochs × {formData.numIterations} iterations
                      </p>
                      <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          Quantum advantage: ~3x faster than classical methods
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Training Progress */}
                {isProcessing && (
                  <Card className="glass-effect">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="flex justify-center">
                          <CircularProgress value={progress} label="Training" color="#8b5cf6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Quantum Training in Progress</h3>
                          <p className="text-sm text-muted-foreground">Optimizing quantum circuits...</p>
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Training Button - Full Width */}
              <div className="lg:col-span-2">
                <Button
                  size="lg"
                  onClick={handleStartTraining}
                  disabled={isProcessing}
                  className="w-full text-lg py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  {isProcessing ? (
                    <>
                      <Settings className="mr-2 h-5 w-5 animate-spin" />
                      Training Quantum Model...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start Quantum Training
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="space-y-6">
              {/* Header with Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Training Complete</h2>
                  <p className="text-muted-foreground">Quantum model successfully trained and evaluated</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowResults(false)}>
                    Train New Model
                  </Button>
                  <Button onClick={window.print}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Training Accuracy"
                  value="92.45"
                 
                  icon={TrendingUp}
                  color="from-blue-500 to-blue-600"
                />
                <MetricCard
                  title="Validation Accuracy"
                  value="89.23"
                 
                  icon={BarChart3}
                  color="from-green-500 to-green-600"
                />
                <MetricCard
                  title="Test Accuracy"
                  value="87.65"
            
                  icon={Target}
                  color="from-purple-500 to-purple-600"
                />
                <MetricCard
                  title="F1 Score"
                  value="87.84"
                
                  icon={Zap}
                  color="from-orange-500 to-orange-600"
                />
              </div>

              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Training Progress Chart */}
                <Card className="glass-effect">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Training Progress</CardTitle>
                    <CardDescription>Accuracy over epochs</CardDescription>
                  </CardHeader>
                  <CardContent id="training-progress">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={trainingData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="epoch" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }} 
                        />
                        <Line type="monotone" dataKey="training" stroke="#8b5cf6" strokeWidth={2} />
                        <Line type="monotone" dataKey="validation" stroke="#06b6d4" strokeWidth={2} />
                        <Line type="monotone" dataKey="test" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Metrics Comparison */}
                <Card className="glass-effect">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    <CardDescription>Model evaluation scores</CardDescription>
                  </CardHeader>
                  <CardContent id="metrics-comparison">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={metricsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Confusion Matrix Visualization */}
                <Card className="glass-effect">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Confusion Matrix</CardTitle>
                    <CardDescription>Classification breakdown</CardDescription>
                  </CardHeader>
                  <CardContent id="confusion-matrix">
                    <div className="flex items-center justify-between">
                      <ResponsiveContainer width="60%" height={200}>
                        <PieChart>
                          <Pie
                            data={confusionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {confusionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2">
                        {confusionData.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div 
                              className="w-3 h-3 rounded" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.name}: {item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Stats */}
                <Card className="glass-effect">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Detailed Statistics</CardTitle>
                    <CardDescription>Comprehensive metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Precision:</span>
                            <span className="font-medium">88.92% ± 3.12%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Recall:</span>
                            <span className="font-medium">86.78% ± 2.89%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Specificity:</span>
                            <span className="font-medium">89.12% ± 2.67%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total Test:</span>
                            <span className="font-medium">100 samples</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>{formData.class0Name}:</span>
                            <span className="font-medium">54 (45.2 correct)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>{formData.class1Name}:</span>
                            <span className="font-medium">46 (38.7 correct)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">87.65%</div>
                          <div className="text-sm text-muted-foreground">Overall Test Accuracy</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Evaluation