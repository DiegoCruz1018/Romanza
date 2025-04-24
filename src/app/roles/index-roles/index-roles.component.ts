import { Component, inject, OnInit } from '@angular/core';
import { IndexEntityComponent } from "../../shares/index-entity/index-entity.component";
import { SERVICE_CRUD_TOKEN } from '../../shares/providers';
import { RolesService } from '../roles-service.service';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-index-roles',
  imports: [IndexEntityComponent],
  templateUrl: './index-roles.component.html',
  styleUrl: './index-roles.component.css',
  providers: [
    {provide: SERVICE_CRUD_TOKEN, useClass: RolesService}
  ]
})
export class IndexRolesComponent implements OnInit{
  
  ngOnInit(): void {
    this.fillColumnToSHow();
  }

  private securityService = inject(SecurityService);

  columnsToShow: string[] = []; 

  hasPermission(permission: string){
    return this.securityService.hasPermission(permission);
  }

  fillColumnToSHow(){
    if(this.securityService.getFieldJWT('Administrador') || this.hasPermission('Editar Rol') || this.hasPermission('Eliminar Rol')){
      this.columnsToShow = ['id', 'name', 'acciones'];
    }else{
      this.columnsToShow = ['id', 'name', 'price'];
    }
  }
}
