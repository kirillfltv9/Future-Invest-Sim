import { Link } from "wouter";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-destructive/20 blur-[50px] rounded-full pointer-events-none" />
        
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6 relative z-10" />
        <h1 className="text-4xl font-display font-bold mb-2 relative z-10">404</h1>
        <h2 className="text-xl font-medium mb-4 text-muted-foreground relative z-10">Signal Lost</h2>
        <p className="text-sm text-muted-foreground mb-8 relative z-10">
          The coordinate you're looking for doesn't exist in this market simulation.
        </p>
        
        <Link href="/" className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-all hover:-translate-y-1 relative z-10">
          <ArrowLeft className="w-5 h-5" />
          Return to Base
        </Link>
      </div>
    </div>
  );
}
