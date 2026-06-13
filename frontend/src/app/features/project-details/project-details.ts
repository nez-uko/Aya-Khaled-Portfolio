import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Project } from '../../shared/interfaces/portfolio-interface';
import { ApiService } from '../../shared/services/api-service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.css']
})
export class ProjectDetailsComponent implements OnInit {

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  project?: Project;
  loading = true;
  activeImageUrl: string | null = null;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadProject(id);
    }
  }

  async loadProject(id: string) {
    this.loading = true;
    try {
      this.project = await this.api.getProject(id);
      if (this.project?.projectImages && this.project.projectImages.length > 0) {
        this.activeImageUrl = this.project.projectImages[0].url;
      }
    } catch (error) {

    } finally {
      this.loading = false;
    }
  }

  setActiveImage(url: string) {
    this.activeImageUrl = url;
  }
}
