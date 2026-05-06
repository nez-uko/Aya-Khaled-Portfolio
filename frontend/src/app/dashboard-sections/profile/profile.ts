import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FreelancePlatform, User } from '../../shared/interfaces/portfolio-interface';
import { ApiService } from '../../shared/services/api-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  user?: User;
  loading = true;
  saving = false;
  message = '';
  uploadingImage = false;
  selectedCVFile: File | null = null;
  userSkills:string[]=[];
  freelancePlatforms:FreelancePlatform[]=[];

  constructor(private api: ApiService) {}

  async ngOnInit() {
    await this.loadUser();
  }

  async loadUser() {
    this.loading = true;
    try {
      this.user = await this.api.getUser();
      this.userSkills=this.user.skills? this.user.skills : [];
      this.freelancePlatforms=this.user.freelancePlatforms? this.user.freelancePlatforms:[];
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      this.loading = false;
    }
  }


  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file || !this.user) return;

    this.uploadingImage = true;
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await this.api.uploadProfileImage(formData);
      if (response && response.profileImage) {
        this.user.profile = response.profileImage;
        this.message = 'Image updated successfully!';
        await this.loadUser();
      }
    } catch (error) {
      this.message = 'Failed to upload image';
    } finally {
      this.uploadingImage = false;
      setTimeout(() => this.message = '', 3000);
    }
  }

  async deleteProfileImage() {
    if (!confirm('Are you sure you want to delete your profile image?')) return;
    try {
      await this.api.deleteImage();
      if (this.user) this.user.profile = '';
      this.message = 'Image deleted successfully!';
    } catch (error) {
      this.message = 'Failed to delete image';
    } finally {
      setTimeout(() => this.message = '', 3000);
    }
  }

  onCVSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedCVFile = file;
    this.message = 'CV selected: ' + file.name;
    setTimeout(() => this.message = '', 3000);
  }
}

  addSkill(){
    this.userSkills.push('');
  }
  removeSkill(index:number){
    this.userSkills.splice(index,1);

  }
  addPlatform() {
    this.freelancePlatforms.push({ name: '', link: '' });
  }

  removePlatform(index: number) {
    this.user?.freelancePlatforms?.splice(index, 1);
  }

  async save() {
  if (!this.user) return;
  this.saving = true;
  this.message = "";

  try {
    const formData = new FormData();
    this.userSkills=this.userSkills.map(s=>s.trim()).filter(s=>s.length>0);
    formData.append('name', this.user.name);
    formData.append('bio', this.user.bio || '');
    formData.append('linkedIn',this.user.linkedIn);
    formData.append('gitHub',this.user.gitHub);
    formData.append('city',this.user.city);
    formData.append('street',this.user.street|| '');
    formData.append('governorate',this.user.governorate);
    formData.append('description', this.user.description || '');
    formData.append('skills', JSON.stringify(this.userSkills));
    formData.append('freelancePlatforms', JSON.stringify(this.freelancePlatforms));
    if (this.selectedCVFile) {
      formData.append('cv', this.selectedCVFile);
    }
    await this.api.updateUser(formData);

    this.message = 'Profile and CV updated successfully!';
    this.selectedCVFile = null;
  } catch (error) {
    console.error(error);
    this.message = 'Failed to update profile data';
  } finally {
    this.saving = false;
    setTimeout(() => this.message = '', 3000);
  }
}
}
