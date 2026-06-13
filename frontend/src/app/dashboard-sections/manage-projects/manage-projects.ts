import { Component, OnInit } from '@angular/core';
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
  editing: any = null;
  saving = false;
  selectedFiles: File[] = [];

  ngOnInit() {
    this.loadProjects();
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

  getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  onFilesSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const files: File[] = Array.from(event.target.files);
      const currentImagesCount = (this.editing?.projectImages?.length || 0) + this.selectedFiles.length;

      if (currentImagesCount + files.length > 5) {
        Swal.fire({
          icon: 'error',
          title: 'Limit Exceeded',
          text: `You can only upload a maximum of 5 images. You already have ${currentImagesCount} images.`,
          background: '#111827',
          color: '#f3f4f6',
          confirmButtonColor: '#00adb5',
        });
        event.target.value = '';
        return;
      }
      this.selectedFiles.push(...files);
      event.target.value = '';
    }
  }

  removeSelectedFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  removeExistingImage(index: number) {
    if (this.editing && this.editing.projectImages) {
      this.editing.projectImages.splice(index, 1);
    }
  }

  async save() {
    if (!this.editing) return;

    const currentImagesCount = this.editing.projectImages?.length || 0;
    const totalImages = currentImagesCount + this.selectedFiles.length;

    if (totalImages > 5) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'The total number of images for a single project cannot exceed 5.',
        background: '#111827',
        color: '#f3f4f6',
        confirmButtonColor: '#00adb5',
      });
      return;
    }

    this.saving = true;
    const formData = new FormData();

    this.editing.usedSkills = this.editing.usedSkills
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    formData.append('title', this.editing.title);
    formData.append('description', this.editing.description);
    formData.append('liveDemo', this.editing.liveDemo || '');
    formData.append('githubLink', this.editing.githubLink || '');
    formData.append('usedSkills', JSON.stringify(this.editing.usedSkills));

    if (this.editing.id && this.editing.id !== 0) {
      formData.append('remainingImages', JSON.stringify(this.editing.projectImages || []));
    }

    this.selectedFiles.forEach((file) => {
      formData.append('projectImages', file);
    });

    try {
      if (this.editing.id && this.editing.id !== 0) {
        await this.api.updateProject(this.editing.id.toString(), formData);
      } else {
        await this.api.createProject(formData);
      }
      await this.loadProjects();
      this.cancelEdit();
    } catch (error) {
      console.error('Error saving project:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save project. Please try again.',
        background: '#111827',
        color: '#f3f4f6',
      });
    } finally {
      this.saving = false;
    }
  }

  addSkill() {
    this.editing?.usedSkills.push('');
  }

  removeSkill(index: number) {
    this.editing?.usedSkills.splice(index, 1);
  }

  edit(project: Project) {
    this.editing = JSON.parse(JSON.stringify(project));
    this.selectedFiles = [];
  }

  cancelEdit() {
    this.editing = null;
    this.selectedFiles = [];
  }

  newProject() {
    this.selectedFiles = [];
    this.editing = {
      id: 0,
      title: '',
      description: '',
      projectImages: [],
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
          background: '#111827',
          color: '#f3f4f6',
          confirmButtonColor: '#00adb5',
        });
      }
    }
  }
}
