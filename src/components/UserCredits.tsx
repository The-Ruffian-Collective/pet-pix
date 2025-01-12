import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard } from "lucide-react";

export function UserCredits() {
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
    <div className="flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-lg">
      <CreditCard className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium">
        {credits?.credits_remaining || 0} credits remaining
      </span>
    </div>
  );
}