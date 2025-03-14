
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function UserCredits() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: credits, isLoading, error } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        return { credits_remaining: 0 };
      }
      
      const { data, error } = await supabase
        .from("user_credits")
        .select("credits_remaining")
        .single();
      
      if (error) {
        console.error("Error fetching credits:", error);
        // If it's a not found error, the user might not have credits yet
        if (error.code === "PGRST116") {
          toast({
            title: "Credits not found",
            description: "Your account has been set up with 5 free credits.",
            variant: "default",
          });
          
          // Create initial credits for the user
          const resetDate = new Date(Date.now() + 24*60*60*1000); // 24 hours from now
          
          const { error: insertError } = await supabase
            .from("user_credits")
            .insert({ 
              user_id: session.session.user.id,
              credits_remaining: 5,
              reset_date: resetDate.toISOString() // Convert Date to ISO string format
            });
          
          if (insertError) {
            console.error("Error creating initial credits:", insertError);
            throw insertError;
          }
          
          return { credits_remaining: 5 };
        }
        throw error;
      }
      
      return data;
    },
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-lg">
          <CreditCard className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Loading credits...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-lg">
          <CreditCard className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium">Error loading credits</span>
        </div>
      </div>
    );
  }

  const refreshCredits = () => {
    queryClient.invalidateQueries({ queryKey: ["credits"] });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-lg">
        <CreditCard className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">
          {credits?.credits_remaining || 0} credits remaining
        </span>
      </div>
      {(credits?.credits_remaining === 0) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/subscription")}
          className="ml-2"
        >
          Upgrade Plan
        </Button>
      )}
    </div>
  );
}
