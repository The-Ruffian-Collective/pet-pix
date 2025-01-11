import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useState } from "react";

const STYLE_OPTIONS = [
  { id: "watercolor", name: "Watercolor", description: "Soft, flowing watercolor style" },
  { id: "oil", name: "Oil Painting", description: "Classic oil painting look" },
  { id: "cartoon", name: "Cartoon", description: "Fun, animated cartoon style" },
  { id: "pop-art", name: "Pop Art", description: "Bold, vibrant pop art style" },
];

const Create = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("watercolor");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for submission logic
    toast({
      title: "Coming Soon!",
      description: "This feature will be available soon.",
    });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center gradient-text">
          Create Your Pet Portrait
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Upload Section */}
          <Card className="p-6">
            <Label htmlFor="photo" className="text-lg font-semibold block mb-4">
              Upload Your Pet's Photo
            </Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label
                htmlFor="photo"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                </span>
              </Label>
            </div>
          </Card>

          {/* Style Selection */}
          <Card className="p-6">
            <Label className="text-lg font-semibold block mb-4">
              Choose Your Style
            </Label>
            <RadioGroup
              value={selectedStyle}
              onValueChange={setSelectedStyle}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {STYLE_OPTIONS.map((style) => (
                <div key={style.id} className="flex items-start space-x-3">
                  <RadioGroupItem value={style.id} id={style.id} />
                  <Label
                    htmlFor={style.id}
                    className="font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div className="font-semibold">{style.name}</div>
                    <p className="text-sm text-gray-500">{style.description}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>

          <div className="text-center">
            <Button type="submit" size="lg">
              Generate Portrait
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;