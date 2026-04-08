import { Leaf, TrendingUp, Droplets } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AboutSection = () => (
  <section id="about" className="py-24 bg-muted/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <span className="text-sm font-semibold text-primary uppercase tracking-widest">About Us</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          What is Seed2Harvest?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Seed2Harvest is an AI-powered platform that helps farmers make data-driven decisions — from sowing to harvest.
          It combines machine learning, real-time weather data, and smart analytics to boost productivity and reduce waste.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid md:grid-cols-3 gap-6 mt-14 max-w-4xl mx-auto"
      >
        {[
          { icon: Leaf, title: "Smarter Farming", desc: "Get AI recommendations tailored to your crop, soil, and weather conditions." },
          { icon: TrendingUp, title: "Higher Yields", desc: "Predict outcomes before planting to maximize your harvest potential." },
          { icon: Droplets, title: "Save Resources", desc: "Optimize water and fertilizer usage with precision agriculture insights." },
        ].map((card) => (
          <motion.div
            key={card.title}
            variants={item}
            whileHover={{ y: -6, scale: 1.02 }}
            className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <card.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-lg">{card.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
