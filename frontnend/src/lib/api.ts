const apiClient = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  token: null as string | null,

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  },

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  },

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' });
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  },
};

export default apiClient;

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; fullName: string; phone?: string; companyName?: string }) =>
    apiClient.post<{ success: boolean; data: { user: unknown; token: string } }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<{ success: boolean; data: { user: unknown; token: string } }>('/auth/login', data),

  logout: () => apiClient.post<{ success: boolean; data: { message: string } }>('/auth/logout'),

  me: () => apiClient.get<{ success: boolean; data: unknown }>('/auth/me'),
};

// Quotations API
export const quotationsApi = {
  list: (params?: { page?: number; limit?: number; search?: string; approved?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.approved !== undefined) searchParams.set('approved', params.approved.toString());
    const query = searchParams.toString();
    return apiClient.get<{ success: boolean; data: { items: unknown[]; total: number; page: number; limit: number; totalPages: number } }>(`/quotations${query ? `?${query}` : ''}`);
  },

  get: (id: string) => apiClient.get<{ success: boolean; data: unknown }>(`/quotations/${id}`),

  create: (data: unknown) => apiClient.post<{ success: boolean; data: unknown }>('/quotations', data),

  update: (id: string, data: unknown) => apiClient.put<{ success: boolean; data: unknown }>(`/quotations/${id}`, data),

  delete: (id: string) => apiClient.delete<{ success: boolean; data: { message: string } }>(`/quotations/${id}`),

  approve: (id: string) => apiClient.patch<{ success: boolean; data: unknown }>(`/quotations/${id}/approve`),
};

// Pricing API
export const pricingApi = {
  list: () => apiClient.get<{ success: boolean; data: unknown[] }>('/pricing'),

  bulkUpdate: (items: unknown[]) => apiClient.put<{ success: boolean; data: unknown[] }>('/pricing', { items }),

  update: (id: string, data: unknown) => apiClient.put<{ success: boolean; data: unknown }>(`/pricing/${id}`, data),
};

// Profile API
export const profileApi = {
  get: () => apiClient.get<{ success: boolean; data: unknown }>('/profile'),

  update: (data: unknown) => apiClient.put<{ success: boolean; data: unknown }>('/profile', data),

  updatePhoto: (photoUrl: string) => apiClient.post<{ success: boolean; data: unknown }>('/profile/photo', { photoUrl }),
};

// Settings API
export const settingsApi = {
  getGst: () => apiClient.get<{ success: boolean; data: { gstPercentage: number; includeGst: boolean } }>('/settings/gst'),

  updateGst: (data: { gstPercentage: number; includeGst: boolean }) =>
    apiClient.put<{ success: boolean; data: { gstPercentage: number; includeGst: boolean } }>('/settings/gst', data),

  getTechnical: () => apiClient.get<{ success: boolean; data: { panelTypes: unknown[] } }>('/settings/technical'),

  updateTechnical: (data: { panelTypes: unknown[] }) =>
    apiClient.put<{ success: boolean; data: { panelTypes: unknown[] } }>('/settings/technical', data),
};

// Calculations API
export const calculationsApi = {
  calculateROI: (data: { systemKw: number; systemCost: number; unitRate?: number; subsidyAmount?: number }) =>
    apiClient.post<{ success: boolean; data: unknown }>('/calculations/roi', data),

  calculateEMI: (data: { principal: number; annualRate: number; years: number }) =>
    apiClient.post<{ success: boolean; data: { emi: number; totalPayable: number; totalInterest: number } }>('/calculations/emi', data),

  calculatePanels: (data: { systemKw: number; panelType: string; areaLength?: number; areaWidth?: number }) =>
    apiClient.post<{ success: boolean; data: unknown }>('/calculations/panels', data),
};
