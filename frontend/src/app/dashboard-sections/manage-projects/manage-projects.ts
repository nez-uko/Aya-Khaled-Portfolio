import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api-service';
import { Project } from '../../shared/interfaces/portfolio-interface';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-projects.html',
  styleUrls: ['./manage-projects.css'],
})
export class ManageProjectsComponent implements OnInit {
  constructor(private api: ApiService) {}

  projects: Project[] = [];
  loading = true;
  editing: Project | null = null;
  saving = false;
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async save() {
    if (!this.editing) return;
    this.saving = true;

    const formData = new FormData();
    this.editing.usedSkills = this.editing.usedSkills
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    formData.append('title', this.editing.title);
    formData.append('description', this.editing.description);
    formData.append('liveDemo', this.editing.liveDemo);
    formData.append('githubLink', this.editing.githubLink || '');
    formData.append('usedSkills', JSON.stringify(this.editing.usedSkills));

    if (this.selectedFile) {
      formData.append('projectImage', this.selectedFile);
    }

    try {
      if (this.editing.id) {
        await this.api.updateProject(this.editing.id.toString(), formData);
      } else {
        await this.api.createProject(formData);
      }
      await this.loadProjects();
      this.editing = null;
      this.selectedFile = null;
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      this.saving = false;
    }
  }

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

  addSkill() {
    this.editing?.usedSkills.push('');
  }
  removeSkill(index: number) {
    this.editing?.usedSkills.splice(index, 1);
  }

  edit(project: Project) {
    this.editing = { ...project };
  }

  cancelEdit() {
    this.editing = null;
  }

  newProject() {
    this.editing = {
      id: 0,
      title: '',
      description: '',
      projectImage: '',
      liveDemo: '',
      githubLink: '',
      usedSkills: [],
    };
  }

  async delete(id: number) {
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      iconColor: '#ef4444',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No, keep it',

      width: '350px',
      padding: '1.5rem',
      background: '#111827',
      color: '#f3f4f6',

      confirmButtonColor: '#00adb5',
      cancelButtonColor: '#374151',

      customClass: {
        popup: 'soft-popup',
        title: 'soft-title',
        htmlContainer: 'soft-text',
        confirmButton: 'soft-button',
        cancelButton: 'soft-button',
      },
    });

    if (result.isConfirmed) {
      try {
        await this.api.deleteProject(id.toString());
        this.projects = this.projects.filter((p) => p.id !== id);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Project deleted successfully',
          showConfirmButton: false,
          timer: 2000,
          background: '#111827',
          color: '#f3f4f6',
          customClass: { popup: 'soft-popup' },
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          customClass: { popup: 'soft-popup' },
        });
      }
    }
  }
}
