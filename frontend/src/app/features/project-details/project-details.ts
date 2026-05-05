import { Component, inject, OnInit } from '@angular/core';
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

  constructor(private api:ApiService,private route:ActivatedRoute){}
  project?: Project;
  loading = true;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadProject(id);
    }
    console.log( `this is my project${this.project}`);
  }

  async loadProject(id: string) {
    this.loading = true;
    try {
      this.project = await this.api.getProject(id);
      console.log(this.project);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      this.loading = false;
    }
  }
}
