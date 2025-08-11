import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Crop, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageData: {
    url: string;
    altText: string;
    caption?: string;
    license?: string;
  }) => void;
}

export function MediaManager({ isOpen, onClose, onImageSelect }: MediaManagerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [license, setLicense] = useState("");
  const [cropRatio, setCropRatio] = useState("original");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!selectedImage || !altText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulăm procesarea imaginii (în realitate ar fi crop, conversie WEBP/AVIF, etc.)
    try {
      // Aici ar fi logica pentru:
      // - Crop la aspect ratio-ul selectat
      // - Conversie la WEBP/AVIF
      // - Generare srcset pentru responsive images
      // - Upload la server/cloud storage
      
      const processedImageData = {
        url: selectedImage, // În realitate ar fi URL-ul de pe server
        altText: altText.trim(),
        caption: caption.trim() || undefined,
        license: license.trim() || undefined,
      };

      onImageSelect(processedImageData);
      
      // Reset form
      setSelectedImage(null);
      setAltText("");
      setCaption("");
      setLicense("");
      setCropRatio("original");
      
      onClose();
    } catch (error) {
      console.error("Eroare la procesarea imaginii:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const cropRatios = [
    { value: "original", label: "Original" },
    { value: "1:1", label: "1:1 (Pătrat)" },
    { value: "4:3", label: "4:3 (Landscape)" },
    { value: "16:9", label: "16:9 (Widescreen)" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Media Manager - Upload & Procesare Imagine
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload" className="text-white">
                Selectează imagine
              </Label>
              <Input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            {!selectedImage && (
              <Card className="border-dashed border-gray-600 bg-gray-800/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-400 text-center">
                    Drag & drop sau selectează o imagine pentru upload
                    <br />
                    <span className="text-sm">Suportat: JPG, PNG, WebP (max 10MB)</span>
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="mt-4"
                  >
                    Selectează fișier
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview & Settings */}
          {selectedImage && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Image Preview */}
                <div className="space-y-2">
                  <Label className="text-white">Preview</Label>
                  <div className="relative bg-gray-800 rounded-lg p-4">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full max-h-64 object-cover rounded"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="crop-ratio" className="text-white">
                      <Crop className="w-4 h-4 inline mr-1" />
                      Aspect Ratio
                    </Label>
                    <Select value={cropRatio} onValueChange={setCropRatio}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {cropRatios.map((ratio) => (
                          <SelectItem key={ratio.value} value={ratio.value} className="text-white">
                            {ratio.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="alt-text" className="text-white">
                      Alt Text <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="alt-text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Descriere obligatorie pentru accessibility..."
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    {!altText.trim() && (
                      <p className="text-red-400 text-sm mt-1">Alt text este obligatoriu</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="caption" className="text-white">Caption (opțional)</Label>
                    <Input
                      id="caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Caption pentru imagine..."
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="license" className="text-white">Licență/Sursă (opțional)</Label>
                    <Textarea
                      id="license"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      placeholder="© Autor/Sursă, CC BY 4.0, etc..."
                      className="bg-gray-800 border-gray-600 text-white h-20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setSelectedImage(null)}
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Anulează
                </Button>
                <Button
                  onClick={processImage}
                  disabled={!altText.trim() || isProcessing}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isProcessing ? "Se procesează..." : "Procesează & Utilizează"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}