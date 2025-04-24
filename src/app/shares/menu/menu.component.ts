import { Component, inject, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthorizedComponent } from "../../security/authorized/authorized.component";
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-menu',
  imports: [MatToolbarModule, RouterLink, RouterOutlet, RouterModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, AuthorizedComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  ngOnInit(): void {
    this.userName = this.securityService.getFieldJWT('name');
    this.userLastName = this.securityService.getFieldJWT('lastname');
    // this.securityService.getPermissions();
  }

  public isSidenavOpen: boolean = true;
  userName: string = '';
  userLastName: string = '';

  toogleSidenav(){
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  private securityService = inject(SecurityService);

  hasPermission(permission: string): boolean{
    return this.securityService.hasPermission(permission);
  }

  logout(){
    this.securityService.logout();
  }
}
