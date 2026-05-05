import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api-service';
import { User } from '../../interfaces/portfolio-interface';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl:'./footer.css'
})
export class FooterComponent implements OnInit{
  year = new Date().getFullYear();
  constructor(private _apiService:ApiService){
  }
  user?: User;

  async ngOnInit() {
    await this.loadUser();
  }

  async loadUser() {
    try {
      this.user = await this._apiService.getUser();
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }
}
