import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CredentialsUsersDTO, UserDTO } from '../../security/security';
import { SecurityService } from '../../security/security.service';
import { extractErrors } from '../../shares/functions/extractErrors';
import { ShowErrorsComponent } from "../../shares/show-errors/show-errors.component";
import { FormAuthenticationComponent } from "../../security/form-authentication/form-authentication.component";
import { ActivatedRoute, Router } from '@angular/router';
import { extractErrorsIdentity } from '../../shares/functions/extractErrorsIdentity';
import { MultipleSelectorDTO } from '../../shares/multiple-selector/MultipleSelectorModel';

@Component({
  selector: 'app-edit-user',
  imports: [ShowErrorsComponent, FormAuthenticationComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit{
  
  ngOnInit(): void {
    //Obtener el ID de la URL
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      throw new Error('ID parameter is missing in the route');
    }
    
    this.id = id;

    //Usar el ID para obtener los datos del usuario
    // this.securityService.getById(this.id).subscribe(user => {
    //   this.user = user;
    //   // console.log(user);
    // });  
    
    this.securityService.updateGet(this.id).subscribe(model => {
      this.user = model.user;

      this.noSelectedRoles = model.noSelectedRoles.map(role => {
        return <MultipleSelectorDTO>{key: role.id, value: role.name};
      });

      this.selectedRoles = model.selectedRoles.map(role => {
        return <MultipleSelectorDTO>{key: role.id, value: role.name};
      });
    });
  }

  private route = inject(ActivatedRoute);
  private securityService = inject(SecurityService);
  private router = inject(Router);

  id!: string;
  user!: UserDTO;
  noSelectedRoles!: MultipleSelectorDTO[];
  selectedRoles!: MultipleSelectorDTO[];

  errors: string[] = [];

  save(credentials: CredentialsUsersDTO){
    this.securityService.update(this.id, credentials).subscribe({
      next: () => {
        this.router.navigate(['/usuarios']);
      },
      error: err => {
        const errors = extractErrorsIdentity(err);
        this.errors = errors;
      }
    });
  }
}
