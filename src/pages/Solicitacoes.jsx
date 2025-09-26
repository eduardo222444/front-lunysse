import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { mockApi } from "../services/mockApi";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Button } from "../components/Button";
import { useToast } from "../components/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, UserCircle2, Clock, XCircle, CheckCircle2 } from "lucide-react";

export const Solicitacoes = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    fetchRequests();
  }, [user.id]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getRequests(user.id);
      setRequests(data.filter((req) => req.status === "pendente"));
    } catch (err) {
      console.error(err);
      addToast("Erro ao carregar solicitações", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id, req) => {
    setProcessing((prev) => new Set([...prev, id]));
    try {
      const existing = await mockApi.getPatients(user.id);
      if (existing.some((p) => p.email === req.patientEmail)) {
        addToast("Este paciente já existe na sua lista!", "error");
        return;
      }

      await mockApi.createPatient({
        name: req.patientName,
        email: req.patientEmail,
        phone: req.patientPhone,
        birthDate: "1990-01-01",
        age: 30,
        status: "Ativo",
        psychologistId: user.id,
      });

      await mockApi.updateRequestStatus(id, "aceito", "Paciente aceito");
      setRequests((prev) => prev.filter((r) => r.id !== id));
      addToast("Solicitação aceita com sucesso!", "success");
    } catch (err) {
      console.error(err);
      addToast("Erro ao aceitar solicitação", "error");
    } finally {
      setProcessing((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }
  };

  const handleReject = async (id) => {
    setProcessing((prev) => new Set([...prev, id]));
    try {
      await mockApi.updateRequestStatus(id, "rejeitado", "Recusada pelo psicólogo");
      setRequests((prev) => prev.filter((r) => r.id !== id));
      addToast("Solicitação rejeitada", "info");
    } catch (err) {
      console.error(err);
      addToast("Erro ao rejeitar solicitação", "error");
    } finally {
      setProcessing((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    }
  };

  const urgencyColors = {
    alta: "bg-red-100 text-red-700",
    media: "bg-yellow-100 text-yellow-700",
    baixa: "bg-green-100 text-green-700",
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Bell className="w-9 h-9 text-accent" />
        <h1 className="text-3xl font-bold text-white">Solicitações Pendentes</h1>
      </div>
      

      {/* Lista */}
      {requests.length === 0 ? (
        <div className="text-center py-16 bg-dark/30 rounded-2xl border border-dark/40">
          <UserCircle2 className="w-20 h-20 text-dark/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark">Nenhuma solicitação</h3>
          <p className="text-dark/60 text-sm">Quando pacientes solicitarem atendimento, aparecerão aqui.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {requests.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-2xl bg-dark/40 border border-dark/50 shadow-lg hover:shadow-xl transition"
              >
                {/* Topo */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                    <UserCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{req.patientName}</h3>
                    <p className="text-sm text-gray-300">{req.patientEmail}</p>
                    <p className="text-sm text-gray-400">{req.patientPhone}</p>
                  </div>
                </div>
                

                {/* Descrição */}
                {req.description && (
                  <p className="text-sm text-gray-200 bg-dark/30 p-3 rounded-lg mb-4">
                    {req.description}
                  </p>
                )}

                {/* Rodapé */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      urgencyColors[req.urgency] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {req.urgency === "alta"
                      ? "Alta urgência"
                      : req.urgency === "media"
                      ? "Média urgência"
                      : "Baixa urgência"}
                  </span>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleReject(req.id)}
                      loading={processing.has(req.id)}
                      className="flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Rejeitar
                    </Button>
                    <Button
                      onClick={() => handleAccept(req.id, req)}
                      loading={processing.has(req.id)}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Aceitar
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};