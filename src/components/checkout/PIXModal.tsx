import { useState } from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PIXModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  pixCode?: string;
}

export default function PIXModal({ isOpen, onClose, amount = 19.85, pixCode = "00020126580014BR.GOV.BCB.PIX01362020030301040198552040005303986" }: PIXModalProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setIsCopied(true);
      toast({
        title: "Código copiado!",
        description: "O código PIX foi copiado para sua área de transferência.",
      });
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o código PIX.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="pix-modal">
      <div 
        className="bg-card rounded-xl max-w-md w-full animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold" data-testid="pix-title">Pagamento PIX</h3>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="close-pix">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mb-6">
            <p className="text-muted-foreground mb-4">
              Escaneie o QR Code abaixo para realizar o pagamento
            </p>
            
            {/* PIX QR Code */}
            <div className="w-48 h-48 mx-auto bg-muted rounded-lg qr-code mb-4 relative">
              {/* Simple QR code pattern - in production, use a real QR code generator */}
              <div className="absolute inset-4 grid grid-cols-8 gap-1">
                {Array.from({ length: 64 }, (_, i) => (
                  <div 
                    key={i}
                    className={`aspect-square rounded-sm ${
                      Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 px-2 py-1 rounded text-xs font-mono">
                  QR PIX
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Valor: <span className="font-semibold text-primary" data-testid="pix-amount">
                R$ {amount.toFixed(2).replace('.', ',')}
              </span>
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleCopyCode}
              className={`w-full ${
                isCopied 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
              } transition-colors`}
              data-testid="copy-pix-code"
            >
              {isCopied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Código Copiado!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Código PIX
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground" data-testid="pix-instructions">
              Após o pagamento, seu pedido será confirmado automaticamente
            </p>
            
            <div className="border-t pt-3 mt-4">
              <p className="text-xs text-muted-foreground mb-2">
                Chave PIX (para cópia manual):
              </p>
              <div className="bg-muted p-2 rounded text-xs font-mono break-all">
                {pixCode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
