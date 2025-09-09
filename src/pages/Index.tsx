import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, Calendar, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-surface to-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">StudentTracker</span>
        </div>
        <Button asChild variant="outline">
          <Link to="/auth">Sign In</Link>
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Track Your Academic Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline student management, track attendance, manage grades, and organize subjects 
            all in one comprehensive platform designed for educational excellence.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                Manage student profiles, roles, and academic information efficiently
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Attendance Tracking</CardTitle>
              <CardDescription>
                Track student attendance with real-time updates and reporting
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Subject Organization</CardTitle>
              <CardDescription>
                Organize subjects, assign teachers, and manage curriculum effectively
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Grade Management</CardTitle>
              <CardDescription>
                Track grades, assignments, and academic performance analytics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Educational Management?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of educators who trust StudentTracker for their academic management needs.
          </p>
          <Button asChild size="lg">
            <Link to="/auth">Start Your Journey</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; 2024 StudentTracker. Built for educational excellence.</p>
      </footer>
    </div>
  );
};

export default Index;