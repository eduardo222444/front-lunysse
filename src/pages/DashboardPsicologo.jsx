import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';
import { Card } from '../components/Card';
import { useToast } from '../components/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Calendar,
  Users,
  Bell,
  CheckCheck,
  TrendingUp,
  Clock,
  Search,
  Filter,
  MoreVertical,
  User,
  Phone,
  Mail,
  AlertTriangle
} from 'lucide-react';
 
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};
 
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
 
export const DashboardPsicologo = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
 
  const loadData = useCallback(async () => {
    try {
      const [appointmentsData, patientsData, requestsData] = await Promise.all([
        mockApi.getAppointments(user.id, 'psicologo'),
        mockApi.getPatients(user.id),
        mockApi.getRequests(user.id)
      ]);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setRequests(requestsData);
      addToast("Dados carregados com sucesso" , "seccess");
    } catch (error) {
      addToast( "Erro ao carregar dados!", "error!");
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);
 
  useEffect(() => {
    loadData();
  }, [loadData]);
 
  if (loading) return <LoadingSpinner size="lg" />;
 
  const today = new Date();
  today.setHours(0, 0, 0, 0);
 
  const todayAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === today.getTime() && apt.status === 'agendado';
  });
 
  const totalPatients = patients.length;
  const completedSessions = appointments.filter(apt => apt.status === 'concluido').length;
  const pendingRequests = requests.filter(req => req.status === 'pendente').length;
  const attendanceRate = appointments.length > 0 ? Math.round((completedSessions / appointments.length) * 100) : 0;
 
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= new Date() && apt.status === 'agendado')
    .slice(0, 5);
 
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status.toLowerCase().includes(filterStatus);
    return matchesSearch && matchesFilter;
  });
 
  const isNewPsychologist = totalPatients === 0 && appointments.length === 0;
 
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'em tratamento': return 'bg-blue-100 text-blue-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
 
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
 
  return (
    <div className="space-y-8  ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <Card className='bg-white'>
  <h3 className="font-semibold text-dark">Pacientes Ativos</h3>
  <div className="flex justify-between items-center mt-2">
    <span className="text-2xl font-bold text-medium">6</span>
    <Users className="w-6 h-6 text-medium" />
  </div>
</Card>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-dark tracking-tight">Dashboard</h1>
          <p className="text-dark/70 font-light">Bem-vindo, {user.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-medium" />
            {pendingRequests > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingRequests}
              </span>
            )}
          </div>
        </div>
      </motion.div>
 
      {/* Welcome Message for New Psychologists */}
      {isNewPsychologist && (
        <motion.div variants={fadeInUp}>
          <Card className="text-center py-12 border-2 border-dashed border-medium/30 bg-white">
            {/* 🖼️ ESPAÇO PARA IMAGEM: Ilustração de boas-vindas para novos psicólogos */}
            <Users className="w-16 h-16 text-medium/50 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-dark mb-3">Bem-vindo ao Lunysse!</h3>
            <p className="text-dark/70 mb-4 max-w-md mx-auto font-light">
              Você é novo por aqui. Seus pacientes e agendamentos aparecerão neste dashboard
              conforme você começar a receber solicitações.
            </p>
          </Card>
        </motion.div>
      )}
 
      {/* KPIs */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { icon: Users, label: 'Pacientes Ativos', value: totalPatients, color: 'text-medium', bg: 'bg-medium/10' },
          { icon: Calendar, label: 'Sessões Hoje', value: todayAppointments.length, color: 'text-accent', bg: 'bg-accent/10' },
          { icon: CheckCheck, label: 'Sessões Concluídas', value: completedSessions, color: 'text-green-600', bg: 'bg-green-100' },
          { icon: TrendingUp, label: 'Taxa de Comparecimento', value: `${attendanceRate}%`, color: 'text-blue-600', bg: 'bg-blue-100' }
        ].map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="p-6 hover:scale-105 transition-transform duration-300 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark/70 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-black text-dark mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
 
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Appointments */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark">Sessões de Hoje</h2>
                <Clock className="w-5 h-5 text-medium" />
              </div>
             
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-dark/30 mx-auto mb-3" />
                  <p className="text-dark/70">Nenhuma sessão agendada para hoje</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map(appointment => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    return (
                      <div key={appointment.id} className="flex items-center p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors">
                        {/* 🖼️ SUBSTITUA: Avatar real do paciente */}
                        <div className="w-10 h-10 bg-medium rounded-full flex items-center justify-center text-white font-semibold mr-4">
                          {/* <img src={`/images/patients/${patient?.id}.jpg`} alt={patient?.name} className="w-10 h-10 rounded-full object-cover" /> */}
                          {patient ? getInitials(patient.name) : '?'}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-dark">{patient?.name || 'Paciente não encontrado'}</p>
                          <p className="text-sm text-dark/70">{appointment.time} • {appointment.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Agendado
                          </span>
                          <MoreVertical className="w-4 h-4 text-dark/40" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>
 
          {/* Patients List */}
          {!isNewPsychologist && (
            <motion.div variants={fadeInUp}>
              <Card className="p-6 bg-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-dark">Meus Pacientes</h2>
                  <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark/40" />
                      <input
  type="text"
  placeholder="Buscar paciente..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="input-white w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medium/20 focus:border-medium"
/>
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medium/20 focus:border-medium"
                    >
                      <option value="all">Todos</option>
                      <option value="ativo">Ativo</option>
                      <option value="tratamento">Em Tratamento</option>
                    </select>
                  </div>
                </div>
 
                <div className="space-y-3 bg-white">
                  {filteredPatients.slice(0, 6).map(patient => (
                    <div key={patient.id} className="flex items-center p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors">
                      {/* 🖼️ SUBSTITUA: Foto real do paciente */}
                      <div className="w-12 h-12 bg-gradient-to-br from-medium to-accent rounded-full flex items-center justify-center text-dark font-semibold mr-4">
                        {/* <img src={`/images/patients/${patient.id}.jpg`} alt={patient.name} className="w-12 h-12 rounded-full object-cover" /> */}
                        {getInitials(patient.name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-dark">{patient.name}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-dark/60">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {patient.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-dark">{patient.totalSessions || 0} sessões</p>
                        <p className="text-xs text-dark/60">{patient.age} anos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
 
        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Pending Requests */}
          {pendingRequests > 0 && (
            <motion.div variants={fadeInUp}>
              <Card className="p-6 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-dark">Solicitações Pendentes</h3>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    {pendingRequests}
                  </span>
                </div>
                <div className="space-y-3">
                  {requests.filter(req => req.status === 'pendente').slice(0, 3).map(request => (
                    <div key={request.id} className="p-3 bg-orange-50 rounded-lg">
                      <p className="font-medium text-dark text-sm">{request.patientName}</p>
                      <p className="text-xs text-dark/70 mt-1">{request.description.slice(0, 60)}...</p>
                      <div className="flex gap-2 mt-3">
                        <button
                      onClick={ () => addToast("Solicitação aceita com sucesso!", )}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
                          Aceitar
                        </button>
                        <button
                        onClick={ () => addToast ("solicitaçao rejeitada!")}
                        className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600">
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
 
          {/* Upcoming Appointments */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6 bg-white">
              <h3 className="font-bold text-dark mb-4">Próximos Agendamentos</h3>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="w-8 h-8 text-dark/30 mx-auto mb-2" />
                  <p className="text-sm text-dark/70">Nenhum agendamento futuro</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map(appointment => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    return (
                      <div key={appointment.id} className="flex items-center p-3 bg-white/50 rounded-lg">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                          {patient ? getInitials(patient.name) : '?'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-dark text-sm">{patient?.name}</p>
                          <p className="text-xs text-dark/60">
                            {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>
 
          {/* Quick Stats */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6 bg-white">
              <h3 className="font-bold text-dark mb-4">Estatísticas Rápidas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-dark/70">Esta semana</span>
                  <span className="font-semibold text-dark">{Math.floor(Math.random() * 10) + 5} sessões</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-dark/70">Este mês</span>
                  <span className="font-semibold text-dark">{Math.floor(Math.random() * 40) + 20} sessões</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-dark/70">Cancelamentos</span>
                  <span className="font-semibold text-red-600">{Math.floor(Math.random() * 5)}%</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
 