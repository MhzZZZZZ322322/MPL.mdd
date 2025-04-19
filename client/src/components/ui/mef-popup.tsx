import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MefPopupProps {
  buttonText?: string;
}

export function MefPopup({ buttonText = "POP 🎮" }: MefPopupProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        variant="ghost" 
        className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-4 py-2 text-sm font-bold flex items-center gap-1"
      >
        MEF <span className="text-lg">🎮</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-black border-primary/30">
          <DialogTitle className="text-xl font-bold text-white">MEF - Gerara Here!</DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Easter egg pentru fanii esport
          </DialogDescription>
          
          <div className="flex flex-col items-center p-2 mt-4">
            <div className="w-full max-w-sm mx-auto rounded-lg overflow-hidden bg-black border border-primary/30">
              <img 
                src="/images/mef-image.png" 
                alt="MEF Animation"
                className="w-full h-auto"
                loading="eager"
              />
            </div>
            <p className="text-primary mt-4 text-center text-sm font-semibold">
              "Gotta count on someone else man, cuz Gerara here!"
            </p>
            <div className="mt-5">
              <Button 
                onClick={() => setOpen(false)}
                variant="default"
                className="bg-primary hover:bg-primary/90"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}