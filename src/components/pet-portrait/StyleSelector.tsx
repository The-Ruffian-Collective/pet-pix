
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

export interface StyleOption {
  id: string;
  name: string;
  description: string;
}

interface StyleSelectorProps {
  styles: StyleOption[];
  selectedStyle: string;
  onStyleSelected: (styleId: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isDisabled: boolean;
}

export const StyleSelector = ({
  styles,
  selectedStyle,
  onStyleSelected,
  onGenerate,
  isGenerating,
  isDisabled
}: StyleSelectorProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">2. Choose Art Style</h2>
      <div className="grid grid-cols-1 gap-4">
        {styles.map((style) => (
          <div key={style.id} className="space-y-2">
            <Button
              variant={selectedStyle === style.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onStyleSelected(style.id)}
              disabled={isGenerating}
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
        onClick={onGenerate}
        disabled={isDisabled || isGenerating}
      >
        {isGenerating ? (
          "Generating..."
        ) : (
          <>Generate Portrait <Wand2 className="ml-2" /></>
        )}
      </Button>
    </Card>
  );
};
