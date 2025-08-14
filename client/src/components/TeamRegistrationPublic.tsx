import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { Plus, Minus, Save, Upload, Image, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  nickname: string;
  faceitProfile: string;
  discordAccount: string;
  role: string;
  position: string;
}

interface TeamFormData {
  name: string;
  logoFile: File | null;
  logoUrl: string;
  members: TeamMember[];
}

export default function TeamRegistrationPublic() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    logoFile: null,
    logoUrl: "",
    members: [
      { nickname: "", faceitProfile: "", discordAccount: "", role: "captain", position: "main" },
      { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
      { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
      { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
      { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" },
    ]
  });

  // Upload logo mutation
  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await fetch('/api/upload/team-logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload logo");
      }

      return response.json();
    },
  });

  // Submit team registration mutation
  const submitTeamMutation = useMutation({
    mutationFn: async (teamData: TeamFormData) => {
      let logoUrl = teamData.logoUrl;
      let logoData = null;

      // Upload logo if file is provided
      if (teamData.logoFile) {
        const uploadResult = await uploadLogoMutation.mutateAsync(teamData.logoFile);
        logoUrl = uploadResult.url;
        logoData = uploadResult.logoData;
      }

      // Create team registration
      const teamResponse = await fetch('/api/kingston/register-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamData.name,
          logoUrl: logoUrl,
          members: teamData.members.filter(m => m.nickname && m.faceitProfile && m.discordAccount)
        }),
      });

      if (!teamResponse.ok) {
        const error = await teamResponse.text();
        throw new Error(error);
      }

      const teamResult = await teamResponse.json();

      // Update team with logo data if we have it
      if (logoData && teamResult.teamId) {
        await fetch('/api/kingston/update-team-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teamId: teamResult.teamId,
            logoUrl: logoUrl,
            logoData: logoData
          }),
        });
      }

      return teamResult;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Cererea a fost trimisă!",
        description: "Echipa ta a fost înregistrată și urmează să fie verificată de admin",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, logoFile: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, logoUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Fișier invalid",
        description: "Te rog încarcă doar imagini (PNG, JPG, GIF)",
        variant: "destructive",
      });
    }
  };

  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { nickname: "", faceitProfile: "", discordAccount: "", role: "player", position: "main" }]
    }));
  };

  const removeMember = (index: number) => {
    if (formData.members.length > 5) {
      setFormData(prev => ({
        ...prev,
        members: prev.members.filter((_, i) => i !== index)
      }));
    }
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: "Date incomplete",
        description: "Te rog completează numele echipei",
        variant: "destructive",
      });
      return;
    }

    if (!formData.logoFile && !formData.logoUrl) {
      toast({
        title: "Logo lipsă",
        description: "Te rog încarcă logo-ul echipei",
        variant: "destructive",
      });
      return;
    }

    const validMembers = formData.members.filter(m => m.nickname && m.faceitProfile && m.discordAccount);
    if (validMembers.length < 5) {
      toast({
        title: "Echipă incompletă",
        description: "O echipă trebuie să aibă minimum 5 jucători (maximum 10: 5 roster + 5 substitute)",
        variant: "destructive",
      });
      return;
    }

    submitTeamMutation.mutate(formData);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto bg-green-900/20 border-green-500/30">
        <CardContent className="text-center py-12">
          <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-400 mb-2">Cererea a fost trimisă cu succes!</h2>
          <p className="text-green-300 mb-4">
            Echipa ta a fost înregistrată și urmează să fie verificată de către administratori.
            Vei fi contactat pe Discord pentru confirmarea finală.
          </p>
          <p className="text-sm text-gray-400">
            Procesul de verificare poate dura între 24-48 de ore.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Înregistrare Echipă - Kingston FURY x HyperX Supercup
        </CardTitle>
        <p className="text-center text-gray-400">
          Completează toate datele pentru a-ți înregistra echipa în turneu
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="teamName">Numele echipei *</Label>
              <Input
                id="teamName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Team Phoenix"
                required
              />
            </div>

            {/* Logo Upload */}
            <div>
              <Label>Logo echipă *</Label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {formData.logoUrl ? (
                  <div className="space-y-2">
                    <img
                      src={formData.logoUrl}
                      alt="Logo preview"
                      className="w-16 h-16 mx-auto rounded object-cover"
                    />
                    <p className="text-sm text-green-400">Logo încărcat cu succes</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Schimbă logo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-400">
                      Trage și lasă logo-ul aici sau 
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto ml-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        click pentru a încărca
                      </Button>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF până la 5MB</p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg">Participanți echipă (minimum 5)</Label>
              <Button
                type="button"
                onClick={addMember}
                variant="outline"
                size="sm"
                disabled={formData.members.length >= 10}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adaugă jucător
              </Button>
            </div>

            <div className="space-y-4">
              {formData.members.map((member, index) => (
                <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Jucător {index + 1}</h4>
                    {formData.members.length > 5 && (
                      <Button
                        type="button"
                        onClick={() => removeMember(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div>
                      <Label>Nickname *</Label>
                      <Input
                        value={member.nickname}
                        onChange={(e) => updateMember(index, 'nickname', e.target.value)}
                        placeholder="Ex: ProPlayer123"
                        required
                      />
                    </div>

                    <div>
                      <Label>Profil Faceit *</Label>
                      <Input
                        value={member.faceitProfile}
                        onChange={(e) => updateMember(index, 'faceitProfile', e.target.value)}
                        placeholder="https://faceit.com/player123"
                        required
                      />
                    </div>

                    <div>
                      <Label>Discord *</Label>
                      <Input
                        value={member.discordAccount}
                        onChange={(e) => updateMember(index, 'discordAccount', e.target.value)}
                        placeholder="user#1234"
                        required
                      />
                    </div>

                    <div>
                      <Label>Rol</Label>
                      <Select
                        value={member.role}
                        onValueChange={(value) => updateMember(index, 'role', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="captain">Căpitan</SelectItem>
                          <SelectItem value="player">Jucător</SelectItem>
                          <SelectItem value="coach">Antrenor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Poziție</Label>
                      <Select
                        value={member.position}
                        onValueChange={(value) => updateMember(index, 'position', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">Main</SelectItem>
                          <SelectItem value="substitute">Schimb</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-400">Important</h4>
                <p className="text-sm text-amber-300 mt-1">
                  După trimiterea cererii, echipa ta va fi verificată de administratori în 24-48 ore. 
                  Vei fi contactat pe Discord pentru confirmarea finală a înregistrării.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitTeamMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {submitTeamMutation.isPending ? "Se trimite..." : "Înregistrează echipa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}