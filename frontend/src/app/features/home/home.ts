import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../shared/services/api-service';
import {
  Certificate,
  ContactForm,
  Experience,
  FreelancePlatform,
  Project,
  User,
} from '../../shared/interfaces/portfolio-interface';
import { getPlatformDisplay } from '../../shared/Utils/freelance-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {

  constructor(private api: ApiService, private router: Router) {
  }

  @ViewChild('contactFormM') contactFormM!: NgForm;

  user?: User | null;
  projects: Project[] = [];
  certificates: Certificate[] = [];
  experiences: Experience[] = [];

  loading = true;
  sending = false;

  contactForm: ContactForm = {
    name: '',
    email: '',
    message: '',
  };
  contactMessage = '';
  contactSuccess = false;
  loadingError = false;
  errorMessage = '';
  async ngOnInit() {
    await this.loadAllData();
  }

  getAvailablePlatforms() {
    if (!this.user?.freelancePlatforms) return [];

    return this.user.freelancePlatforms.map((platform: FreelancePlatform) => {
      return {
        name: platform.name,
        url: platform.link,
        display: getPlatformDisplay(platform.name)
      };
    });
  }

  async loadAllData() {
    this.loading = true;
    this.loadingError = false;
    this.errorMessage = '';
    try {
      const results = await Promise.allSettled([
        this.api.getUser(),
        this.api.getProjects(),
        this.api.getCertificates(),
        this.api.getExperiences(),
      ]);

      this.user = results[0].status === "fulfilled" ? results[0].value : null;
      this.projects = results[1].status === "fulfilled" ? results[1].value : [];
      this.certificates = results[2].status === "fulfilled" ? results[2].value : [];
      this.experiences = results[3].status === "fulfilled" ? results[3].value : [];

      if (!this.user && this.projects.length === 0 && this.certificates.length === 0 && this.experiences.length === 0) {
        this.loadingError = true;
        this.errorMessage = 'Failed to load data. Please refresh the page.';
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.loadingError = true;
      this.errorMessage = 'Failed to load data. Please check your connection.';
    } finally {
      this.loading = false;
    }

  }

  async sendMessage() {
  this.sending = true;
  try {
    await this.api.sendContact(this.contactForm);
    this.contactSuccess = true;
    this.contactMessage = 'Message sent successfully!';
    this.contactForm = { name: '', email: '', message: '' };

    if (this.contactFormM) {
      this.contactFormM.resetForm();
    }

    setTimeout(() => {
      this.contactMessage = '';
    }, 3000);
  } catch (error) {
    this.contactSuccess = false;
    this.contactMessage = 'Failed to send message. Please try again.';
    setTimeout(() => this.contactMessage = '', 3000);
  } finally {
    this.sending = false;
  }
}

splitDescription(description: string | undefined): string[] {
  if (!description) return [];
  return description
    .split('.')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

redirectToDetails(projectId: number) {
  this.router.navigateByUrl(`/projects/${projectId}`)
}
}
