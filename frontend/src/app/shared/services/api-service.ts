import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Certificate, ContactForm, Experience, Project, User } from '../interfaces/portfolio-interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;
  constructor(private _httpClient:HttpClient){}

  //Public
  async getUser(): Promise<User> {
    const res:any= await firstValueFrom(this._httpClient.get<User>(`${this.baseUrl}/portfolio/`));
    return res.userData;
  }


  async getProjects(): Promise<Project[]> {
    const res:any= await firstValueFrom(this._httpClient.get<Project[]>(`${this.baseUrl}/portfolio/projects`));
    return res.projects;
  }

  async getProject(id: string): Promise<Project> {
    const res:any= await firstValueFrom(this._httpClient.get<Project>(`${this.baseUrl}/portfolio/project/${id}`));
    return res.project;
  }

  async getCertificates(): Promise<Certificate[]> {
    const res:any= await firstValueFrom(this._httpClient.get<Certificate[]>(`${this.baseUrl}/portfolio/certificates`));
    return res.certificates;
  }

  async getExperiences(): Promise<Experience[]> {
    const res:any= await firstValueFrom(this._httpClient.get<Experience[]>(`${this.baseUrl}/portfolio/experiences`));
    return res.experiences;
  }

  async sendContact(formData: ContactForm): Promise<any> {
    const res:any= await firstValueFrom(this._httpClient.post(`${this.baseUrl}/contact`, formData));
    return res;
  }

  // For Admin
  async uploadProfileImage(formData:FormData):Promise<any>{
    const res:any= await firstValueFrom(this._httpClient.post(`${this.baseUrl}/portfolio/edit/profile-image`,formData));
    return res;
  }
  async updateUser(userData: FormData): Promise<any> {
    const res:any= await firstValueFrom(this._httpClient.put<User>(`${this.baseUrl}/portfolio/edit/`, userData));
    return res;
  }

  async deleteImage():Promise<any>{
    const res:any= await firstValueFrom(this._httpClient.delete(`${this.baseUrl}/portfolio/edit/profile-image`));
    return res;
  }

  async createProject(projectForm:FormData): Promise<any> {
    const res:any= await firstValueFrom(this._httpClient.post<Project>(`${this.baseUrl}/portfolio/edit/project`, projectForm));
    return res;
  }

  async updateProject(id: string, projectForm:FormData): Promise<any> {
    const res:any= await firstValueFrom(this._httpClient.put<Project>(`${this.baseUrl}/portfolio/edit/project/${id}`, projectForm));
    return res;
  }

  async deleteProject(id: string): Promise<void> {
    const res:any= await firstValueFrom(this._httpClient.delete<Project>(`${this.baseUrl}/portfolio/edit/project/${id}`));
    return res;
  }

  async createCertificate(certForm: FormData): Promise<any> {
    const res:any= await firstValueFrom(this._httpClient.post<Certificate>(`${this.baseUrl}/portfolio/edit/certificate`, certForm));
    return res;
  }


  async updateCertificate(id: string, certForm: FormData): Promise<any> {
    const res:any= await firstValueFrom(this._httpClient.put<Certificate>(`${this.baseUrl}/portfolio/edit/certificate/${id}`, certForm));
    return res;
  }


  async deleteCertificate(id: string): Promise<void> {
    await firstValueFrom(this._httpClient.delete(`${this.baseUrl}/portfolio/edit/certificate/${id}`));
  }

  async createExperience(expForm:FormData): Promise<any> {

    const res:any= await firstValueFrom(this._httpClient.post<Experience>(`${this.baseUrl}/portfolio/edit/experience`, expForm));
    return res;
  }


  async updateExperience(id: string, expForm: FormData): Promise<any> {
    const res:any= await firstValueFrom(this._httpClient.put<Experience>(`${this.baseUrl}/portfolio/edit/experience/${id}`, expForm));
    return res;
  }


  async deleteExperience(id: string): Promise<void> {
    await firstValueFrom(this._httpClient.delete(`${this.baseUrl}/portfolio/edit/experience/${id}`));
  }



}
