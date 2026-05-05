import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  isSidebarOpen = false;

  menuItems = [
    { path: 'profile', label: 'Profile', icon: 'bi bi-person-circle me-3' },
    { path: 'manage-projects', label: 'Projects', icon: 'bi bi-kanban-fill me-3' },
    { path: 'manage-education', label: 'Certificates', icon: 'bi bi-award-fill me-3' },
    { path: 'manage-experience', label: 'Experience', icon: 'bi bi-briefcase-fill me-3' }
  ];

  constructor(public auth: AuthService) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.auth.logout();
    }
  }

}
