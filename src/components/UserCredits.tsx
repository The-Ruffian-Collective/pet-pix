import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function UserCredits() {
  const navigate = useNavigate();
  const { data: credits } = useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_credits")
        .select("credits_remaining")
        .single();
      
      if (error) throw error;
      return data;
    },
  });

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