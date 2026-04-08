import heroImg from "@/assets/hero-farm.jpg";
import { ArrowRight, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <motion.img
          src={heroImg}
          alt="Farmland"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/65 to-foreground/20" />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}

      <div className="container relative mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-semibold text-primary-foreground backdrop-blur-sm border border-primary/30 mb-6"
          >
            🌾 AI-Powered Agriculture
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight"
          >
            Empowering Farmers{" "}
            <motion.span
              className="inline-block"
              animate={{ rotate: [0, 10, -5, 0] }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              with AI 🌾
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-5 text-lg sm:text-xl text-primary-foreground/80 leading-relaxed"
          >
            Predict crop yield, detect diseases, and optimize irrigation using intelligent technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <a
              href="#features"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/dashboard.html"
              className="inline-flex items-center gap-2 rounded-lg bg-card/90 backdrop-blur-sm px-7 py-3.5 text-base font-semibold text-foreground shadow-lg hover:bg-card hover:scale-105 transition-all border border-border"
            >
              <BarChart3 className="h-4 w-4" /> Open Dashboard
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-12 flex gap-8 flex-wrap"
          >
            {[
              { val: "100+", label: "Crops Supported" },
              { val: "ML", label: "Powered Models" },
              { val: "Real-time", label: "Weather Data" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-primary-foreground">{s.val}</div>
                <div className="text-sm text-primary-foreground/60">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/60" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
