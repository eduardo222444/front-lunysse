import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestService, patientService } from '../services/apiService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Bell, User, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
 
export const Solicitacoes = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequests, setProcessingRequests] = useState(new Set());
 
  useEffect(() => {
    loadRequests();
  }, [user.id]);
 
  const loadRequests = async () => {
  setLoading(true);
  try {
    const data = await requestService.getRequests(); // pega todas ou filtradas pelo backend
    // filtra apenas pendentes
    const pendentes = data.filter(req => req.status === 'pendente');
    setRequests(pendentes);
  } catch (error) {
    console.error('Erro ao carregar solicitações:', error);
  } finally {
    setLoading(false);
  }
};
 
  const handleAcceptRequest = async (requestId, requestData) => {
    setProcessingRequests(prev => new Set([...prev, requestId]));
   
    try {
      try {
        await patientService.updatePatient(requestData.patient_id, {
          patient_id: requestData.patient_id,
          name: requestData.patient_name,
          email: requestData.patient_email,
          phone: requestData.patient_phone,
          birth_date: requestData.patient_birth_date,
          psychologist_id: user.id
        });
      } catch (patientError) {
        // Se paciente já existe, continua o processo
        if (!patientError.message.includes('já está cadastrado')) {
          throw patientError;
        }
      }
 
      // Atualizar status da solicitação
      await requestService.updateRequestStatus(requestId, 'aceito');
     
      // Remover solicitação da lista
      setRequests(prev => prev.filter(req => req.id !== requestId));
     
      toast.success('Solicitação aceita! Paciente adicionado à sua lista.');
    } catch (error) {
      console.error('Erro ao aceitar solicitação:', error);
      toast.error('Erro ao processar solicitação');
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };
 
  const handleRejectRequest = async (requestId) => {
    setProcessingRequests(prev => new Set([...prev, requestId]));
   
    try {
      await requestService.updateRequestStatus(requestId, 'rejeitado');
     
      // Remover solicitação da lista
      setRequests(prev => prev.filter(req => req.id !== requestId));
     
      toast.success('Solicitação rejeitada.');
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
      toast.error('Erro ao processar solicitação');
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };
 
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
 
  const getStatusColor = (status) => {
    switch (status) {
      case 'aceito': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'pendente': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
 
  if (loading) return <LoadingSpinner size="lg" />;
 
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-light" />
        <h1 className="text-xl sm:text-3xl font-bold text-white">Solicitações de Pacientes</h1>
      </div>
 
      <div className="grid gap-4 sm:gap-6">
        {requests.length === 0 ? (
          <Card className="text-center py-12">
            <Bell className="w-16 h-16 text-dark/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-dark/70">As solicitações de novos pacientes aparecerão aqui.</p>
          </Card>
        ) : (
          requests.map(request => (
            <Card key={request.id} className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-light to-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-dark">{request.patient_name}</h3>
                    <p className="text-xs sm:text-sm text-dark/60 break-all">{request.patient_email}</p>
                    <p className="text-xs sm:text-sm text-dark/60">{request.patient_phone}</p>
                  </div>
                </div>
               
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency === 'alta' ? 'Alta' : request.urgency === 'media' ? 'Média' : 'Baixa'} urg��ncia
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status === 'aceito' ? 'Aceito' : request.status === 'rejeitado' ? 'Rejeitado' : 'Pendente'}
                  </span>
                </div>
              </div>
 
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h4 className="text-sm sm:text-base font-medium text-dark mb-2">Descrição da necessidade:</h4>
                <p className="text-sm sm:text-base text-dark/70">{request.description}</p>
              </div>
 
              <div className="flex items-center gap-4 text-xs sm:text-sm text-dark/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  Enviado em {new Date(request.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
 
              {request.notes && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Observações:</strong> {request.notes}
                  </p>
                </div>
              )}
 
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="secondary"
                  onClick={() => handleRejectRequest(request.id)}
                  loading={processingRequests.has(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <X className="w-4 h-4" />
                  Rejeitar
                </Button>
                <Button
                  onClick={() => handleAcceptRequest(request.id, request)}
                  loading={processingRequests.has(request.id)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aceitar como Paciente
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
 