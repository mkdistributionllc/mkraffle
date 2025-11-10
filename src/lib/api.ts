import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

// Create a cached axios instance using axios-cache-interceptor. This gives us
// per-request cache controls (via `{ cache: { ttl } }`) and `response.cached`.
const baseInstance = Axios.create({
  baseURL: API_BASE_URL
});

export const mk100GlassApi = setupCache(baseInstance, {
  ttl: 1000 * 60 * 5,
  interpretHeader: false,
  methods: ['get'],
  cachePredicate: {
    statusCheck: (status) => status >= 200 && status < 400,
  },
});

mk100GlassApi.interceptors.request.use(
  (config) => {
    const url = (config?.url || '').toString();
    // console.log(url)
    const consumerKey = process.env.NEXT_PUBLIC_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_CONSUMER_SECRET;
    // apply basic auth when the request targets WooCommerce REST v3 endpoints
    if (
      consumerKey &&
      consumerSecret &&
      url.includes('/wp-json/wc/v3')
    ) {
      // axios will send Basic auth header for this request
      (config as any).auth = {
        username: consumerKey,
        password: consumerSecret,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

mk100GlassApi.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
);

export const authApi = {
  register: async (payload: FormData) => {
    const response = await mk100GlassApi.post("wp-json/mk100glass/v1/register", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  login: async (login: string, password: string) => {
    const response = await mk100GlassApi.post('wp-json/mk100glass/v1/login', {
      login,
      password,
    });
    const data = response.data;
    if (data.success) {
      return {
        success: true,
        token: data.token,  
        user: data.user,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Login failed'
      };
    }
  },
  resetPassword: async (email: string) => {
    const response = await mk100GlassApi.post('/reset-password', {
      email,
    });
    return response.data;
  },
  fetchUserAccount: async () => {
    const token = tokenStorage.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Use application password authentication for WordPress
    const response = await mk100GlassApi.get('/user/account?timestamp=' + Date.now(), {
      headers: {
        'Authorization': `Application ${token}`,
      },
    });
    return response.data;
  },
};

export const cookieUtils = {
  setCookie: (name: string, value: string, days: number = 30) => {
    if (typeof window !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
  },
  getCookie: (name: string): string | null => {
    if (typeof window !== 'undefined') {
      const nameEQ = name + "=";
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  },
  deleteCookie: (name: string) => {
    if (typeof window !== 'undefined') {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }
};

export const tokenStorage = {
  setToken: (token: string, rememberMe: boolean = false) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mkd_token', token);
      const days = rememberMe ? 30 : 1;
      cookieUtils.setCookie('mkd_auth_token', token, days);
    }
  },
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mkd_token') || cookieUtils.getCookie('mkd_auth_token');
    }
    return null;
  },
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mkd_token');
      cookieUtils.deleteCookie('mkd_auth_token');
    }
  },
  setUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mkd_user', JSON.stringify(user));
    }
  },
  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('mkd_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mkd_user');
    }
  },
  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mkd_token');
      localStorage.removeItem('mkd_user');
      cookieUtils.deleteCookie('mkd_auth_token');
    }
  }
};

export const authUtils = {
  isAuthenticated: (): boolean => {
    const token = tokenStorage.getToken();
    const user = tokenStorage.getUser();
    return !!(token && user);
  },
  getCurrentUser: () => {
    return tokenStorage.getUser();
  },
  getToken: () => {
    return tokenStorage.getToken();
  },
  setUser: (user: any) => {
    tokenStorage.setUser(user);
  },
  logout: () => {
    tokenStorage.clearAll();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'));
    }
  },
  setAuthData: (token: string, user: any, rememberMe: boolean = false) => {
    tokenStorage.setToken(token, rememberMe);
    tokenStorage.setUser(user);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'));
    }
  }
};