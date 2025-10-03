import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Users, Mail, Phone, Calendar, CheckCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const Pacientes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos'); // 'todos' | 'ativo' | 'pendente'

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getPatients(user.id);
      setPatients(data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [user.id]);

  useEffect(() => {
    const handleFocus = () => loadPatients();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // 🎯 Filtragem por nome e status
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'todos' || p.status === filterStatus;
      return matchesName && matchesStatus;
    });
  }, [patients, search, filterStatus]);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Título com animação */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Users className="w-8 h-8 text-light" />
        <h1 className="text-3xl font-bold text-white">Meus Pacientes</h1>
      </motion.div>

      {/* Barra de busca */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>

      {/* Filtros de status */}
      <div className="flex gap-2">
        {['todos', 'ativo', 'pendente'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 text-sm rounded-full border ${
              filterStatus === status
                ? 'bg-accent text-white border-accent'
                : 'bg-white text-dark border-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Lista de pacientes */}
      <div className="grid gap-6">
        {filteredPatients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center py-12 bg-white">
              <Users className="w-16 h-16 text-dark/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">Nenhum paciente encontrado</h3>
              <p className="text-dark/70">Tente ajustar os filtros ou a busca.</p>
            </Card>
          </motion.div>
        ) : (
          filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow bg-white p-4"
                onClick={() => navigate(`/pacientes/${patient.id}`)}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-light to-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-white" />
                  </div>

                  {/* Dados principais */}
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-semibold text-dark">{patient.name}</h3>
                    <p className="text-sm text-dark/60">Paciente #{patient.id}</p>

                    <div className="text-sm text-dark/70 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Último agendamento: 12/09/2025</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{patient.email || 'sem email cadastrado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone || 'sem telefone cadastrado'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status e ação */}
                  <div className="text-right space-y-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                        patient.status === 'ativo'
                          ? 'bg-green-100 text-green-700'
                          : patient.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {patient.status || 'pendente'}
                    </span>

                    <button className="mt-2 text-sm text-accent hover:underline flex items-center gap-1">
                      Ver detalhes
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};