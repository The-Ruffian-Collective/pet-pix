import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Camera, Download, Magic, Palette } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 gradient-text">
            Capture Your Pet's Personality in Art
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create one-of-a-kind pet portraits with AI. Transform your beloved companion into a stunning piece of art.
          </p>
          <Button asChild size="lg" className="animate-float">
            <Link to="/create">
              Start Creating <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera className="w-8 h-8 text-primary" />}
              title="Upload Your Photo"
              description="Start with your favorite photo of your pet - any angle, any pose."
            />
            <FeatureCard
              icon={<Palette className="w-8 h-8 text-primary" />}
              title="Choose Your Style"
              description="Select from various artistic styles - from watercolor to oil painting."
            />
            <FeatureCard
              icon={<Download className="w-8 h-8 text-primary" />}
              title="Get Your Portrait"
              description="Download your portrait or order professional prints."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Pet's Photo?</h2>
          <p className="text-xl mb-8 opacity-90">
            Turn your furry friend into a masterpiece today.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-gray-100"
          >
            <Link to="/create">
              Create Your Portrait <Magic className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="p-6 text-center hover:shadow-lg transition-shadow">
    <div className="inline-block p-3 bg-primary-100 rounded-full mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Card>
);

export default Index;