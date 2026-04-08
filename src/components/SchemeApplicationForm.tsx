import { useState } from "react";
import { X, Send, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Scheme {
  name: string;
  fullName: string;
}

interface SchemeApplicationFormProps {
  scheme: Scheme;
  onClose: () => void;
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const SchemeApplicationForm = ({ scheme, onClose }: SchemeApplicationFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    farmer_name: "",
    phone: "",
    email: "",
    state: "",
    district: "",
    village: "",
    land_area_acres: "",
    aadhaar_last_four: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.farmer_name.trim() || !form.phone.trim() || !form.state || !form.district.trim()) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    if (form.phone.length < 10) {
      toast({ title: "Invalid phone", description: "Enter a valid 10-digit phone number.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("scheme_applications").insert({
      scheme_name: scheme.name,
      farmer_name: form.farmer_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      state: form.state,
      district: form.district.trim(),
      village: form.village.trim() || null,
      land_area_acres: form.land_area_acres ? Number(form.land_area_acres) : null,
      aadhaar_last_four: form.aadhaar_last_four.trim() || null,
      message: form.message.trim() || null,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Submission failed", description: "Something went wrong. Please try again.", variant: "destructive" });
      return;
    }

    setSuccess(true);
    toast({ title: "Application submitted!", description: `Your application for ${scheme.name} has been recorded.` });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Apply for {scheme.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{scheme.fullName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="h-14 w-14 text-primary mx-auto" />
            <h4 className="font-display text-xl font-bold text-foreground">Application Submitted!</h4>
            <p className="text-sm text-muted-foreground">Your application for {scheme.fullName} has been recorded. You will be contacted soon.</p>
            <button onClick={onClose} className="mt-4 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Full Name *</label>
                <input name="farmer_name" value={form.farmer_name} onChange={handleChange} required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="e.g. Ramesh Kumar" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required type="tel" maxLength={10}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="10-digit number" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Email</label>
                <input name="email" value={form.email} onChange={handleChange} type="email"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Optional" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">State *</label>
                <select name="state" value={form.state} onChange={handleChange} required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option value="">Select state</option>
                  {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">District *</label>
                <input name="district" value={form.district} onChange={handleChange} required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="e.g. Varanasi" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Village</label>
                <input name="village" value={form.village} onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Optional" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Land Area (acres)</label>
                <input name="land_area_acres" value={form.land_area_acres} onChange={handleChange} type="number" min="0" step="0.01"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Optional" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Aadhaar (last 4 digits)</label>
                <input name="aadhaar_last_four" value={form.aadhaar_last_four} onChange={handleChange} maxLength={4} pattern="\d{4}"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Optional" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Additional Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                placeholder="Any specific details or queries..." />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SchemeApplicationForm;
