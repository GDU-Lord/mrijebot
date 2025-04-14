import axios from 'axios';

export * from './user';
export * from './land';
export * from './game-system';
export * from './role';
export * from './request';
export * from './announcement';

export class API {
  
  constructor(
    public host: string
  ) {}

  async get<type = unknown>(path: string, params: { [key: string]: any } = {}, errorHandler: (err: any) => void = () => {}): Promise<type | null> {
    try {
      const res = await axios.get<type>(this.host + path, { params });
      return res.data;
    } catch (err) {
      errorHandler(err);
      return null;
    }
  }

  async post<type = unknown>(path: string, body: any, params: { [key: string]: any } = {}, errorHandler: (err: any) => void = () => {}): Promise<type | null> {
    try {
      const res = await axios.post<type>(this.host + path, body, {
        headers: { 'Content-Type': "application/json" },
        params
      });
      return res.data;
    } catch (err) {
      errorHandler(err);
      return null;
    }
  }

  async put(path: string, body: any, params: { [key: string]: any } = {}, errorHandler: (err: any) => void = () => {}): Promise<boolean> {
    try {
      const res = await axios.put(this.host + path, body, {
        headers: { 'Content-Type': "application/json" },
        params
      });
      return true;
    } catch (err) {
      errorHandler(err);
      return false;
    }
  }

  async delete(path: string, params: { [key: string]: any } = {}, errorHandler: (err: any) => void = () => {}): Promise<boolean> {
    try {
      const res = await axios.delete(this.host + path, params);
      return true;
    } catch (err) {
      errorHandler(err);
      return false;
    }
  }

}

export const api = new API("http://localhost:3000");