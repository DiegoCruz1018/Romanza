import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SecurityService } from './security/security.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{

  ngOnInit(): void {

    // this.securityService.loadPermissions().subscribe(permissions => {
    //   this.permissions = permissions
    //   console.log(permissions);
    // });

    // this.securityService.hasPermission('Ver Ventas');
    //this.securityService.getRol();
  }

  title = 'romanza';
  // permissions!: string[];

  //private securityService = inject(SecurityService);
}