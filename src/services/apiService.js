/**
 * Service layer for API calls
 * Provides high-level functions for different features
 */
 import api from './api';
 
 export const authService = {
   async login(email, password) {
     return api.login(email, password);
   },
  
   async register(userData) {
     return api.register(userData);
   }
 };
  
 export const patientService = {
   async getPatients() {
     return api.getPatients();
   },
  
   async getPatientDetails(patientId) {
     return api.getPatientDetails(patientId);
   },
  
   async createPatient(patientData) {
     return api.createPatient(patientData);
   },
  
   async updatePatient(patientId, updateData) {
     return api.updatePatient(patientId, updateData);
   },
  
   async getPatientSessions(patientId) {
     return api.getPatientSessions(patientId);
   },
  
   async addPatientNote(patientId, note) {
     return api.addPatientNote(patientId, note);
   }
 };
  
  
 export const appointmentService = {
   async getAppointments(filters = {}) {
     return api.getAppointments(filters);
   },
  
   async createAppointment(appointmentData) {
     return api.createAppointment(appointmentData);
   },
  
   async updateAppointment(appointmentId, updateData) {
     return api.updateAppointment(appointmentId, updateData);
   },
  
   async cancelAppointment(appointmentId) {
     return api.cancelAppointment(appointmentId);
   },
  
   async getAvailableSlots(psychologistId, date) {
     return api.getAvailableSlots(psychologistId, date);
   }
 };
  
 export const psychologistService = {
   async getPsychologists() {
     return api.getPsychologists();
   }
 };
  
 export const requestService = {
   async getRequests(status = null) {
     return api.getRequests(status);
   },
  
   async createRequest(requestData) {
     return api.createRequest(requestData);
   },
  
   async updateRequestStatus(requestId, status) {
     return api.updateRequestStatus(requestId, status);
   }
 };
  
 export const reportService = {
   async getPsychologistReport(psychologistId) {
     return api.getPsychologistReport(psychologistId);
   }
 };
  
 export const mlService = {
   async getRiskAnalysis() {
     return api.getRiskAnalysis();
   },
  
   async getPatientRiskAnalysis(patientId) {
     return api.getPatientRiskAnalysis(patientId);
   }
 };