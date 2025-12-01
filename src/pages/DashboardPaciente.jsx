import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentService, requestService, psychologistService } from '../services/apiService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Calendar, Plus, Bell, Clock } from 'lucide-react';
 
 
export const DashboardPaciente = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [_psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [psychologistsData, appointmentsData] = await Promise.all([
          psychologistService.getPsychologists(),
          appointmentService.getAppointments()
        ]);
        // Pacientes não podem acessar requests - apenas psicólogos
        let requestsData = [];
        try {
          requestsData = await requestService.getRequests();
        } catch (error) {
          // Ignora erro 403 para pacientes
          if (!error.message.includes('403') && !error.message.includes('Apenas psicólogos')) {
            throw error;
          }
        }
        setRequests(requestsData);
        setPsychologists(psychologistsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user.email]);
  if (loading) return <LoadingSpinner size="lg" />;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate >= today && apt.status === 'agendado';
  });
  const pastAppointments = appointments.filter(apt =>
    new Date(apt.date) < new Date() || apt.status === 'concluido'
  );
  const hasHistory = pastAppointments.length > 0;
 
 
 
 
  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-dark">Meu Dashboard</h1>
 
      {/* Solicitações */}
      {requests.length > 0 && (
        <Card className="bg-blue-50">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-dark">Minhas Solicitações</h2>
          </div>
         
          <div className="space-y-3">
            {requests.map(request => {
              const getStatusInfo = (status) => {
                switch (status) {
                  case 'pendente':
                    return { color: 'bg-blue-100 text-blue-800', text: 'Aguardando Avaliação', icon: Clock };
                  case 'aceito':
                    return { color: 'bg-green-100 text-green-800', text: 'Aceito como Paciente', icon: Bell };
                  case 'rejeitado':
                    return { color: 'bg-red-100 text-red-800', text: 'Solicitação Rejeitada', icon: Bell };
                  default:
                    return { color: 'bg-gray-100 text-gray-800', text: 'Status Desconhecido', icon: Bell };
                }
              };
             
              const statusInfo = getStatusInfo(request.status);
              const StatusIcon = statusInfo.icon;
             
              return (
                <div key={request.id} className="p-3 sm:p-4 bg-white/50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-dark text-sm sm:text-base">Solicitação para ser Paciente</p>
                      <p className="text-xs sm:text-sm text-dark/70">
                        Enviada em {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                 
                  <p className="text-xs text-dark/60 mb-3">{request.description}</p>
                 
                  {request.status === 'aceito' && (
                    <div className="p-3 bg-green-100 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Parabéns!</strong> Você foi aceito como paciente. O psicólogo entrará em contato para agendar suas sessões.
                      </p>
                    </div>
                  )}
                 
                  {request.status === 'pendente' && (
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Status:</strong> Sua solicitação está sendo analisada pelo psicólogo.
                      </p>
                    </div>
                  )}
                 
                  {request.status === 'rejeitado' && (
                    <div className="p-3 bg-red-100 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Solicitação não aceita.</strong> Você pode tentar com outro psicólogo.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
 
      {/* Próximas Sessões */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-light" />
          <h2 className="text-xl font-semibold text-dark">Próximas Sessões</h2>
        </div>
       
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-dark/70 mb-4 text-sm sm:text-base">Você não tem sessões agendadas.</p>
            <Link to="/agendamento">
              <Button>{hasHistory ? 'Solicitar novo psicólogo' : 'Solicitar ser paciente'}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map(appointment => (
              <div key={appointment.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 p-3 sm:p-4 bg-white/10 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-dark text-sm sm:text-base">{appointment.description}</p>
                  <p className="text-xs sm:text-sm text-dark/70">{new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}</p>
                  <p className="text-xs text-dark/60">Duração: {appointment.duration} minutos</p>
                </div>
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs sm:text-sm font-medium self-start sm:self-center">
                  Agendado
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
 
      {/* Histórico Recente */}
      {pastAppointments.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-dark mb-4">Histórico Recente</h2>
          <div className="space-y-3">
            {pastAppointments.slice(0, 3).map(appointment => (
              <div key={appointment.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 p-3 bg-white/5 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-dark text-sm sm:text-base">{appointment.description}</p>
                  <p className="text-xs sm:text-sm text-dark/70">{new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}</p>
                </div>
                <span className="px-2 py-1 bg-green-500/20 text-green-700 rounded-full text-xs font-medium self-start sm:self-center">
                  Concluída
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/historico" className="text-light hover:text-accent font-medium">
              Ver histórico completo
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};