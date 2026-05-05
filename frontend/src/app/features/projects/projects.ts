import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../shared/services/api-service';
import { Project } from '../../shared/interfaces/portfolio-interface';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class ProjectsComponent implements OnInit {
  constructor(private api: ApiService, private router:Router) {

    }
  projects: Project[] = [];
  loading = true;

  async ngOnInit() {
    await this.loadProjects();
  }

  async loadProjects() {
    this.loading = true;
    try {
      this.projects = await this.api.getProjects();
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      this.loading = false;
    }
  }
  redirectToDetails(projectId:number){
    this.router.navigateByUrl(`/projects/${projectId}`)
  }
}
