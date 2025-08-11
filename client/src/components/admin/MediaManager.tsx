import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Image, Crop, Settings, X, Check } from "lucide-react";

interface MediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageData: {
    url: string;
    altText: string;
    caption: string;
    license: string;
  }) => void;
}

export function MediaManager({ isOpen, onClose, onImageSelect }: MediaManagerProps) {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [imageMetadata, setImageMetadata] = useState({
    altText: "",
    caption: "",
    license: "",
    category: "",
  });
  const [processingFormat, setProcessingFormat] = useState("webp");
  const [compressionLevel, setCompressionLevel] = useState(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Convert to desired format with compression
        const quality = compressionLevel / 100;
        const processedDataURL = canvas.toDataURL(`image/${processingFormat}`, quality);
        
        setSelectedImage(processedDataURL);
        setImageMetadata(prev => ({
          ...prev,
          altText: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
        }));
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [processingFormat, compressionLevel]);

  const handleApplyImage = () => {
    if (!selectedImage || !imageMetadata.altText.trim()) return;

    onImageSelect({
      url: selectedImage,
      altText: imageMetadata.altText,
      caption: imageMetadata.caption,
      license: imageMetadata.license,
    });

    // Reset form
    setSelectedImage("");
    setImageMetadata({
      altText: "",
      caption: "",
      license: "",
      category: "",
    });
    
    onClose();
  };

  const predefinedCategories = [
    "Turnee", "Știri", "Echipe", "Jucători", "Gaming", "Esports", "Evenimente", "Analize"
  ];

  const licenseOptions = [
    "© Moldova Pro League",
    "CC BY 4.0",
    "CC BY-SA 4.0", 
    "CC0 (Public Domain)",
    "Fair Use",
    "Proprie",
    "Getty Images",
    "Unsplash"
  ];

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Settings className="mr-2" />
              Media Manager Avansat
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Label>Încărcare și procesare imagine</Label>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Format de ieșire</Label>
                      <Select value={processingFormat} onValueChange={setProcessingFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="webp">WEBP (recomandat)</SelectItem>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Calitate compresie: {compressionLevel}%</Label>
                      <input 
                        type="range" 
                        min="50" 
                        max="100" 
                        value={compressionLevel}
                        onChange={(e) => setCompressionLevel(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isProcessing ? "Procesare..." : "Selectează imagine"}
                    </Button>
                    
                    {selectedImage && (
                      <Badge variant="outline" className="text-green-600">
                        <Check className="w-3 h-3 mr-1" />
                        Procesată
                      </Badge>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Preview & Metadata */}
            {selectedImage && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Preview imagine</Label>
                  <div className="mt-2 border rounded-lg p-4">
                    <img 
                      src={selectedImage} 
                      alt={imageMetadata.altText || "Preview"}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="alt-text">Alt Text (obligatoriu) *</Label>
                    <Input
                      id="alt-text"
                      value={imageMetadata.altText}
                      onChange={(e) => setImageMetadata(prev => ({ ...prev, altText: e.target.value }))}
                      placeholder="Descriere detaliată pentru accessibility..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="caption">Caption</Label>
                    <Input
                      id="caption"
                      value={imageMetadata.caption}
                      onChange={(e) => setImageMetadata(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="Caption afișat sub imagine..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select 
                      value={imageMetadata.category}
                      onValueChange={(value) => setImageMetadata(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează categoria..." />
                      </SelectTrigger>
                      <SelectContent>
                        {predefinedCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="license">Licență/Sursă</Label>
                    <Select 
                      value={imageMetadata.license}
                      onValueChange={(value) => setImageMetadata(prev => ({ ...prev, license: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează licența..." />
                      </SelectTrigger>
                      <SelectContent>
                        {licenseOptions.map((license) => (
                          <SelectItem key={license} value={license}>
                            {license}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Anulează
              </Button>
              
              <Button 
                onClick={handleApplyImage}
                disabled={!selectedImage || !imageMetadata.altText.trim()}
              >
                <Check className="w-4 h-4 mr-2" />
                Aplică imagine
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}