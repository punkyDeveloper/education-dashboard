import * as XLSX from 'xlsx';

export class ExcelProcessor {
  constructor() {
    this.workbook = null;
    this.sheets = {};
  }

  // Procesar archivo Excel desde input file
  async processFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          this.workbook = XLSX.read(data, { type: 'array' });
          
          // Procesar todas las hojas
          this.processAllSheets();
          
          resolve({
            success: true,
            sheets: this.workbook.SheetNames,
            data: this.sheets
          });
        } catch (error) {
          reject(new Error(`Error processing Excel: ${error.message}`));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Procesar todas las hojas del Excel
  processAllSheets() {
    this.workbook.SheetNames.forEach(sheetName => {
      const worksheet = this.workbook.Sheets[sheetName];
      this.sheets[sheetName] = this.processSheet(worksheet);
    });
  }

  // Procesar una hoja específica
  processSheet(worksheet) {
    // Convertir a JSON con headers
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Filtrar filas vacías
    const filteredData = jsonData.filter(row => 
      row.some(cell => cell !== null && cell !== undefined && cell !== '')
    );

    // Buscar headers reales (primera fila con datos válidos)
    let headerRowIndex = -1;
    let headers = [];
    
    for (let i = 0; i < filteredData.length; i++) {
      const row = filteredData[i];
      if (this.isValidHeaderRow(row)) {
        headerRowIndex = i;
        headers = row.filter(cell => cell !== null && cell !== undefined);
        break;
      }
    }

    // Procesar datos si encontramos headers
    const processedData = [];
    if (headerRowIndex !== -1) {
      for (let i = headerRowIndex + 1; i < filteredData.length; i++) {
        const row = filteredData[i];
        if (this.isValidDataRow(row)) {
          const rowObject = {};
          headers.forEach((header, index) => {
            rowObject[header] = row[index] || null;
          });
          processedData.push(rowObject);
        }
      }
    }

    return {
      rawData: filteredData,
      headers: headers,
      processedData: processedData,
      rowCount: filteredData.length,
      range: worksheet['!ref']
    };
  }

  // Verificar si una fila parece ser de headers
  isValidHeaderRow(row) {
    if (!row || row.length < 2) return false;
    
    // Buscar patrones comunes de headers
    const hasStringHeaders = row.some(cell => 
      typeof cell === 'string' && 
      (cell.includes('20') || // años
       cell.toLowerCase().includes('nivel') ||
       cell.toLowerCase().includes('formación') ||
       cell.toLowerCase().includes('año'))
    );
    
    return hasStringHeaders;
  }

  // Verificar si una fila contiene datos válidos
  isValidDataRow(row) {
    if (!row || row.length < 2) return false;
    
    // Al menos debe tener un valor no nulo
    return row.some(cell => cell !== null && cell !== undefined && cell !== '');
  }

  // Obtener datos específicos para deserción educativa
  getEducationData() {
    const educationSheets = this.workbook.SheetNames.filter(name => 
      name.toLowerCase().includes('deserción') || 
      name.toLowerCase().includes('td')
    );

    if (educationSheets.length === 0) return null;

    // Procesar la primera hoja de deserción
    const mainSheet = this.sheets[educationSheets[0]];
    if (!mainSheet || !mainSheet.processedData) return null;

    // Transformar datos para visualización
    return this.transformEducationData(mainSheet.processedData);
  }

  // Transformar datos de educación para gráficos
  transformEducationData(data) {
    const transformed = [];
    
    data.forEach(row => {
      const nivel = row['Nivel de formación'] || row['nivel'] || row['Nivel'];
      if (!nivel) return;

      const rowData = { nivel };
      
      // Extraer años y valores
      Object.keys(row).forEach(key => {
        if (key !== 'Nivel de formación' && key !== 'nivel' && key !== 'Nivel') {
          const value = row[key];
          if (typeof value === 'number' && !isNaN(value)) {
            // Convertir a porcentaje si es decimal
            rowData[key] = value < 1 ? value * 100 : value;
          }
        }
      });

      transformed.push(rowData);
    });

    return transformed;
  }

  // Obtener resumen estadístico
  getStatsSummary() {
    const totalSheets = this.workbook?.SheetNames.length || 0;
    let totalRows = 0;
    let processedRows = 0;

    Object.values(this.sheets).forEach(sheet => {
      totalRows += sheet.rowCount || 0;
      processedRows += sheet.processedData?.length || 0;
    });

    return {
      totalSheets,
      totalRows,
      processedRows,
      processingSuccess: processedRows > 0
    };
  }

  // Exportar datos procesados
  exportProcessedData() {
    return {
      metadata: {
        timestamp: new Date().toISOString(),
        totalSheets: this.workbook?.SheetNames.length || 0,
        sheetNames: this.workbook?.SheetNames || []
      },
      sheets: this.sheets,
      educationData: this.getEducationData(),
      summary: this.getStatsSummary()
    };
  }
}

// Factory function
export const createExcelProcessor = () => new ExcelProcessor();

// Utility functions
export const validateExcelFile = (file) => {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  const validExtensions = ['.xlsx', '.xls'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  return validTypes.includes(file.type) || validExtensions.includes(fileExtension);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};