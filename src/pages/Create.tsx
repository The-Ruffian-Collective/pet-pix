
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserMenu } from "@/components/UserMenu";
import { UserCredits } from "@/components/UserCredits";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader } from "@/components/pet-portrait/ImageUploader";
import { StyleSelector } from "@/components/pet-portrait/StyleSelector";
import { portraitStyles } from "@/utils/portraitStyles";
import { useQueryClient } from "@tanstack/react-query";

const Create = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("watercolor");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this feature",
          variant: "destructive",
        });
        navigate("/");
      } else {
        setUser(session.user);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleImageSelected = (file: File | null) => {
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setGeneratedImage(null); // Reset generated image when new image is selected
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !user) return;

    setIsGenerating(true);
    toast({
      title: "Generating Portrait",
      description: "Please wait while we create your pet portrait...",
    });
    
    try {
      // First, check user credits
      const { data: credits, error: creditsError } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', user.id)
        .single();

      if (creditsError) {
        console.error('Credits error:', creditsError);
        if (creditsError.code === 'PGRST116') {
          toast({
            title: "No credits found",
            description: "Setting up your account with initial credits",
          });
          
          // Create initial credits if not found
          await supabase
            .from('user_credits')
            .insert({ 
              user_id: user.id,
              credits_remaining: 5,
              reset_date: new Date(Date.now() + 24*60*60*1000) // 24 hours from now
            });
          
          // Retry fetching credits
          const { data: newCredits, error: newCreditsError } = await supabase
            .from('user_credits')
            .select('credits_remaining')
            .eq('user_id', user.id)
            .single();
            
          if (newCreditsError) throw newCreditsError;
          
          if (newCredits.credits_remaining <= 0) {
            toast({
              title: "No credits remaining",
              description: "Please upgrade your plan to generate more portraits",
              variant: "destructive",
            });
            setIsGenerating(false);
            return;
          }
        } else {
          throw creditsError;
        }
      } else if (!credits || credits.credits_remaining <= 0) {
        toast({
          title: "No credits remaining",
          description: "Please upgrade your plan to generate more portraits",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = async () => {
        const base64Image = reader.result as string;

        // Get the session token for authorization
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please sign in to generate portraits",
            variant: "destructive",
          });
          setIsGenerating(false);
          return;
        }

        try {
          // Generate portrait
          const { data, error } = await supabase.functions.invoke('generate-pet-portrait', {
            body: { image: base64Image, style: selectedStyle }
          });

          if (error) throw error;
          if (!data?.image) throw new Error("No image returned from the API");

          // Update the generated image
          setGeneratedImage(data.image);

          // Deduct credit
          await supabase
            .from('user_credits')
            .update({ 
              credits_remaining: credits.credits_remaining - 1,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);

          // Refresh credits data
          queryClient.invalidateQueries({ queryKey: ["credits"] });

          toast({
            title: "Portrait Generated!",
            description: "Your pet portrait has been created successfully.",
          });
        } catch (error) {
          console.error('Generation error:', error);
          toast({
            title: "Generation Failed",
            description: "Failed to generate portrait. Please try again.",
            variant: "destructive",
          });
        }
      };
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate portrait. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-4">
      <header className="absolute top-0 right-0 p-4 flex items-center gap-4">
        <UserCredits />
        <UserMenu user={user} />
      </header>
      
      <div className="container mx-auto max-w-4xl pt-20">
        <h1 className="text-4xl font-bold text-center mb-8 gradient-text">
          Create Your Pet Portrait
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <ImageUploader 
            previewUrl={previewUrl} 
            selectedImage={selectedImage}
            onImageSelected={handleImageSelected}
            generatedImage={generatedImage}
            isGenerating={isGenerating}
          />

          <StyleSelector 
            styles={portraitStyles}
            selectedStyle={selectedStyle}
            onStyleSelected={setSelectedStyle}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            isDisabled={!selectedImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Create;
