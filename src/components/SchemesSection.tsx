import { Landmark, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const schemes = [
  {
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    desc: "₹6,000 per year direct income support to all landholding farmer families in three equal installments.",
    url: "https://pmkisan.gov.in/",
  },
  {
    name: "PMFBY",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    desc: "Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities.",
    url: "https://pmfby.gov.in/",
  },
  {
    name: "KCC",
    fullName: "Kisan Credit Card",
    desc: "Provides affordable credit to farmers for crop production, post-harvest expenses, and allied agricultural activities.",
    url: "https://www.pmkisan.gov.in/",
  },
  {
    name: "Soil Health Card",
    fullName: "Soil Health Card Scheme",
    desc: "Provides soil nutrient status and recommends appropriate dosage of nutrients to improve soil health and fertility.",
    url: "https://soilhealth.dac.gov.in/",
  },
  {
    name: "e-NAM",
    fullName: "National Agriculture Market",
    desc: "Pan-India electronic trading portal linking APMCs to create a unified national market for agricultural commodities.",
    url: "https://enam.gov.in/",
  },
  {
    name: "PMKSY",
    fullName: "Pradhan Mantri Krishi Sinchayee Yojana",
    desc: "Ensures water availability to every farm through 'Har Khet Ko Pani' and promotes micro-irrigation for water efficiency.",
    url: "https://pmksy.gov.in/",
  },
  {
    name: "PKVY",
    fullName: "Paramparagat Krishi Vikas Yojana",
    desc: "Promotes organic farming through cluster-based approach with certification and marketing support for farmers.",
    url: "https://pgsindia-ncof.gov.in/",
  },
  {
    name: "RKVY",
    fullName: "Rashtriya Krishi Vikas Yojana",
    desc: "Incentivizes states to increase investment in agriculture by providing flexible funding for agriculture development.",
    url: "https://rkvy.nic.in/",
  },
];

const SchemesSection = () => (
  <section id="schemes" className="py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <span className="text-sm font-semibold text-primary uppercase tracking-widest">Government Support</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
          🇮🇳 Schemes for Indian Farmers
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Key government schemes designed to support and empower farmers across India.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
        {schemes.map((s, i) => (
          <motion.a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group block p-5 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-primary">{s.name}</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold text-foreground text-sm leading-snug">{s.fullName}</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">{s.desc}</p>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default SchemesSection;
