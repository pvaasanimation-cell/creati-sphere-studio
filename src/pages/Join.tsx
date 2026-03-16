import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { CheckCircle } from "lucide-react";

const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };
const workTypes = ["Animator", "Designer", "Editor", "Developer"];

const Join = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", email: "", phone: "", work: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to Supabase
    setSubmitted(true);
  };

  return (
    <div className="noise-bg pt-32 min-h-screen">
      <section className="py-[10vh]">
        <div className="container mx-auto px-6 max-w-xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="text-center mb-12">
            <span className="text-interface text-primary mb-4 block">Join Us</span>
            <h1 className="text-display text-4xl md:text-5xl text-foreground mb-4">
              Join the <span className="gradient-purple-cyan">Pulse</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Become part of a global collective of animators, designers, and creative technologists.
            </p>
          </motion.div>

          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.2 }}
            >
              <GlassCard className="p-8" hover={false}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                    { key: "age", label: "Age", type: "number", placeholder: "Your age" },
                    { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
                    { key: "phone", label: "Phone", type: "tel", placeholder: "+1 234 567 890" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-interface text-muted-foreground mb-2 block">{field.label}</label>
                      <input
                        type={field.type}
                        required
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-interface text-muted-foreground mb-2 block">Work Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {workTypes.map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setForm({ ...form, work: w })}
                          className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                            form.work === w
                              ? "gradient-bg-purple-cyan text-primary-foreground"
                              : "bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!form.work}
                    className="w-full py-4 rounded-xl gradient-bg-purple-cyan text-primary-foreground font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    Summon the Studio
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={transition}
            >
              <GlassCard className="p-12 text-center" hover={false}>
                <div className="w-16 h-16 rounded-full bg-green-500/10 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to PVAAS!</h2>
                <p className="text-muted-foreground">
                  Your application has been received. We'll be in touch soon.
                </p>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Join;
