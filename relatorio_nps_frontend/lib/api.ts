// Configuração base da API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:3001' 
  : '/api'; // Em desenvolvimento, usa o proxy do Next.js

// Interfaces
interface Company {
  id: string
  name: string
}

interface Feedback {
  id: string
  companyName: string
  rating: number
  comment: string
  createdAt: string
}

interface NPSData {
  companyName: string
  npsScore: number
  totalResponses: number
  promoters: number
  neutrals: number
  detractors: number
}

interface CreateFeedbackData {
  companyName: string
  rating: number
  comment: string
}

// Função helper para fazer requisições
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Resposta não é JSON válido");
  }

  return response.json();
}

// Funções da API
export const api = {
  // GET /companies - Buscar todas as empresas
  async getCompanies(): Promise<Company[]> {
    try {
      return await apiRequest('/companies');
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      return [];
    }
  },

  // GET /feedback - Buscar feedbacks (opcionalmente filtrados por empresa)
  async getFeedbacks(companyName?: string, companyId?: string): Promise<Feedback[]> {
    try {
      let endpoint = '/feedback';
      const params = new URLSearchParams();
      
      if (companyName) params.append('companyName', companyName);
      if (companyId) params.append('companyId', companyId);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      return await apiRequest(endpoint);
    } catch (error) {
      console.error("Erro ao buscar feedbacks:", error);
      return [];
    }
  },

  // GET /nps - Buscar dados de NPS (opcionalmente filtrados por empresa)
  async getNPSData(companyName?: string, companyId?: string): Promise<NPSData | null> {
    try {
      let endpoint = '/nps';
      const params = new URLSearchParams();
      
      if (companyName) params.append('companyName', companyName);
      if (companyId) params.append('companyId', companyId);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      return await apiRequest(endpoint);
    } catch (error) {
      console.error("Erro ao buscar dados de NPS:", error);
      return null;
    }
  },

  // POST /feedback - Criar novo feedback
  async createFeedback(feedbackData: CreateFeedbackData): Promise<Feedback> {
    return await apiRequest('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }
};

// Exportar tipos para uso em outros arquivos
export type { Company, Feedback, NPSData, CreateFeedbackData };