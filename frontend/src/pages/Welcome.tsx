import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
  const features = [
    {
      icon: FileText,
      title: 'Rich Note Editor',
      description: 'Beautiful, distraction-free writing experience with real-time saving.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimistic UI updates and seamless synchronization across devices.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your notes are protected with JWT authentication and encryption.'
    },
    {
      icon: Sparkles,
      title: 'Smart Search',
      description: 'Find any note instantly with powerful full-text search capabilities.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl opacity-50" />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Notes
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Capture
              </span>{' '}
              your thoughts
              <br />
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                beautifully
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              A modern, elegant note-taking app designed for writers, thinkers, and dreamers. 
              Organize your ideas with style and efficiency.
            </p>

            <div className="flex items-center justify-center space-x-4 mb-16">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-3">
                  Start Writing
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-glass-border bg-glass/30 backdrop-blur-sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-glass backdrop-blur-glass border border-glass-border shadow-glass flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-24 p-8 rounded-3xl backdrop-blur-glass bg-gradient-glass border border-glass-border shadow-elegant max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who trust Notes to organize their thoughts and ideas.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-3">
                Create Free Account
              </Button>
            </Link>
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="container mx-auto px-4 py-8 text-center text-muted-foreground"
        >
          <p>&copy; 2024 Notes. Made with ❤️ for better productivity.</p>
        </motion.footer>
      </div>
    </div>
  );
}