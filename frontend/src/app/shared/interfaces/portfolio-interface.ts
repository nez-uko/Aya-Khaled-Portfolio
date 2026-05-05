export interface FreelancePlatform {
  name: string;
  link: string;
}


export interface User {
  _id?: string;
  name: string;
  email: string;
  bio: string;
  description: string;
  linkedIn:string;
  gitHub:string;
  profile: string;
  skills: string[];
  phoneNumber:string;
  city:string;
  street?:string;
  governorate:string;
  cv:string;
  freelancePlatforms: FreelancePlatform[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  projectImage: string;
  liveDemo: string;
  githubLink?: string;
  usedSkills:string[];
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  description: string;
  certificateImage: string;
  issueDate: Date;
}

export interface Experience {
  id?: number;
  title: string;
  company: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
export interface ForgetPassword{
  email:string;
}

export interface ResetPassword{
  password:string;
  token:string;
}

export interface VerifyOTP{
  otp:string;
  token:string;
}

export interface PlatformDisplay{
  type:'fa-icon'|'svg'| 'initals',
  value:string,
  bgColor?:string
}

export const FREELANCE_ICONS:Record<string,string>={
    'upwork':'fa-brands fa-upwork',
    'freelancer':'fa-brands fa-freelancer',
    'behance':'fa-brands fa-behance',
    'fiverr':'./image-removebg-preview.png',
    'mostaql':'./id2dnSKj5J_1776166139461.png',
    'kafel':'../idaDLnXIcq_1776165287356.svg',
    'khamsat':'./image-removebg-preview.png'
}


