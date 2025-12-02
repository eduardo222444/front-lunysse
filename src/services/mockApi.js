export const mockApi = {
    async getSessionDetails(id) {
      return {
        id,
        patientId: 1,
        description: "Sessão de acompanhamento",
        date: "2024-02-01",
        time: "14:00",
        duration: 50,
        notes: "Paciente apresentou melhora.",
        fullReport: "Relatório completo da sessão...",
        status: "agendado",
      };
    },
  
    async getPatients(userId) {
      return [
        { id: 1, name: "João Silva" },
        { id: 2, name: "Maria Andrade" },
      ];
    }
  };