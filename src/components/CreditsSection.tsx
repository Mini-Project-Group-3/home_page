import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const CreditsSection = () => (
  <section id="credits" className="py-24 bg-muted/50">
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-sm font-semibold text-primary uppercase tracking-widest">Team</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">Credits</h2>
        <div className="mt-8 inline-flex flex-col items-center gap-3 p-8 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)]">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="h-8 w-8 text-primary" />
          </motion.div>
          <h3 className="font-display text-xl font-bold text-foreground">Team Seed2Harvest</h3>
          <p className="text-muted-foreground">Project: <strong className="text-foreground">Seed2Harvest</strong></p>
          <p className="text-sm text-muted-foreground">Built for Hackathon / Academic Project</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            🚀 FastAPI · ML Models · Weather API
          </span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CreditsSection;
