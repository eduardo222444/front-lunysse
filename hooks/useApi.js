/**
 * API Service for Lunysse - Backend Integration
 * Handles all HTTP requests to the backend API
 */
 
 class LunysseAPI {
    constructor(baseURL = import.meta.env.VITE_API_BASE_URL || 'sua url padrão aqui') {
      this.baseURL = baseURL;
      this.token = localStorage.getItem('lunysse_token');
    }
   
    setToken(token) {
      this.token = token;
      localStorage.setItem('lunysse_token', token);
    }
   
    removeToken() {
      this.token = null;
      localStorage.removeItem('lunysse_token');
    }
   
    getHeaders(includeAuth = true) {
      const headers = { 'Content-Type': 'application/json' };
      if (includeAuth && this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      return headers;
    }
   
    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: this.getHeaders(options.auth !== false),
        ...options
      };
   
      try {
        const response = await fetch(url, config);
       
        if (response.status === 401) {
          this.removeToken();
          window.location.href = '/login';
          throw new Error('Token expirado');
        }
       
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error Details:', errorData);
         
          // Handle validation errors (422)
          if (response.status === 422 && errorData.detail && Array.isArray(errorData.detail)) {
            const validationErrors = errorData.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
            throw new Error(`Erro de validação: ${validationErrors}`);
          }
         
          throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
       
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
   
    // Authentication
    async login(email, password) {
      const data = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        auth: false
      });
     
      if (data.access_token) {
        this.setToken(data.access_token);
      }
     
      return data;
    }
   
    async register(userData) {
      const data = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        auth: false
      });
     
      if (data.access_token) {
        this.setToken(data.access_token);
      }
     
      return data;
    }
   
    // Patients
    async getPatients() {
      return this.request('/patients/');
    }
   
    async getPatientDetails(patientId) {
      return this.request(`/patients/${patientId}`);
    }
   
    async createPatient(patientData) {
      return this.request('/patients/', {
        method: 'POST',
        body: JSON.stringify(patientData)
      });
    }
   
    async getPatientSessions(patientId) {
      return this.request(`/patients/${patientId}/sessions`);
    }
   
    async addPatientNote(patientId, note) {
      return this.request(`/patients/${patientId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ note })
      });
    }
   
    async updatePatient(patientId, updateData) {
    return this.request(`/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }
   
    // Appointments
    async getAppointments(filters = {}) {
      const params = new URLSearchParams(filters);
      return this.request(`/appointments/?${params}`);
    }
   
    async createAppointment(appointmentData) {
      return this.request('/appointments/', {
        method: 'POST',
        body: JSON.stringify(appointmentData)
      });
    }
   
    async updateAppointment(appointmentId, updateData) {
      return this.request(`/appointments/${appointmentId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
    }
   
    async cancelAppointment(appointmentId) {
      return this.request(`/appointments/${appointmentId}`, {
        method: 'DELETE'
      });
    }
   
    async getAvailableSlots(psychologistId, date) {
      const params = new URLSearchParams({
        psychologist_id: psychologistId,
        date: date
      });
     
      return this.request(`/appointments/available-slots?${params}`);
    }
   
    // Psychologists
    async getPsychologists() {
      return this.request('/psychologists/');
    }
   
    // Requests
    async getRequests(status = null) {
      const params = status ? `?status=${status}` : '';
      return this.request(`/requests/${params}`);
    }
   
    async createRequest(requestData) {
      return this.request('/requests/', {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
    }
   
    async updateRequestStatus(requestId, status) {
      return this.request(`/requests/${requestId}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    }
   
    // Reports
    async getPsychologistReport(psychologistId) {
      return this.request(`/reports/${psychologistId}`);
    }
   
    // ML Analysis
    async getRiskAnalysis() {
      return this.request('/ml/risk-analysis');
    }
   
    async getPatientRiskAnalysis(patientId) {
      return this.request(`/ml/risk-analysis/${patientId}`);
    }
  }
   
  // Create singleton instance
  const api = new LunysseAPI();
   
  export default api;
   