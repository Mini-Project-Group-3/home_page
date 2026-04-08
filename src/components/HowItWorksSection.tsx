import { Upload, Cpu, Zap } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: Upload, step: "01", title: "Enter Data or Upload Image", desc: "Provide crop details, soil parameters, or upload a leaf photo." },
  { icon: Cpu, step: "02", title: "AI Processes Input", desc: "Our ML models analyze your data with real-time weather context." },
  { icon: Zap, step: "03", title: "Get Instant Results", desc: "Receive yield predictions, irrigation plans, or disease reports immediately." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-24 bg-muted/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <span className="text-sm font-semibold text-primary uppercase tracking-widest">Process</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          How It Works
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
          Three simple steps to smarter agriculture.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-14 max-w-4xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="relative text-center"
          >
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
            )}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5"
            >
              <s.icon className="h-8 w-8 text-primary" />
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                {s.step}
              </span>
            </motion.div>
            <h3 className="font-semibold text-foreground text-lg">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
