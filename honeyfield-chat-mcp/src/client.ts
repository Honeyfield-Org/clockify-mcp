const API_URL = process.env.HONEYFIELD_API_URL ?? 'http://localhost:3010';
const API_KEY = process.env.HONEYFIELD_API_KEY ?? '';

export class HoneyfieldClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = API_URL.replace(/\/+$/, '');
    this.apiKey = API_KEY;
    if (!this.apiKey) {
      throw new Error('HONEYFIELD_API_KEY environment variable is required');
    }
  }

  private headers(): Record<string, string> {
    return {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  private buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async request<T>(method: string, path: string, options?: {
    params?: Record<string, string | number | undefined>;
    body?: unknown;
  }): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    console.error(`[honeyfield] ${method} ${url}`);

    const init: RequestInit = {
      method,
      headers: this.headers(),
    };

    if (options?.body !== undefined) {
      init.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, init);

    if (!response.ok) {
      const text = await response.text().catch(() => 'No response body');
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  async get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    return this.request<T>('GET', path, { params });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, { body });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, { body });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, { body });
  }

  async delete<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('DELETE', path, { body });
  }
}

let clientInstance: HoneyfieldClient | null = null;

export function getClient(): HoneyfieldClient {
  if (!clientInstance) {
    clientInstance = new HoneyfieldClient();
  }
  return clientInstance;
}
