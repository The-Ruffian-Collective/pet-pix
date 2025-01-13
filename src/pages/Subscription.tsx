import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserMenu } from "@/components/UserMenu";
import { UserCredits } from "@/components/UserCredits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check, CreditCard, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const Subscription = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const plans = [
    {
      name: "Free",
      price: "£0",
      period: "Forever",
      features: [
        "3 AI portraits per day",
        "Basic art styles",
        "Standard processing time",
      ],
      current: subscription?.plan_type === "free",
      type: "free"
    },
    {
      name: "Basic",
      price: "£4.99",
      period: "per month",
      features: [
        "10 AI portraits per day",
        "All art styles",
        "Priority processing",
        "HD downloads"
      ],
      current: subscription?.plan_type === "basic",
      type: "basic"
    },
    {
      name: "Premium",
      price: "£9.99",
      period: "per month",
      features: [
        "30 AI portraits per day",
        "All art styles + exclusive styles",
        "Priority processing",
        "HD downloads",
        "Commercial usage rights"
      ],
      current: subscription?.plan_type === "premium",
      type: "premium"
    },
    {
      name: "Unlimited",
      price: "£24.99",
      period: "per month",
      features: [
        "Unlimited AI portraits",
        "All styles + early access",
        "Instant processing",
        "4K downloads",
        "Commercial usage rights",
        "Priority support"
      ],
      current: subscription?.plan_type === "unlimited",
      type: "unlimited"
    }
  ];

  const handleSubscribe = async (planType: string) => {
    // TODO: Implement Stripe integration
    toast({
      title: "Coming Soon",
      description: "Payment integration will be available soon!",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-4">
      <header className="absolute top-0 right-0 p-4 flex items-center gap-4">
        <UserCredits />
        <UserMenu user={user} />
      </header>

      <div className="container mx-auto max-w-6xl pt-20">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <h1 className="text-4xl font-bold text-center mb-4 gradient-text">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Select the perfect plan for your creative journey
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="p-6 flex flex-col">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className="w-full mt-4"
                variant={plan.current ? "outline" : "default"}
                onClick={() => handleSubscribe(plan.type)}
                disabled={plan.current}
              >
                {plan.current ? (
                  "Current Plan"
                ) : (
                  <>
                    Subscribe
                    <CreditCard className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;