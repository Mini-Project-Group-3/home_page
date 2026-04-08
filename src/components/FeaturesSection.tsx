import { Leaf, BarChart3, Droplets, CloudSun } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Leaf,
    emoji: "🌿",
    title: "Crop Disease Detection",
    desc: "Upload a leaf image and detect diseases instantly using AI.",
    color: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    emoji: "📊",
    title: "Yield Prediction",
    desc: "Predict crop yield using machine learning models.",
    color: "bg-blue-500/10",
  },
  {
    icon: Droplets,
    emoji: "💧",
    title: "Irrigation Recommendation",
    desc: "Get smart irrigation suggestions based on soil data.",
    color: "bg-cyan-500/10",
  },
  {
    icon: CloudSun,
    emoji: "🌦",
    title: "Weather Insights",
    desc: "Use weather data for better farming decisions.",
    color: "bg-amber-500/10",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <span className="text-sm font-semibold text-primary uppercase tracking-widest">Features</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          Powerful Features
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Everything you need to farm smarter — powered by AI and real-time data.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.03 }}
            className="group p-6 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 cursor-default"
          >
            <motion.div
              className={`w-14 h-14 rounded-xl ${f.color} flex items-center justify-center mb-4`}
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <f.icon className="h-7 w-7 text-primary" />
            </motion.div>
            <h3 className="font-semibold text-foreground text-lg">
              {f.emoji} {f.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
