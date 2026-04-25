const API_BASE = 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

const apiClient = {
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json() as ApiResponse<T>;

    if (!res.ok || !data.success) {
      throw new Error(data.error?.message || `Request failed (${res.status})`);
    }
    // Return the data directly, not the wrapper
    return data.data as T;
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  },
  get<T>(path: string): Promise<T> {
    return this.request<T>(path);
  },
  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
  },
  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  },
};

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; fullName: string; phone?: string; companyName?: string }) =>
    apiClient.post<{ user: any; token: string }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post<{ user: any; token: string }>('/auth/login', data),
  logout: () => apiClient.post<{ message: string }>('/auth/logout'),
  me: () => apiClient.get<any>('/auth/me'),
};

// Quotations API
export const quotationsApi = {
  list: (params?: { page?: number; limit?: number; search?: string; approved?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.approved !== undefined) searchParams.set('approved', String(params.approved));
    const query = searchParams.toString();
    return apiClient.get<{ items: any[]; total: number; page: number; limit: number; totalPages: number }>(`/quotations${query ? `?${query}` : ''}`);
  },
  get: (id: string) => apiClient.get<any>(`/quotations/${id}`),
  create: (data: any) => apiClient.post<any>('/quotations', data),
  update: (id: string, data: any) => apiClient.put<any>(`/quotations/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/quotations/${id}`),
  approve: (id: string) => apiClient.post<any>(`/quotations/${id}/approve`),
};

// Pricing API
export const pricingApi = {
  list: () => apiClient.get<any[]>('/pricing'),
  bulkUpdate: (items: any[]) => apiClient.put<any[]>('/pricing', { items }),
  update: (id: string, data: any) => apiClient.put<any>(`/pricing/${id}`, data),
};

// Settings API
export const settingsApi = {
  getGst: () => apiClient.get<{ gstPercentage: number; includeGst: boolean }>('/settings/gst'),
  updateGst: (data: { gstPercentage: number; includeGst: boolean }) =>
    apiClient.put<{ gstPercentage: number; includeGst: boolean }>('/settings/gst', data),
  getTechnical: () => apiClient.get<{ panelTypes: any[] }>('/settings/technical'),
  updateTechnical: (data: { panelTypes: any[] }) =>
    apiClient.put<{ panelTypes: any[] }>('/settings/technical', data),
};

// Profile API
export const profileApi = {
  get: () => apiClient.get<any>('/profile'),
  update: (data: any) => apiClient.put<any>('/profile', data),
};

// Calculations API
export const calculationsApi = {
  solarSizing: (data: { systemKw: number; panelType: string }) =>
    apiClient.post<any>('/calculations/solar-sizing', data),
  cost: (data: { systemKw: number; baseCost: number; otherExpenses?: number; profitMargin?: number }) =>
    apiClient.post<any>('/calculations/cost', data),
  roi: (data: { systemCost: number; subsidyAmount?: number; monthlyGeneration: number; unitRate: number }) =>
    apiClient.post<any>('/calculations/roi', data),
  emi: (data: { loanAmount: number; interestRate: number; termInYears: number }) =>
    apiClient.post<{ emi: number; totalPayable: number; totalInterest: number }>('/calculations/emi', data),
};

export default apiClient;
