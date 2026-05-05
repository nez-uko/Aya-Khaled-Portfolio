import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ApiService } from '../../services/api-service';
import { User } from '../../interfaces/portfolio-interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl:'./navbar.css'

})
export class NavbarComponent implements OnInit{
  isMenuOpen = false;
  user?:User;
  constructor(private ApiService:ApiService){

  }
  async ngOnInit() {
    await this.loadUserData();
  }


  async loadUserData(){
    this.user= await this.ApiService.getUser();
  }
}
