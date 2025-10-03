import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Atom,
  Sparkles,
  Upload,
  BarChart3,
  ArrowRight,
  History,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, onMobileClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onMobileClose} 
        />
      )}

      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-background border-r border-border/20 z-50 transition-all duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
          ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className={`flex ${isCollapsed ? "justify-center" : "justify-between"} items-center mb-8`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Atom className="h-6 w-6 text-primary animate-pulse" />
                  <Sparkles className="h-3 w-3 text-accent absolute -top-0.5 -right-0.5 animate-bounce" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  SoloQ
                </h2>
              </div>
            )}
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={onMobileClose}
            >
              <X className="h-5 w-5" />
            </button>
            {!isCollapsed && (
              <button
                className="hidden lg:block text-muted-foreground hover:text-foreground"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1">
          
            <Link
              to="/demo"
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 hover:text-primary transition-colors
                ${isCollapsed ? "justify-center" : ""}`}
              onClick={onMobileClose}
            >
              <BarChart3 className="h-5 w-5" />
              {!isCollapsed && <span>Demo</span>}
            </Link>
            <Link
              to="/history"
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 hover:text-primary transition-colors
                ${isCollapsed ? "justify-center" : ""}`}
              onClick={onMobileClose}
            >
              <History className="h-5 w-5" />
              {!isCollapsed && <span>History</span>}
            </Link>
          </nav>

          {/* Collapsed toggle (only visible when collapsed) */}
          {isCollapsed && (
            <button
              className="hidden lg:flex justify-center mt-auto text-muted-foreground hover:text-foreground"
              onClick={() => setIsCollapsed(false)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Footer */}
          {!isCollapsed && (
            <div className="mt-auto text-xs text-muted-foreground text-center">
              <p>Quantum Model Evaluator</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

const Index = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 min-h-screen gradient-bg transition-all duration-300">
        
        {/* Header */}
        <header className="border-b border-border/20 glass-effect sticky top-0 z-30">
          <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Hamburger for mobile */}
              <button
                className="lg:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Collapse toggle for desktop */}
              <button
                className="hidden lg:block text-muted-foreground hover:text-foreground"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Brand (only shown when sidebar is collapsed) */}
              {isCollapsed && (
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="relative">
                    <Atom className="h-6 w-6 text-primary animate-pulse" />
                    <Sparkles className="h-3 w-3 text-accent absolute -top-0.5 -right-0.5 animate-bounce" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    SoloQ
                  </h1>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 py-8">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Quantum Model Evaluator
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Upload your quantum model and test performance with comprehensive metrics.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="text-lg px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90" asChild>
                  <Link to="/upload">
                    Start Evaluation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-6 sm:px-8 py-5 sm:py-6" asChild>
                  <Link to="/demo">View Demo</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-effect quantum-glow border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Interactive Demo</CardTitle>
                  <CardDescription>
                    Explore pre-loaded datasets to see our evaluation platform in action.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/demo">Try Demo</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-effect quantum-glow border-primary/30 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Upload className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Custom Evaluation</CardTitle>
                  <CardDescription>
                    Upload your own quantum models and datasets for comprehensive analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/upload">Upload Models</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6">Ready to Evaluate Your Quantum Models?</h3>
            <p className="text-lg text-muted-foreground mb-8">
              Get started with our comprehensive quantum model evaluation platform
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90" asChild>
                <Link to="/upload">
                  Upload Your Models
                  <Upload className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-6 sm:px-8 py-5 sm:py-6" asChild>
                <Link to="/demo">Explore Demo</Link>
              </Button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/20 glass-effect py-6 mt-8">
          <div className="container mx-auto px-4 sm:px-6 text-center text-muted-foreground">
            <div className="flex justify-center gap-4 sm:gap-6 mb-4 flex-wrap">
              <Link to="/demo" className="hover:text-primary transition-colors">Demo</Link>
              <Link to="/history" className="hover:text-primary transition-colors">History</Link>
              <Link to="/upload" className="hover:text-primary transition-colors">Upload</Link>
            </div>
            <p>&copy; {new Date().getFullYear()} SoloQ. Revolutionizing quantum ML evaluation.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
