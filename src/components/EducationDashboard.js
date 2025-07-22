import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Upload, FileSpreadsheet, TrendingDown, Users, Calendar, Send, Activity, AlertCircle, CheckCircle } from 'lucide-react';

// Datos de muestra basados en estadísticas reales del Ministerio de Educación
const educationData = [
  { nivel: 'Universitario', 2018: 8.79, 2019: 8.45, 2020: 9.12, 2021: 8.98, 2022: 8.65 },
  { nivel: 'Técnico y Tecnológico', 2018: 13.85, 2019: 13.42, 2020: 14.15, 2021: 13.78, 2022: 13.21 },
  { nivel: 'Técnico Profesional', 2018: 17.41, 2019: 16.89, 2020: 18.24, 2021: 17.65, 2022: 16.98 },
  { nivel: 'Especialización', 2018: 4.23, 2019: 4.12, 2020: 4.45, 2021: 4.31, 2022: 4.18 }
];

// Datos para gráfico de líneas
const chartData = [
  { año: '2018', Universitario: 8.79, 'T&T': 13.85, 'T.Profesional': 17.41, Especialización: 4.23 },
  { año: '2019', Universitario: 8.45, 'T&T': 13.42, 'T.Profesional': 16.89, Especialización: 4.12 },
  { año: '2020', Universitario: 9.12, 'T&T': 14.15, 'T.Profesional': 18.24, Especialización: 4.45 },
  { año: '2021', Universitario: 8.98, 'T&T': 13.78, 'T.Profesional': 17.65, Especialización: 4.31 },
  { año: '2022', Universitario: 8.65, 'T&T': 13.21, 'T.Profesional': 16.98, Especialización: 4.18 }
];

// Datos para gráfico circular
const pieData = [
  { name: 'Universitario', value: 8.65, color: '#3B82F6' },
  { name: 'T&T', value: 13.21, color: '#EF4444' },
  { name: 'T.Profesional', value: 16.98, color: '#F59E0B' },
  { name: 'Especialización', value: 4.18, color: '#10B981' }
];

const EducationDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('Listo para cargar Excel');
  const [backendStatus, setBackendStatus] = useState('disconnected');
  const fileInputRef = useRef(null);

  // Función para detectar el tamaño de pantalla
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estilos responsive mejorados
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%)',
      padding: isMobile ? '10px' : isTablet ? '15px' : '20px',
      fontFamily: 'Arial, sans-serif',
      width: '100%',
      boxSizing: 'border-box'
    },
    header: {
      textAlign: 'center',
      marginBottom: isMobile ? '20px' : '30px',
      color: 'white',
      padding: isMobile ? '10px' : '20px'
    },
    title: {
      fontSize: isMobile ? '1.8rem' : isTablet ? '2.2rem' : '2.5rem',
      fontWeight: 'bold',
      marginBottom: '10px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      lineHeight: 1.2
    },
    subtitle: {
      fontSize: isMobile ? '0.9rem' : isTablet ? '1.1rem' : '1.2rem',
      opacity: 0.9,
      padding: isMobile ? '0 10px' : '0'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: isMobile ? '8px' : '12px',
      padding: isMobile ? '15px' : isTablet ? '20px' : '24px',
      marginBottom: isMobile ? '15px' : '24px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      width: '100%',
      boxSizing: 'border-box'
    },
    controlPanel: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '15px' : '20px',
      alignItems: isMobile ? 'stretch' : 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    fileSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      flex: 1,
      minWidth: isMobile ? '100%' : '250px'
    },
    fileButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backgroundColor: '#3B82F6',
      color: 'white',
      padding: isMobile ? '15px 20px' : '12px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: isMobile ? '16px' : '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      width: '100%',
      boxSizing: 'border-box'
    },
    statusSection: {
      flex: 1,
      minWidth: isMobile ? '100%' : '250px'
    },
    sendButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: isMobile ? '15px 25px' : '15px 30px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      fontSize: isMobile ? '16px' : '16px',
      fontWeight: 'bold',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      width: isMobile ? '100%' : 'auto',
      minWidth: isMobile ? 'auto' : '200px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile 
        ? '1fr' 
        : isTablet 
          ? 'repeat(2, 1fr)' 
          : 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: isMobile ? '15px' : '20px',
      marginBottom: isMobile ? '20px' : '30px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: isMobile ? '8px' : '12px',
      padding: isMobile ? '15px' : '20px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      border: '1px solid rgba(255,255,255,0.2)',
      width: '100%',
      boxSizing: 'border-box'
    },
    statHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      flexWrap: 'wrap',
      gap: '5px'
    },
    statValue: {
      fontSize: isMobile ? '2rem' : isTablet ? '2.2rem' : '2.5rem',
      fontWeight: 'bold',
      color: '#3B82F6',
      marginBottom: '5px'
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile 
        ? '1fr' 
        : isTablet 
          ? '1fr' 
          : 'repeat(auto-fit, minmax(450px, 1fr))',
      gap: isMobile ? '20px' : '30px',
      marginBottom: isMobile ? '20px' : '30px'
    },
    chartCard: {
      backgroundColor: 'white',
      borderRadius: isMobile ? '8px' : '12px',
      padding: isMobile ? '15px' : isTablet ? '20px' : '25px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      width: '100%',
      boxSizing: 'border-box'
    },
    chartTitle: {
      fontSize: isMobile ? '1.1rem' : isTablet ? '1.2rem' : '1.3rem',
      fontWeight: 'bold',
      marginBottom: isMobile ? '15px' : '20px',
      color: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap'
    },
    tableContainer: {
      width: '100%',
      overflowX: 'auto',
      marginBottom: isMobile ? '20px' : '0'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      borderRadius: isMobile ? '8px' : '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      minWidth: isMobile ? '600px' : 'auto'
    },
    tableHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: isMobile ? '15px 10px' : '20px',
      fontSize: isMobile ? '1rem' : '1.2rem',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    th: {
      padding: isMobile ? '10px 8px' : '15px',
      textAlign: 'left',
      fontWeight: 'bold',
      color: '#374151',
      borderBottom: '2px solid #e5e7eb',
      fontSize: isMobile ? '0.85rem' : '1rem'
    },
    td: {
      padding: isMobile ? '10px 8px' : '12px 15px',
      borderBottom: '1px solid #f3f4f6',
      fontSize: isMobile ? '0.85rem' : '1rem'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: isMobile ? '6px 12px' : '5px 10px',
      borderRadius: '20px',
      fontSize: isMobile ? '11px' : '12px',
      fontWeight: '500',
      marginTop: '5px'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid #ffffff',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '15px' : '20px'
    },
    footer: {
      textAlign: 'center',
      marginTop: isMobile ? '30px' : '40px',
      color: 'white',
      opacity: 0.8,
      padding: isMobile ? '15px' : '0'
    }
  };

  // Función para manejar la selección de archivos
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsLoading(true);
      setUploadStatus('Procesando archivo Excel...');
      
      // Simular procesamiento
      setTimeout(() => {
        setIsLoading(false);
        setUploadStatus(`✅ ${file.name} procesado correctamente`);
      }, 2000);
    }
  };

  // Función para enviar datos al backend Python
  const sendToBackend = async () => {
    setIsLoading(true);
    setUploadStatus('Enviando datos al backend Python...');
    
    try {
      // Simular llamada al API
      const response = await fetch('http://localhost:8000/api/upload-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: selectedFile?.name || 'education_data.xlsx',
          data: educationData,
          timestamp: new Date().toISOString(),
          metadata: {
            source: 'dashboard',
            type: 'education_statistics'
          }
        })
      });

      if (response.ok) {
        setBackendStatus('connected');
        setUploadStatus('✅ Datos enviados exitosamente al backend Python');
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      setBackendStatus('disconnected');
      setUploadStatus('❌ Error: Verificar que el backend Python esté ejecutándose');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (backendStatus === 'connected') return { backgroundColor: '#10B981', color: 'white' };
    return { backgroundColor: '#EF4444', color: 'white' };
  };

  const calculateAverage = (data) => {
    const values = Object.values(data).slice(1); // Excluir 'nivel'
    return (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2);
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .stat-card:hover {
          transform: translateY(-5px);
        }
        .file-button:hover {
          background-color: #2563eb !important;
        }
        .send-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        /* Responsive scrollbar for table */
        .table-container::-webkit-scrollbar {
          height: 8px;
        }
        .table-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .table-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .table-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Responsive text */
        @media (max-width: 767px) {
          .recharts-cartesian-axis-tick-value {
            font-size: 12px !important;
          }
          .recharts-legend-item-text {
            font-size: 12px !important;
          }
        }
      `}</style>
      
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>📊 Dashboard Estadísticas Educativas</h1>
          {/* <p style={styles.subtitle}>
            Ministerio de Educación Nacional - Análisis de Deserción 2018-2022
          </p> */}
        </div>

        {/* Panel de Control */}
        <div style={styles.card}>
          <div style={styles.controlPanel}>
            {/* Sección de archivo */}
            <div style={styles.fileSection}>
              <h3 style={{ margin: '0 0 10px 0', color: '#374151', fontSize: isMobile ? '1rem' : '1.1rem' }}>
                📁 Cargar Excel
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={styles.fileButton}
                className="file-button"
              >
                <Upload size={16} />
                Seleccionar Archivo Excel
              </button>
              {selectedFile && (
                <p style={{ 
                  margin: '5px 0', 
                  color: '#6b7280', 
                  fontSize: isMobile ? '13px' : '14px',
                  wordBreak: 'break-word'
                }}>
                  📄 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {/* Estado */}
            <div style={styles.statusSection}>
              <h3 style={{ 
                margin: '0 0 10px 0', 
                color: '#374151', 
                fontSize: isMobile ? '1rem' : '1.1rem' 
              }}>
                📊 Estado del Sistema
              </h3>
              <p style={{ 
                margin: '5px 0', 
                color: '#374151', 
                fontSize: isMobile ? '14px' : '15px',
                wordBreak: 'break-word'
              }}>
                {uploadStatus}
              </p>
              <div style={{...styles.statusBadge, ...getStatusColor()}}>
                {backendStatus === 'connected' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                Backend Python: {backendStatus === 'connected' ? 'Conectado' : 'Desconectado'}
              </div>
            </div>

            {/* Botón de envío */}
            <button
              onClick={sendToBackend}
              disabled={isLoading}
              style={{
                ...styles.sendButton,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              className="send-button"
            >
              {isLoading ? (
                <>
                  <div style={styles.spinner}></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Enviar a Backend Python
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div style={styles.statsGrid}>
          {educationData.map((item, index) => (
            <div key={index} style={styles.statCard} className="stat-card">
              <div style={styles.statHeader}>
                <Users size={isMobile ? 28 : 32} color="#3B82F6" />
                <span style={{ 
                  fontSize: isMobile ? '11px' : '12px', 
                  color: '#6b7280',
                  textAlign: 'right'
                }}>
                  Promedio 2018-2022
                </span>
              </div>
              <h3 style={{ 
                margin: '0 0 10px 0', 
                color: '#1f2937', 
                fontSize: isMobile ? '1rem' : '1.1rem',
                lineHeight: 1.3
              }}>
                {item.nivel}
              </h3>
              <div style={styles.statValue}>{calculateAverage(item)}%</div>
              <p style={{ 
                margin: 0, 
                color: '#6b7280', 
                fontSize: isMobile ? '13px' : '14px' 
              }}>
                Tasa de deserción
              </p>
            </div>
          ))}
        </div>

        {/* Gráficos */}
        <div style={styles.chartsGrid}>
          {/* Gráfico de Líneas */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <TrendingDown size={20} color="#EF4444" />
              <span>Evolución Temporal de Deserción</span>
            </h3>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="año" 
                  stroke="#6b7280" 
                  fontSize={isMobile ? 12 : 14}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={isMobile ? 12 : 14}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    fontSize: isMobile ? '12px' : '14px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
                />
                <Line type="monotone" dataKey="Universitario" stroke="#3B82F6" strokeWidth={isMobile ? 2 : 3} dot={{ r: isMobile ? 3 : 5 }} />
                <Line type="monotone" dataKey="T&T" stroke="#EF4444" strokeWidth={isMobile ? 2 : 3} dot={{ r: isMobile ? 3 : 5 }} />
                <Line type="monotone" dataKey="T.Profesional" stroke="#F59E0B" strokeWidth={isMobile ? 2 : 3} dot={{ r: isMobile ? 3 : 5 }} />
                <Line type="monotone" dataKey="Especialización" stroke="#10B981" strokeWidth={isMobile ? 2 : 3} dot={{ r: isMobile ? 3 : 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <Calendar size={20} color="#8B5CF6" />
              <span>Comparación 2022</span>
            </h3>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={chartData.slice(-1)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="año" 
                  stroke="#6b7280"
                  fontSize={isMobile ? 12 : 14}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={isMobile ? 12 : 14}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    fontSize: isMobile ? '12px' : '14px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
                />
                <Bar dataKey="Universitario" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="T&T" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="T.Profesional" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Especialización" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico Circular */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <Activity size={20} color="#10B981" />
              <span>Distribución de Deserción 2022</span>
            </h3>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => isMobile ? `${value}%` : `${name}: ${value}%`}
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Tasa de Deserción']}
                  contentStyle={{ fontSize: isMobile ? '12px' : '14px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Métricas adicionales */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <FileSpreadsheet size={20} color="#3B82F6" />
              <span>Resumen Estadístico</span>
            </h3>
            <div style={styles.metricsGrid}>
              <div>
                <h4 style={{ 
                  color: '#374151', 
                  marginBottom: '10px',
                  fontSize: isMobile ? '1rem' : '1.1rem'
                }}>📈 Tendencias</h4>
                <p style={{ margin: '5px 0', color: '#6b7280', fontSize: isMobile ? '13px' : '14px' }}>
                  • Mayor deserción: Técnico Profesional (16.98%)
                </p>
                <p style={{ margin: '5px 0', color: '#6b7280', fontSize: isMobile ? '13px' : '14px' }}>
                  • Menor deserción: Especialización (4.18%)
                </p>
                <p style={{ margin: '5px 0', color: '#6b7280', fontSize: isMobile ? '13px' : '14px' }}>
                  • Tendencia general: Descendente
                </p>
              </div>
              <div>
                <h4 style={{ 
                  color: '#374151', 
                  marginBottom: '10px',
                  fontSize: isMobile ? '1rem' : '1.1rem'
                }}>🎯 Objetivos</h4>
                <p style={{ margin: '5px 0', color: '#6b7280', fontSize: isMobile ? '13px' : '14px' }}>
                  • Reducir deserción técnica
                </p>
                <p style={{ margin: '5px 0', color: '#6b7280', fontSize: isMobile ? '13px' : '14px' }}>
                  • Mantener niveles universitarios
                </p>
                <p style={{ margin: '5px 0', color: '#6b7280', fontSize: isMobile ? '13px' : '14px' }}>
                  • Políticas de retención estudiantil
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Datos */}
        <div style={styles.tableContainer} className="table-container">
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader} colSpan="6">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <FileSpreadsheet size={20} />
                    <span>Datos Detallados de Deserción por Nivel Educativo</span>
                  </div>
                </th>
              </tr>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={styles.th}>Nivel de Formación</th>
                <th style={styles.th}>2018</th>
                <th style={styles.th}>2019</th>
                <th style={styles.th}>2020</th>
                <th style={styles.th}>2021</th>
                <th style={styles.th}>2022</th>
              </tr>
            </thead>
            <tbody>
              {educationData.map((row, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                  <td style={{...styles.td, fontWeight: 'bold', color: '#1f2937'}}>{row.nivel}</td>
                  <td style={styles.td}>{row[2018]}%</td>
                  <td style={styles.td}>{row[2019]}%</td>
                  <td style={styles.td}>{row[2020]}%</td>
                  <td style={styles.td}>{row[2021]}%</td>
                  <td style={styles.td}>{row[2022]}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {/* <div style={styles.footer}>
          <p style={{ fontSize: isMobile ? '14px' : '16px' }}>
            📊 Dashboard desarrollado para el análisis de estadísticas educativas
          </p>
          <p style={{ fontSize: isMobile ? '12px' : '14px', marginTop: '5px' }}>
            Fuente: SPADIES - Sistema para la Prevención y Análisis de la Deserción en las IES
          </p>
          <p style={{ fontSize: isMobile ? '11px' : '12px', marginTop: '10px' }}>
            🔗 Backend Python listo para recibir datos en: http://localhost:8000/api/upload-data
          </p>
        </div> */}
      </div>
    </>
  );
};

export default EducationDashboard;