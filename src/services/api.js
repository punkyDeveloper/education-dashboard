import axios from 'axios';

// Configuración de la API para backend Python
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Función para enviar archivo Excel al backend Python
export const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append('excel_file', file);
  
  try {
    const response = await api.post('/upload-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

// Función para enviar datos JSON procesados
export const sendDataToBackend = async (data) => {
  try {
    const payload = {
      file_name: data.fileName,
      data: data.data,
      timestamp: data.timestamp,
      metadata: {
        source: 'dashboard',
        version: '1.0'
      }
    };
    
    const response = await api.post('/process-data', payload);
    return response.data;
  } catch (error) {
    throw new Error(`Error sending data: ${error.message}`);
  }
};

// Función para obtener archivos procesados
export const getProcessedFiles = async () => {
  try {
    const response = await api.get('/files');
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching files: ${error.message}`);
  }
};

// Función para obtener estadísticas del backend
export const getStatistics = async () => {
  try {
    const response = await api.get('/statistics');
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching statistics: ${error.message}`);
  }
};

// Función para health check del backend
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(`Backend not available: ${error.message}`);
  }
};

export default api;