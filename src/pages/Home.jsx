import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Calendar, Activity, FileText } from 'lucide-react';
import { Button } from '../components/Button';

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      {/* ================= HERO SECTION ================= */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl flex flex-col items-center"
        >
         <div className="w-65 h-65 flex items-center justify-center mb-6 overflow-hidden">
  <img src="/logo.png" alt="Scheduling" className="w-full h-full object-cover" />
</div>
<h1 className="text-5xl md:text-6xl font-bold text-zinc-50 mb-6 drop-shadow-[2px_2px_6px_rgba(0,123,255,0.8)]">
  Scheduling
</h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 w-full">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto btn-primary rounded-xl shadow-md">
                Começar Agora
              </Button>
            </Link>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto btn-ghost rounded-xl shadow-md border border-light"
              >
                Conhecer Recursos
              </Button>
            </a>
          </div>
          <p className="text-lg text-light max-w-3xl mx-auto leading-relaxed drop-shadow-[2px_2px_6px_rgba(255,255,255,0.8)]">
            Cuidando da mente com organização, acessibilidade e acolhimento..
          </p>
        </motion.div>
      </section>
    </div>
  );
};