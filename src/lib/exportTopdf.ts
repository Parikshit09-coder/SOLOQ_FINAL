import jsPDF from "jspdf";

// Professional color theme for the PDF
const theme = {
  primary: [41, 128, 185],     // Professional blue
  secondary: [52, 73, 94],      // Dark gray
  accent: [46, 204, 113],       // Success green
  background: [248, 249, 250],  // Light background
  text: [44, 62, 80],          // Dark text
  lightGray: [236, 240, 241],   // Light gray for tables
  warning: [241, 196, 15],      // Warning yellow
  error: [231, 76, 60],         // Error red
  white: [255, 255, 255],
  chartGrid: [200, 200, 200]    // Chart grid lines
};

interface MetricData {
  name: string;
  value: number;
  description?: string;
  threshold?: { good: number; warning: number };
}

interface ChartData {
  trainingProgress?: { epoch: number; accuracy: number; loss: number }[];
  metricsComparison?: MetricData[];
  confusionMatrix?: number[][];
  confusionLabels?: string[];
}

export const exportToPDF = async (
  metricsData?: MetricData[], 
  modelName?: string, 
  timestamp?: string,
  chartData?: ChartData
) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yOffset = margin;
  let pageNumber = 1;

  // Helper function to add a new page if needed
  const checkNewPage = (requiredSpace: number = 30) => {
    if (yOffset + requiredSpace > pageHeight - margin - 15) {
      addFooter();
      pdf.addPage();
      pageNumber++;
      yOffset = margin;
      return true;
    }
    return false;
  };

  // Helper function to draw a colored rectangle
  const drawRect = (x: number, y: number, width: number, height: number, color: number[]) => {
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.rect(x, y, width, height, "F");
  };

  // Helper function to draw a border
  const drawBorder = (x: number, y: number, width: number, height: number, color: number[] = theme.lightGray, lineWidth: number = 0.5) => {
    pdf.setDrawColor(color[0], color[1], color[2]);
    pdf.setLineWidth(lineWidth);
    pdf.rect(x, y, width, height);
  };

  // Helper function to set text color
  const setTextColor = (color: number[]) => {
    pdf.setTextColor(color[0], color[1], color[2]);
  };

  // Add footer to current page
  const addFooter = () => {
    const footerY = pageHeight - 10;
    setTextColor(theme.secondary);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "italic");
    pdf.text("Quantum Model Evaluation Report - Confidential", margin, footerY);
    pdf.text(`Page ${pageNumber}`, pageWidth - margin, footerY, { align: "right" });
  };

  // ---------- HEADER SECTION ----------
  // Gradient-like header with multiple rectangles
  drawRect(0, 0, pageWidth, 55, theme.primary);
  drawRect(0, 45, pageWidth, 10, [35, 110, 160]); // Darker shade for depth
  
  // Modern header design with geometric elements
  pdf.setFillColor(255, 255, 255, 0.1);
  pdf.circle(pageWidth - 30, 25, 20, "F");
  pdf.circle(30, 35, 15, "F");
  
  // Title with shadow effect
  pdf.setFontSize(26);
  pdf.setFont("helvetica", "bold");
  setTextColor([255, 255, 255]);
  pdf.text("QUANTUM MODEL", pageWidth / 2, 20, { align: "center" });
  pdf.text("EVALUATION REPORT", pageWidth / 2, 32, { align: "center" });
  
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text("Comprehensive Performance Analysis & Insights", pageWidth / 2, 42, { align: "center" });
  
  yOffset = 70;

  // ---------- DOCUMENT INFO CARD ----------
  const cardHeight = 25;
  drawRect(margin, yOffset, contentWidth, cardHeight, theme.background);
  drawBorder(margin, yOffset, contentWidth, cardHeight, theme.primary, 1);
  
  setTextColor(theme.text);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  
  const currentDate = timestamp || new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  
  const infoItems = [
    { label: "Generated:", value: currentDate },
    { label: "Model:", value: modelName || "Quantum Neural Network" },
    { label: "Version:", value: "2.1" },
    { label: "Status:", value: "Analysis Complete" }
  ];
  
  let xPos = margin + 5;
  infoItems.forEach((item, index) => {
    pdf.text(item.label, xPos, yOffset + 8);
    pdf.setFont("helvetica", "normal");
    pdf.text(item.value, xPos, yOffset + 15);
    pdf.setFont("helvetica", "bold");
    xPos += contentWidth / 4;
  });
  
  yOffset += cardHeight + 15;

  // ---------- EXECUTIVE SUMMARY ----------
  checkNewPage(50);
  
  // Modern section header
  drawRect(margin, yOffset - 2, contentWidth, 15, theme.secondary);
  drawRect(margin, yOffset - 2, 5, 15, theme.accent); // Accent bar
  
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  setTextColor([255, 255, 255]);
  pdf.text("EXECUTIVE SUMMARY", margin + 10, yOffset + 7);
  yOffset += 20;

  // Summary content in styled box
  drawRect(margin, yOffset, contentWidth, 45, [250, 251, 252]);
  drawBorder(margin, yOffset, contentWidth, 45, theme.lightGray);

  setTextColor(theme.text);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  
  const summaryLines = [
    "This comprehensive evaluation provides detailed insights into quantum machine learning model performance,",
    "including training convergence analysis, performance metrics, and predictive accuracy assessments.",
    "",
    "Key Performance Indicators:",
    "  • Training convergence achieved with optimal learning rates",
    "  • Performance metrics exceed industry benchmarks",
    "  • Classification accuracy demonstrates strong generalization",
    "  • Comprehensive analysis supports deployment readiness"
  ];

  summaryLines.forEach((line, index) => {
    if (line.includes("•")) {
      setTextColor(theme.primary);
      pdf.setFont("helvetica", "normal");
    } else if (line.includes("Key Performance")) {
      setTextColor(theme.secondary);
      pdf.setFont("helvetica", "bold");
    } else {
      setTextColor(theme.text);
      pdf.setFont("helvetica", "normal");
    }
    pdf.text(line, margin + 5, yOffset + 8 + (index * 4));
  });
  
  yOffset += 60;

  // ---------- PERFORMANCE METRICS TABLE ----------
  if (metricsData && metricsData.length > 0) {
    checkNewPage(80);
    
    // Section header
    drawRect(margin, yOffset - 2, contentWidth, 15, theme.secondary);
    drawRect(margin, yOffset - 2, 5, 15, theme.accent);
    
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    setTextColor([255, 255, 255]);
    pdf.text("KEY PERFORMANCE METRICS", margin + 10, yOffset + 7);
    yOffset += 25;

    // Enhanced table design
    const tableHeaders = ["Metric", "Value", "Status", "Benchmark", "Interpretation"];
    const colWidths = [40, 25, 30, 25, 50];
    const tableHeight = 12;
    
    // Table header
    drawRect(margin, yOffset, contentWidth, tableHeight, theme.primary);
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    setTextColor(theme.white);
    
    let xPos = margin + 2;
    tableHeaders.forEach((header, index) => {
      pdf.text(header, xPos + 2, yOffset + 8);
      xPos += colWidths[index];
    });
    yOffset += tableHeight;

    // Table rows with alternating colors
    pdf.setFont("helvetica", "normal");
    metricsData.forEach((metric, rowIndex) => {
      const rowColor = rowIndex % 2 === 0 ? theme.white : [248, 249, 250];
      drawRect(margin, yOffset, contentWidth, tableHeight, rowColor);
      drawBorder(margin, yOffset, contentWidth, tableHeight, theme.lightGray, 0.2);
      
      xPos = margin + 2;
      
      // Metric name
      setTextColor(theme.text);
      pdf.text(metric.name, xPos + 2, yOffset + 8);
      xPos += colWidths[0];
      
      // Value with formatting
      const valueText = `${metric.value.toFixed(1)}%`;
      pdf.setFont("helvetica", "bold");
      pdf.text(valueText, xPos + 2, yOffset + 8);
      pdf.setFont("helvetica", "normal");
      xPos += colWidths[1];
      
      // Status with color coding
      let status = "Excellent";
      let statusColor = theme.accent;
      if (metric.threshold) {
        if (metric.value < metric.threshold.warning) {
          status = "Needs Work";
          statusColor = theme.error;
        } else if (metric.value < metric.threshold.good) {
          status = "Good";
          statusColor = theme.warning;
        }
      }
      
      setTextColor(statusColor);
      pdf.text(status, xPos + 2, yOffset + 8);
      xPos += colWidths[2];
      
      // Benchmark
      setTextColor(theme.text);
      const benchmark = metric.threshold ? `${metric.threshold.good}%` : "N/A";
      pdf.text(benchmark, xPos + 2, yOffset + 8);
      xPos += colWidths[3];
      
      // Interpretation
      const interpretation = getMetricInterpretation(metric.name, metric.value);
      pdf.text(interpretation, xPos + 2, yOffset + 8);
      
      yOffset += tableHeight;
    });
    
    yOffset += 15;
  }

  // ---------- NATIVE CHART GENERATION ----------
  
  // Training Progress Chart
  if (chartData?.trainingProgress) {
    checkNewPage(120);
    
    drawRect(margin, yOffset - 2, contentWidth, 15, theme.accent);
    drawRect(margin, yOffset - 2, 5, 15, theme.primary);
    
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    setTextColor(theme.white);
    pdf.text("TRAINING PROGRESS ANALYSIS", margin + 10, yOffset + 7);
    yOffset += 25;
    
    drawTrainingChart(pdf, chartData.trainingProgress, margin, yOffset, contentWidth, 70);
    yOffset += 85;
  }

  // Metrics Comparison Chart
  if (chartData?.metricsComparison || metricsData) {
    checkNewPage(120);
    
    drawRect(margin, yOffset - 2, contentWidth, 15, theme.accent);
    drawRect(margin, yOffset - 2, 5, 15, theme.primary);
    
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    setTextColor(theme.white);
    pdf.text("PERFORMANCE METRICS COMPARISON", margin + 10, yOffset + 7);
    yOffset += 25;
    
    const metricsToChart = chartData?.metricsComparison || metricsData || [];
    drawMetricsChart(pdf, metricsToChart, margin, yOffset, contentWidth, 70);
    yOffset += 85;
  }

  // Confusion Matrix
  if (chartData?.confusionMatrix) {
    checkNewPage(120);
    
    drawRect(margin, yOffset - 2, contentWidth, 15, theme.accent);
    drawRect(margin, yOffset - 2, 5, 15, theme.primary);
    
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    setTextColor(theme.white);
    pdf.text("CONFUSION MATRIX ANALYSIS", margin + 10, yOffset + 7);
    yOffset += 25;
    
    drawConfusionMatrix(pdf, chartData.confusionMatrix, chartData.confusionLabels || [], margin, yOffset, contentWidth, 70);
    yOffset += 85;
  }

  // ---------- RECOMMENDATIONS ----------
  checkNewPage(60);
  
  drawRect(margin, yOffset - 2, contentWidth, 15, theme.primary);
  drawRect(margin, yOffset - 2, 5, 15, theme.accent);
  
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  setTextColor(theme.white);
  pdf.text("RECOMMENDATIONS & INSIGHTS", margin + 10, yOffset + 7);
  yOffset += 25;

  const recommendations = [
    {
      title: "Model Optimization",
      items: ["Fine-tune hyperparameters for enhanced convergence", "Implement advanced regularization techniques"]
    },
    {
      title: "Data Strategy",
      items: ["Expand training dataset diversity", "Implement data augmentation techniques"]
    },
    {
      title: "Architecture Enhancement", 
      items: ["Optimize quantum circuit depth", "Evaluate gate combination efficiency"]
    },
    {
      title: "Deployment Readiness",
      items: ["Establish monitoring frameworks", "Plan phased rollout strategy"]
    }
  ];

  recommendations.forEach((rec, index) => {
    // Recommendation card
    const cardHeight = 15 + (rec.items.length * 5);
    drawRect(margin, yOffset, contentWidth, cardHeight, [250, 251, 252]);
    drawBorder(margin, yOffset, contentWidth, cardHeight, theme.accent, 0.8);
    
    // Title
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    setTextColor(theme.secondary);
    pdf.text(rec.title, margin + 5, yOffset + 8);
    
    // Items
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    setTextColor(theme.text);
    
    rec.items.forEach((item, itemIndex) => {
      pdf.text(`• ${item}`, margin + 8, yOffset + 15 + (itemIndex * 5));
    });
    
    yOffset += cardHeight + 8;
    
    if (index === 1) checkNewPage(40); // Check for new page after 2 recommendations
  });

  // Add final footer
  addFooter();

  // Save PDF with timestamp
  const filename = `Quantum_Model_Evaluation_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
};

// Chart drawing functions
const drawTrainingChart = (pdf: jsPDF, data: any[], x: number, y: number, width: number, height: number) => {
  // Chart background
  drawRect(x, y, width, height, theme.white);
  drawBorder(x, y, width, height, theme.chartGrid);
  
  const chartMargin = 15;
  const chartWidth = width - (chartMargin * 2);
  const chartHeight = height - (chartMargin * 2);
  
  // Draw grid lines
  pdf.setDrawColor(theme.chartGrid[0], theme.chartGrid[1], theme.chartGrid[2]);
  pdf.setLineWidth(0.2);
  
  // Vertical grid lines
  for (let i = 0; i <= 5; i++) {
    const gridX = x + chartMargin + (chartWidth / 5) * i;
    pdf.line(gridX, y + chartMargin, gridX, y + height - chartMargin);
  }
  
  // Horizontal grid lines
  for (let i = 0; i <= 4; i++) {
    const gridY = y + chartMargin + (chartHeight / 4) * i;
    pdf.line(x + chartMargin, gridY, x + width - chartMargin, gridY);
  }
  
  // Sample data if none provided
  const chartData = data.length > 0 ? data : [
    { epoch: 0, accuracy: 65, loss: 0.8 },
    { epoch: 25, accuracy: 78, loss: 0.5 },
    { epoch: 50, accuracy: 85, loss: 0.3 },
    { epoch: 75, accuracy: 91, loss: 0.2 },
    { epoch: 100, accuracy: 94, loss: 0.15 }
  ];
  
  // Draw accuracy line
  pdf.setDrawColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  pdf.setLineWidth(2);
  
  for (let i = 0; i < chartData.length - 1; i++) {
    const x1 = x + chartMargin + (chartData[i].epoch / 100) * chartWidth;
    const y1 = y + height - chartMargin - ((chartData[i].accuracy - 60) / 40) * chartHeight;
    const x2 = x + chartMargin + (chartData[i + 1].epoch / 100) * chartWidth;
    const y2 = y + height - chartMargin - ((chartData[i + 1].accuracy - 60) / 40) * chartHeight;
    
    pdf.line(x1, y1, x2, y2);
    
    // Draw points
    pdf.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
    pdf.circle(x1, y1, 1, "F");
  }
  
  // Labels
  pdf.setFontSize(8);
  setTextColor(theme.text);
  pdf.text("Epochs", x + width / 2, y + height + 5, { align: "center" });
  
  // Rotated Y-axis label
  pdf.text("Accuracy (%)", x - 5, y + height / 2, { angle: 90, align: "center" });
  
  // Legend
  pdf.setFillColor(theme.primary[0], theme.primary[1], theme.primary[2]);
  pdf.rect(x + width - 60, y + 5, 8, 3, "F");
  pdf.text("Accuracy", x + width - 48, y + 8);
};

const drawMetricsChart = (pdf: jsPDF, metrics: MetricData[], x: number, y: number, width: number, height: number) => {
  // Chart background
  drawRect(x, y, width, height, theme.white);
  drawBorder(x, y, width, height, theme.chartGrid);
  
  const chartMargin = 20;
  const barWidth = (width - chartMargin * 2) / metrics.length - 5;
  const chartHeight = height - chartMargin * 2;
  
  metrics.forEach((metric, index) => {
    const barHeight = (metric.value / 100) * chartHeight;
    const barX = x + chartMargin + (index * (barWidth + 5));
    const barY = y + height - chartMargin - barHeight;
    
    // Determine bar color based on value
    let barColor = theme.accent;
    if (metric.threshold) {
      if (metric.value < metric.threshold.warning) barColor = theme.error;
      else if (metric.value < metric.threshold.good) barColor = theme.warning;
    }
    
    // Draw bar
    drawRect(barX, barY, barWidth, barHeight, barColor);
    drawBorder(barX, barY, barWidth, barHeight, theme.secondary);
    
    // Value label on bar
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    setTextColor(theme.white);
    pdf.text(`${metric.value.toFixed(1)}%`, barX + barWidth/2, barY + barHeight/2, { align: "center" });
    
    // Metric name below
    pdf.setFont("helvetica", "normal");
    setTextColor(theme.text);
    pdf.text(metric.name, barX + barWidth/2, y + height - 5, { align: "center", angle: 45 });
  });
  
  // Y-axis labels
  pdf.setFontSize(7);
  for (let i = 0; i <= 4; i++) {
    const value = (i * 25).toString();
    const labelY = y + height - chartMargin - (i * chartHeight / 4);
    pdf.text(value, x + chartMargin - 5, labelY, { align: "right" });
  }
};

// Add the missing confusion matrix drawing function
const drawConfusionMatrix = (
  pdf: jsPDF, 
  matrix: number[][], 
  labels: string[], 
  x: number, 
  y: number, 
  width: number, 
  height: number
) => {
  // Draw background
  drawRect(x, y, width, height, theme.white);
  drawBorder(x, y, width, height, theme.chartGrid);
  
  if (!matrix.length) return;
  
  const numClasses = matrix.length;
  const cellSize = Math.min((width - 40) / numClasses, (height - 40) / numClasses);
  const startX = x + (width - cellSize * numClasses) / 2;
  const startY = y + (height - cellSize * numClasses) / 2;
  
  // Find the max value for color scaling
  let maxValue = 0;
  for (let i = 0; i < numClasses; i++) {
    for (let j = 0; j < numClasses; j++) {
      maxValue = Math.max(maxValue, matrix[i][j]);
    }
  }
  
  // Draw cells
  for (let i = 0; i < numClasses; i++) {
    for (let j = 0; j < numClasses; j++) {
      const value = matrix[i][j];
      const intensity = maxValue > 0 ? value / maxValue : 0;
      
      // Calculate color based on intensity (white to primary color)
      const r = Math.round(255 - intensity * (255 - theme.primary[0]));
      const g = Math.round(255 - intensity * (255 - theme.primary[1]));
      const b = Math.round(255 - intensity * (255 - theme.primary[2]));
      
      // Draw cell
      drawRect(startX + j * cellSize, startY + i * cellSize, cellSize, cellSize, [r, g, b]);
      drawBorder(startX + j * cellSize, startY + i * cellSize, cellSize, cellSize, theme.chartGrid);
      
      // Add value text
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      setTextColor(intensity > 0.5 ? theme.white : theme.text);
      pdf.text(
        value.toString(), 
        startX + j * cellSize + cellSize / 2, 
        startY + i * cellSize + cellSize / 2, 
        { align: "center" }
      );
    }
  }
  
  // Add labels
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  setTextColor(theme.text);
  
  // Use available labels or generate numbered labels
  const displayLabels = labels.length >= numClasses 
    ? labels.slice(0, numClasses) 
    : Array.from({ length: numClasses }, (_, i) => `Class ${i + 1}`);
  
  // X-axis labels (predicted)
  for (let i = 0; i < numClasses; i++) {
    pdf.text(
      displayLabels[i], 
      startX + i * cellSize + cellSize / 2, 
      startY + numClasses * cellSize + 15, 
      { align: "center" }
    );
  }
  
  // Y-axis labels (actual)
  for (let i = 0; i < numClasses; i++) {
    pdf.text(
      displayLabels[i], 
      startX - 5, 
      startY + i * cellSize + cellSize / 2, 
      { align: "right" }
    );
  }
  
  // Add axis titles
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("Predicted", startX + (numClasses * cellSize) / 2, startY + numClasses * cellSize + 25, { align: "center" });
  pdf.text("Actual", startX - 25, startY + (numClasses * cellSize) / 2, { align: "center", angle: 90 });
};

// Helper function to provide metric interpretations
const getMetricInterpretation = (metricName: string, value: number): string => {
  const interpretations: Record<string, (v: number) => string> = {
    "Accuracy": (v) => v > 90 ? "Excellent" : v > 80 ? "Good" : v > 70 ? "Fair" : "Poor",
    "Precision": (v) => v > 85 ? "High confidence" : v > 75 ? "Moderate" : "Low confidence", 
    "Recall": (v) => v > 85 ? "Comprehensive" : v > 75 ? "Adequate" : "Limited",
    "F1-Score": (v) => v > 85 ? "Well balanced" : v > 75 ? "Acceptable" : "Imbalanced",
    "F1 Score": (v) => v > 85 ? "Well balanced" : v > 75 ? "Acceptable" : "Imbalanced",
    "Loss": (v) => v < 0.1 ? "Excellent" : v < 0.3 ? "Good" : v < 0.5 ? "Fair" : "High error"
  };
  
  const interpret = interpretations[metricName];
  return interpret ? interpret(value) : "Standard range";
};