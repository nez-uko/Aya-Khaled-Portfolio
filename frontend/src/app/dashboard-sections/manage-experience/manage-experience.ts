import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api-service';
import { Experience } from '../../shared/interfaces/portfolio-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-experience',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-experience.html'
})
export class ManageExperienceComponent implements OnInit {
  constructor(private api:ApiService){}
  experiences: Experience[] = [];
  loading = true;
  saving = false;
  editing: Experience | null=null;
  message = '';


async save() {
  if (!this.editing) return;
  this.saving = true;

  const formData = new FormData();
  formData.append('title', this.editing.title);
  formData.append('company', this.editing.company);
  formData.append('description', this.editing.description || '');
  formData.append('startDate', this.editing.startDate.toString());
  formData.append('currentlyWorking', this.editing.currentlyWorking.toString());

  if (this.editing.endDate) {
    formData.append('endDate', this.editing.endDate.toString());
  }

  try {
    if (this.editing.id) {
      await this.api.updateExperience(this.editing.id.toString(), formData);
    } else {
      await this.api.createExperience(formData);
    }
    await this.loadExperiences();
    this.editing = null;
    this.message = 'Experience saved successfully!';
    setTimeout(() => this.message = '', 3000);
  } catch (error) {
    this.message = 'Failed to save experience';
  } finally {
    this.saving = false;
  }
}

  async ngOnInit() {
    await this.loadExperiences();
  }

  async loadExperiences() {
    this.loading = true;
    try {
      this.experiences = await this.api.getExperiences();
    } catch (error) {
      console.error('Error loading experiences:', error);
    } finally {
      this.loading = false;
    }
  }

  newExperience() {
    this.editing = {
      id:0,
      title: '',
      company: '',
      description: '',
      startDate: new Date(),
      currentlyWorking: false
    };
  }

  edit(exp: Experience) {
    this.editing = { ...exp };
  }

  cancelEdit() {
    this.editing = null;
  }


  async delete(id: number) {
    const result = await Swal.fire({
            title: 'Delete Project?',
            text: "This action cannot be undone.",
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
              cancelButton: 'soft-button'
            }
          });

          if (result.isConfirmed) {
              try {
                await this.api.deleteExperience(id.toString());
                this.experiences = this.experiences.filter(p => p.id !== id);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Experience deleted successfully',
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

  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }
}
