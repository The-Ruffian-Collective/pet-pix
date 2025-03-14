
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "You've successfully signed in.",
        });
        onClose();
      } else if (event === "USER_UPDATED") {
        // Changed from "SIGNED_UP" to "USER_UPDATED" to match the allowed event types
        toast({
          title: "Account Created!",
          description: "Welcome to Pet Artistry! You've been awarded 5 free credits.",
        });
        onClose();
      } else if (event === "PASSWORD_RECOVERY") {
        toast({
          title: "Password Reset",
          description: "Your password has been successfully reset.",
        });
        onClose();
      }
    });

    return () => subscription.unsubscribe();
  }, [onClose, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Sign in or create account</DialogTitle>
        </DialogHeader>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
          redirectTo={window.location.origin}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
