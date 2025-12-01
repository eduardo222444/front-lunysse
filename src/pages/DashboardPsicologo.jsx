import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService, patientService, requestService } from '../services/apiService';
import { Card } from '../components/Card';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Calendar, Users, Bell , CheckCheck} from 'lucide-react';
export const DashboardPsicologo = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadData = useCallback(async () => {
    try {
      console.log('Carregando dados do dashboard para psicólogo:', user.id);
      const [appointmentsData, patientsData, requestsData] = await Promise.all([
        appointmentService.getAppointments(),
        patientService.getPatients(),
        requestService.getRequests('pendente')
      ]);
      console.log('Agendamentos:', appointmentsData);
      console.log('Pacientes:', patientsData);
      console.log('Solicitações:', requestsData);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setRequests(requestsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);
  useEffect(() => {
    loadData();
  }, [loadData]);
  // Recarrega quando a página fica visível e a cada 5 segundos
  useEffect(() => {
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);  
    const interval = setInterval(loadData, 5000); // Recarrega a cada 5 segundos
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [loadData]);
  if (loading) return <LoadingSpinner size="lg" />;
  // Filtra agendamentos de hoje para o psicólogo logado (apenas agendados)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.appointment_date || apt.date);
    appointmentDate.setHours(0, 0, 0, 0);
    const isToday = appointmentDate.getTime() === today.getTime();
    const isPsychologist = (apt.psychologist_id || apt.psychologistId) === user.id;
    const isScheduled = apt.status === 'agendado';
    return isToday && isPsychologist && isScheduled;
  });
  // Estatísticas baseadas nos dados reais do psicólogo
  const totalPatients = patients.length;
  const completedSessions = appointments.filter(apt =>
    apt.status === 'concluido' && (apt.psychologist_id || apt.psychologistId) === user.id
  ).length;
  const pendingRequests = requests.filter(req =>
    req.status === 'pendente' && req.preferred_psychologist === user.id
  ).length;
  // Próximos agendamentos do psicólogo
  const upcomingAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.appointment_date || apt.date);
    const isPsychologist = (apt.psychologist_id || apt.psychologistId) === user.id;
    const isScheduled = apt.status === 'agendado';
    const isFuture = appointmentDate >= new Date();
    return isFuture && isScheduled && isPsychologist;
  }).slice(0, 5);
  // Verifica se é um psicólogo novo (sem dados)
  const isNewPsychologist = totalPatients === 0 && appointments.length === 0 && requests.length === 0;
 
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark">Dashboard</h1>
        <p className="text-white text-sm sm:text-base">Bem-vindo, {user.name}</p>
      </div>
 
      {/* Mensagem para psicólogos novos */}
      {isNewPsychologist && (
        <Card className="text-center py-8 border-2 border-dashed border-light/30">
          <Users className="w-16 h-16 text-light/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark mb-2">Bem-vindo ao Lunysse!</h3>
          <p className="text-dark/70 mb-4">
            Você é novo por aqui. Seus pacientes e agendamentos aparecerão neste dashboard
            conforme você começar a receber solicitações e agendar sessões.
          </p>
          <p className="text-sm text-dark/50">
            Explore o menu lateral para conhecer todas as funcionalidades disponíveis.
          </p>
        </Card>
      )}
 
      {/* KPIs - Dados específicos do psicólogo logado */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="text-center p-4">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-light mx-auto mb-2" />
          <h3 className="text-xl sm:text-2xl font-bold text-dark">{totalPatients}</h3>
          <p className="text-xs sm:text-sm text-dark/70">Pacientes Ativos</p>
        </Card>
 
        <Card className="text-center p-4">
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2" />
          <h3 className="text-xl sm:text-2xl font-bold text-dark">{todayAppointments.length}</h3>
          <p className="text-xs sm:text-sm text-dark/70">Sessões Hoje</p>
        </Card>
 
        <Card className="text-center p-4">
          <CheckCheck className="w-6 h-6 sm:w-8 sm:h-8 text-medium mx-auto mb-2" />
          <h3 className="text-xl sm:text-2xl font-bold text-dark">{completedSessions}</h3>
          <p className="text-xs sm:text-sm text-dark/70">Sessões Concluídas</p>
        </Card>
 
        <Card className="text-center p-4">
          <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mx-auto mb-2" />
          <h3 className="text-xl sm:text-2xl font-bold text-dark">{pendingRequests}</h3>
          <p className="text-xs sm:text-sm text-dark/70">Solicitações Pendentes</p>
        </Card>
      </div>
 
      {/* Próximos Agendamentos - apenas se não for psicólogo novo */}
      {!isNewPsychologist && (
        <Card>
          <h2 className="text-xl font-semibold text-dark mb-4">Próximos Agendamentos</h2>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-dark/30 mx-auto mb-4" />
              <p className="text-dark/70 mb-2">Nenhum agendamento futuro encontrado.</p>
              <p className="text-sm text-dark/50">
                {totalPatients === 0
                  ? 'Você ainda não possui pacientes cadastrados.'
                  : 'Todos os agendamentos estão em dia!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map(appointment => {
                const patient = patients.find(p => p.id === (appointment.patient_id || appointment.patientId));
                const appointmentDate = new Date(appointment.appointment_date || appointment.date);
               
                return (
                  <div key={appointment.id} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <div>
                      <p className="font-medium text-dark">{patient?.name || 'Paciente não encontrado'}</p>
                      <p className="text-sm text-dark/70">
                        {appointmentDate.toLocaleDateString('pt-BR')} às {appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-dark/60">{appointment.notes || appointment.description || 'Consulta agendada'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'agendado'
                        ? 'bg-blue-100 text-blue-800'
                        : appointment.status === 'iniciado'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {appointment.status === 'agendado' ? 'Agendado' :
                       appointment.status === 'iniciado' ? 'Iniciado' : 'Concluído'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
 