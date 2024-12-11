import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class HttpClient {
  private api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
    });
  }

  private createHeaders(token?: string, contentType: string = 'application/json'): AxiosRequestConfig {
    return {
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
        'Content-Type': contentType,
      },
    };
  }

  public get<T>(url: string, config?: AxiosRequestConfig, token?: string): Promise<T> {
    const headers = this.createHeaders(token);
    return this.api.get<T>(url, { ...headers, ...config }).then(response => response.data);
  }

  public post<T>(url: string, data?: any,  contentType: string = 'application/json', token?: string): Promise<T> {
    const headers = this.createHeaders(token, contentType);
    return this.api.post<T>(url, data, { ...headers }).then(response => response.data);
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig, contentType: string = 'application/json', token?: string): Promise<T> {
    const headers = this.createHeaders(token, contentType);
    return this.api.put<T>(url, data, { ...headers, ...config }).then(response => response.data);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig, token?: string): Promise<T> {
    const headers = this.createHeaders(token);
    return this.api.delete<T>(url, { ...headers, ...config }).then(response => response.data);
  }

  public patch<T>(url: string, data?: any, config?: AxiosRequestConfig, contentType: string = 'application/json', token?: string): Promise<T> {
    const headers = this.createHeaders(token, contentType);
    return this.api.patch<T>(url, data, { ...headers, ...config }).then(response => response.data);
  }
}

export default HttpClient;
