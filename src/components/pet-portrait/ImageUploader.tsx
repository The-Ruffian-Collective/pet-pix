
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  previewUrl: string | null;
  selectedImage: File | null;
  onImageSelected: (file: File | null) => void;
  generatedImage: string | null;
  isGenerating: boolean;
}

export const ImageUploader = ({
  previewUrl,
  selectedImage,
  onImageSelected,
  generatedImage,
  isGenerating
}: ImageUploaderProps) => {
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }
      onImageSelected(file);
    }
  };

  return (
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
              disabled={isGenerating}
            />
          </label>
        </Button>
      </div>

      {/* Generated Image Display */}
      {generatedImage && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Generated Portrait</h3>
          <img 
            src={generatedImage} 
            alt="Generated Portrait" 
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
          <Button 
            className="w-full mt-4"
            onClick={() => {
              const link = document.createElement('a');
              link.href = generatedImage;
              link.download = 'pet-portrait.png';
              link.click();
            }}
          >
            Download Portrait
          </Button>
        </div>
      )}
    </Card>
  );
};
