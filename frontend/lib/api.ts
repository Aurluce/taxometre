const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://taxometre-api.onrender.com/api';

//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';


class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  setRefreshToken(token: string | null) {
    if (token) {
      localStorage.setItem('refresh_token', token);
    } else {
      localStorage.removeItem('refresh_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { detail: `Erreur ${response.status}: ${response.statusText}` };
      }
      
      // Extract detailed error message
      let errorMessage = `Erreur ${response.status}`;
      
      if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
        // Handle DRF validation errors
        if (errorData.detail) {
          errorMessage = String(errorData.detail);
        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors[0] 
            : String(errorData.non_field_errors);
        } else {
          // Get first field error
          const firstKey = Object.keys(errorData)[0];
          if (firstKey) {
            const fieldError = errorData[firstKey];
            errorMessage = `${firstKey}: ${Array.isArray(fieldError) ? fieldError[0] : String(fieldError)}`;
          }
        }
      }
      
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    return response.json();
  }

  // Auth
  async login(username: string, password: string) {
    const response = await this.request<{ 
      access: string; 
      refresh: string; 
      user: any 
    }>(
      '/auth/login/',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );

    this.setToken(response.access);
    this.setRefreshToken(response.refresh);
    return response;
  }

  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');
    
    const response = await this.request<{ access: string }>('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });
    this.setToken(response.access);
    return response;
  }

  async verifySession() {
    return this.request<any>('/auth/verify-session/');
  }

  async logout() {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await this.request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refresh }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
      this.setRefreshToken(null);
    }
  }

  // Vehicles
  async getVehicles(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return this.request<any[]>(`/vehicles/?${queryParams.toString()}`);
  }

  async getVehicle(id: string) {
    return this.request<any>(`/vehicles/${id}/`);
  }

  async createVehicle(data: any) {
    return this.request<any>('/vehicles/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVehicle(id: string, data: any) {
    return this.request<any>(`/vehicles/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteVehicle(id: string) {
    const url = `${this.baseUrl}/vehicles/${id}/`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { detail: `Erreur ${response.status}: ${response.statusText}` };
      }
      
      let errorMessage = `Erreur ${response.status}`;
      
      if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
        if (errorData.detail) {
          errorMessage = String(errorData.detail);
        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors[0] 
            : String(errorData.non_field_errors);
        } else {
          const firstKey = Object.keys(errorData)[0];
          if (firstKey) {
            const fieldError = errorData[firstKey];
            errorMessage = `${firstKey}: ${Array.isArray(fieldError) ? fieldError[0] : String(fieldError)}`;
          }
        }
      }
      
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    return;
  }

  // Alerts
  async getAlerts(params?: {
    status?: string;
    severity?: string;
    is_read?: boolean;
    vehicle?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.severity) queryParams.append('severity', params.severity);
    if (params?.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());
    if (params?.vehicle) queryParams.append('vehicle', params.vehicle);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return this.request<any[]>(`/alerts/?${queryParams.toString()}`);
  }

  async getAlert(id: string) {
    return this.request<any>(`/alerts/${id}/`);
  }

  async acknowledgeAlert(id: string) {
    return this.request<any>(`/alerts/${id}/acknowledge/`, {
      method: 'POST',
    });
  }

  async resolveAlert(id: string) {
    return this.request<any>(`/alerts/${id}/resolve/`, {
      method: 'POST',
    });
  }

  async getAlertStats() {
    return this.request<any>('/alerts/stats/');
  }

  // Trips
  async getTrips(params?: {
    status?: string;
    vehicle?: string;
    start_date?: string;
    end_date?: string;
    is_completed?: boolean;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.vehicle) queryParams.append('vehicle', params.vehicle);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.is_completed !== undefined) {
      queryParams.append('is_completed', params.is_completed.toString());
    }
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return this.request<any[]>(`/trips/?${queryParams.toString()}`);
  }

  async getTrip(id: string) {
    return this.request<any>(`/trips/${id}/`);
  }

  async createTrip(data: any) {
    return this.request<any>('/trips/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTrip(id: string, data: any) {
    return this.request<any>(`/trips/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async startTrip(id: string) {
    return this.request<any>(`/trips/${id}/start/`, {
      method: 'POST',
    });
  }

  async completeTrip(id: string) {
    return this.request<any>(`/trips/${id}/complete/`, {
      method: 'POST',
    });
  }

  async getTripStats() {
    return this.request<any>('/trips/stats/');
  }

  // Users
  async getUsers(params?: { role?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return this.request<any[]>(`/users/?${queryParams.toString()}`);
  }

  async getUser(id: string) {
    return this.request<any>(`/users/${id}/`);
  }

  async createUser(data: any) {
    return this.request<any>('/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any) {
    return this.request<any>(`/users/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<void>(`/users/${id}/`, {
      method: 'DELETE',
    });
  }

  async changePassword(data: { old_password: string; new_password: string; new_password_confirm: string }) {
    return this.request<any>('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;