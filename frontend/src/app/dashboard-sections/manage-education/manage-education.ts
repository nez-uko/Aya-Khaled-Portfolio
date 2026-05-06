import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api-service';
import { Certificate } from '../../shared/interfaces/portfolio-interface';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-manage-education',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-education.html'
})
export class ManageEducationComponent implements OnInit {
    constructor(private api:ApiService){}
  certificates: Certificate[] = [];
  loading = true;
  saving = false;
  editing: Certificate | null = null;
  message = '';
  selectedFile: File | null = null;

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}

async save() {
  if (!this.editing) return;
  this.saving = true;

  const formData = new FormData();
  formData.append('title', this.editing.title);
  formData.append('issuer', this.editing.issuer);
  formData.append('description', this.editing.description);
  formData.append('issueDate', this.editing.issueDate.toString());

  if (this.selectedFile) {
    formData.append('certificateImage', this.selectedFile);
  }

  try {
    if (this.editing.id) {
      await this.api.updateCertificate(this.editing.id.toString(), formData);
    } else {
      await this.api.createCertificate(formData);
    }
    await this.loadCertificates();
    this.editing = null;
    this.selectedFile = null;
    this.message = 'Certificate saved successfully!';
    setTimeout(() => this.message = '', 3000);
  } catch (error) {
    this.message = 'Failed to save certificate';
  } finally {
    this.saving = false;
  }
}

  async ngOnInit() {
    await this.loadCertificates();
  }

  async loadCertificates() {
    this.loading = true;
    try {
      this.certificates = await this.api.getCertificates();
    } catch (error) {
    } finally {
      this.loading = false;
    }
  }

  newCertificate() {
    this.editing = {
      id:0,
      title: '',
      issuer: '',
      description: '',
      certificateImage: '',
      issueDate: new Date()
    };
  }

  edit(cert: Certificate) {
    this.editing = { ...cert };
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
      await this.api.deleteCertificate(id.toString());
      this.certificates = this.certificates.filter(p => p.id !== id);
      Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Certificate deleted successfully',
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
