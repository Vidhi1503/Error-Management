import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private router = inject(Router);

  collapsed = signal(false);   // laptop/tablet: sidebar poora band ya khula
  mobile = signal(false);      // mobile screen hai ya nahi
  mobileOpen = signal(false);  // mobile: drawer khula hai ya nahi
  dark = signal(false);

  // Profile Modal Signals
  showProfileModal = signal(false);
  userName = signal(sessionStorage.getItem('userName') || 'Admin');
  tempUserName = signal('');

  // Password Modal Signals
  showPasswordModal = signal(false);
  newPassword = signal('');
  confirmPassword = signal('');
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);
  passwordError = signal('');

  // Logout Modal Signal
  showLogoutModal = signal(false);

  private mode = '';

  constructor() {
    this.checkScreen();
  }

  // Screen ka size badalne par chalta hai
  @HostListener('window:resize')
  checkScreen() {
    const w = window.innerWidth;
    const mode = w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'laptop';

    if (mode === this.mode) return;
    this.mode = mode;

    this.mobile.set(mode === 'mobile');
    this.collapsed.set(mode === 'tablet');
    this.mobileOpen.set(false);
  }

  toggleMenu() {
    if (this.mobile()) {
      this.mobileOpen.update((v) => !v);
    } else {
      this.collapsed.update((v) => !v);
    }
  }

  // Mobile par link dabane ke baad drawer band ho jaye
  closeMenu() {
    if (this.mobile()) this.mobileOpen.set(false);
  }

  toggleTheme() {
    this.dark.update((v) => !v);
    document.body.classList.toggle('dark', this.dark());
  }

  // Profile modal functions
  openProfileModal() {
    this.tempUserName.set(this.userName());
    this.showProfileModal.set(true);
  }

  saveProfile() {
    this.userName.set(this.tempUserName());
    sessionStorage.setItem('userName', this.tempUserName());
    this.showProfileModal.set(false);
  }

  cancelProfile() {
    this.showProfileModal.set(false);
  }

  // deleteProfile() {
  //   this.userName.set('');
  //   this.tempUserName.set('');
  //   sessionStorage.removeItem('userName');
  //   this.showProfileModal.set(false);
  // }

  // Change Password modal functions
  openPasswordModal() {
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);
    this.passwordError.set('');
    this.showPasswordModal.set(true);
  }

  savePassword() {
    if (!this.newPassword() || !this.confirmPassword()) {
      this.passwordError.set('Please fill all fields');
      return;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.passwordError.set('passwords does not match');
      return;
    }
    this.passwordError.set('');
    this.showPasswordModal.set(false);
  }

  cancelPassword() {
    this.showPasswordModal.set(false);
  }

  // Logout modal functions
  openLogoutModal() {
    this.showLogoutModal.set(true);
  }

  confirmLogout() {
    sessionStorage.removeItem('token');
    this.showLogoutModal.set(false);
    this.router.navigate(['/login']);
  }

  cancelLogout() {
    this.showLogoutModal.set(false);
  }
}