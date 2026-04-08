import { Sprout } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card py-8">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Sprout className="h-5 w-5 text-primary" />
        <span className="font-display font-bold text-foreground">Seed2Harvest</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Seed2Harvest — Smart Agriculture Platform
      </p>
    </div>
  </footer>
);

export default Footer;
