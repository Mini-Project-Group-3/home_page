import { useState } from "react";
import { Landmark, ExternalLink, ArrowRight, IndianRupee, Shield, Droplets, Leaf, BarChart3, Warehouse, Sprout, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SchemeApplicationForm from "./SchemeApplicationForm";

const schemes = [
  {
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    desc: "₹6,000 per year direct income support to all landholding farmer families in three equal installments.",
    url: "https://pmkisan.gov.in/",
    icon: IndianRupee,
    benefits: ["₹6,000/year", "Direct bank transfer", "3 installments"],
    eligibility: "All landholding farmer families",
    color: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    name: "PMFBY",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    desc: "Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities.",
    url: "https://pmfby.gov.in/",
    icon: Shield,
    benefits: ["Crop insurance", "Natural calamity cover", "Low premium"],
    eligibility: "All farmers growing notified crops",
    color: "from-blue-500/20 to-blue-600/5",
  },
  {
    name: "KCC",
    fullName: "Kisan Credit Card",
    desc: "Provides affordable credit to farmers for crop production, post-harvest expenses, and allied agricultural activities.",
    url: "https://www.pmkisan.gov.in/",
    icon: CreditCard,
    benefits: ["Low interest credit", "Flexible repayment", "Insurance cover"],
    eligibility: "All farmers, fishers, animal husbandry",
    color: "from-amber-500/20 to-amber-600/5",
  },
  {
    name: "Soil Health Card",
    fullName: "Soil Health Card Scheme",
    desc: "Provides soil nutrient status and recommends appropriate dosage of nutrients to improve soil health and fertility.",
    url: "https://soilhealth.dac.gov.in/",
    icon: BarChart3,
    benefits: ["Free soil testing", "Nutrient recommendations", "Better yields"],
    eligibility: "All farmers across India",
    color: "from-orange-500/20 to-orange-600/5",
  },
  {
    name: "e-NAM",
    fullName: "National Agriculture Market",
    desc: "Pan-India electronic trading portal linking APMCs to create a unified national market for agricultural commodities.",
    url: "https://enam.gov.in/",
    icon: Warehouse,
    benefits: ["Better price discovery", "Online trading", "Reduced middlemen"],
    eligibility: "Farmers, traders, buyers",
    color: "from-violet-500/20 to-violet-600/5",
  },
  {
    name: "PMKSY",
    fullName: "Pradhan Mantri Krishi Sinchayee Yojana",
    desc: "Ensures water availability to every farm through 'Har Khet Ko Pani' and promotes micro-irrigation for water efficiency.",
    url: "https://pmksy.gov.in/",
    icon: Droplets,
    benefits: ["Micro-irrigation", "Water efficiency", "Subsidy support"],
    eligibility: "All farmers for irrigation",
    color: "from-cyan-500/20 to-cyan-600/5",
  },
  {
    name: "PKVY",
    fullName: "Paramparagat Krishi Vikas Yojana",
    desc: "Promotes organic farming through cluster-based approach with certification and marketing support for farmers.",
    url: "https://pgsindia-ncof.gov.in/",
    icon: Leaf,
    benefits: ["Organic certification", "₹50,000/ha support", "Marketing help"],
    eligibility: "Farmer groups (clusters of 50+)",
    color: "from-green-500/20 to-green-600/5",
  },
  {
    name: "RKVY",
    fullName: "Rashtriya Krishi Vikas Yojana",
    desc: "Incentivizes states to increase investment in agriculture by providing flexible funding for agriculture development.",
    url: "https://rkvy.nic.in/",
    icon: Sprout,
    benefits: ["Flexible funding", "State-level projects", "Agri innovation"],
    eligibility: "State governments & farmers",
    color: "from-teal-500/20 to-teal-600/5",
  },
];

const SchemesSection = () => {
  const [selectedScheme, setSelectedScheme] = useState<typeof schemes[0] | null>(null);

  return (
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
            Schemes for Indian Farmers
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Explore key government schemes designed to support and empower farmers across India. Click <strong>"Apply Now"</strong> to submit your details.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {schemes.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-primary/30 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${s.color} p-5 pb-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-primary">{s.name}</span>
                    </div>
                    <a href={s.url} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-background/50 transition-colors">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm leading-snug">{s.fullName}</h3>
                </div>

                <div className="p-5 pt-3 flex flex-col flex-1">
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>

                  {/* Benefits */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.benefits.map((b) => (
                      <span key={b} className="inline-block rounded-full bg-primary/10 text-primary text-[10px] font-medium px-2 py-0.5">
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Eligibility */}
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">Eligibility:</span> {s.eligibility}
                  </p>

                  {/* Apply button */}
                  <button
                    onClick={() => setSelectedScheme(s)}
                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
                  >
                    Apply Now <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedScheme && (
          <SchemeApplicationForm scheme={selectedScheme} onClose={() => setSelectedScheme(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default SchemesSection;
