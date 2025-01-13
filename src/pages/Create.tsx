import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserMenu } from "@/components/UserMenu";
import { UserCredits } from "@/components/UserCredits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlus, Wand2 } from "lucide-react";

const Create = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("watercolor");

  useEffect(() => {
    // Check if user is authenticated
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("File size should be less than 10MB");
        return;
      }
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleGenerate = async () => {
    // TODO: Implement image generation logic
    console.log("Generating with style:", selectedStyle);
  };

  if (!user) return null;

  const styles = [
    { 
      id: "watercolor", 
      name: "Watercolor",
      description: "Soft, flowing colors that capture your pet's essence in a dreamy, artistic style."
    },
    { 
      id: "oil-painting", 
      name: "Oil Painting",
      description: "Rich, textured brushstrokes that give your pet portrait a classical, timeless feel."
    },
    { 
      id: "pop-art", 
      name: "Pop Art",
      description: "Bold, vibrant colors and patterns that transform your pet into a modern art icon."
    },
    { 
      id: "pencil-sketch", 
      name: "Pencil Sketch",
      description: "Detailed, hand-drawn appearance that highlights your pet's features with elegant simplicity."
    },
  ];

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
          {/* Upload Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">1. Upload Your Pet Photo</h2>
            <div 
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
                previewUrl ? 'border-primary' : 'border-primary/20 hover:border-primary/50'
              }`}
            >
              {previewUrl ? (
                <div className="w-full">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full h-auto rounded-lg mb-4 mx-auto"
                  />
                  <p className="text-sm text-gray-500 text-center mb-4">
                    {selectedImage?.name}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <ImagePlus className="w-12 h-12 text-gray-400 mb-4 mx-auto" />
                  <p className="text-sm text-gray-500 mb-4">
                    Upload a clear photo of your pet (max 10MB)
                  </p>
                </div>
              )}
              <Button asChild variant="outline">
                <label className="cursor-pointer">
                  {previewUrl ? "Choose Different Photo" : "Choose Photo"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </Button>
            </div>
          </Card>

          {/* Style Selection */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">2. Choose Art Style</h2>
            <div className="grid grid-cols-1 gap-4">
              {styles.map((style) => (
                <div key={style.id} className="space-y-2">
                  <Button
                    variant={selectedStyle === style.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    {style.name}
                  </Button>
                  <p className="text-sm text-gray-500 pl-2">
                    {style.description}
                  </p>
                </div>
              ))}
            </div>

            <Button
              className="w-full mt-8"
              size="lg"
              onClick={handleGenerate}
              disabled={!selectedImage}
            >
              Generate Portrait <Wand2 className="ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Create;