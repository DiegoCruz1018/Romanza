import { RouterModule, Routes } from '@angular/router';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { CreateIngredientComponent } from './ingredients/create-ingredient/create-ingredient.component';
import { EditIngredientComponent } from './ingredients/edit-ingredient/edit-ingredient.component';
import { IndexIngredientComponent } from './ingredients/index-ingredient/index-ingredient.component';
import { IndexStatusComponent } from './status/index-status/index-status.component';
import { CreateStatusComponent } from './status/create-status/create-status.component';
import { EditStatusComponent } from './status/edit-status/edit-status.component';
import { IndexCombosComponent } from './combos/index-combos/index-combos.component';
import { CreateComboComponent } from './combos/create-combo/create-combo.component';
import { EditComboComponent } from './combos/edit-combo/edit-combo.component';
import { IndexProductsComponent } from './products/index-products/index-products.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { isAdminGuard } from './shares/guards/is-admin.guard';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { AppComponent } from './app.component';
import { LoginLayoutComponent } from './security/login-layout/login-layout.component';
import { MenuComponent } from './shares/menu/menu.component';
import { NgModule } from '@angular/core';
import { isAuthGuard } from './shares/guards/is-auth.guard';
import { IndexUsersComponent } from './users/index-users/index-users.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { IndexOrdersComponent } from './orders/index-orders/index-orders.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { IndexRolesComponent } from './roles/index-roles/index-roles.component';
import { CreateRoleComponent } from './roles/create-role/create-role.component';
import { EditRoleComponent } from './roles/edit-role/edit-role.component';
import { IndexSalesComponent } from './sales/index-sales/index-sales.component';
import { IndexPermissionComponent } from './permissions/index-permission/index-permissions.component';
import { CreatePermissionComponent } from './permissions/create-permission/create-permission.component';
import { EditPermissionComponent } from './permissions/edit-permission/edit-permission.component';
import { hasPermissionGuard } from './shares/guards/has-permission.guard';
import { adminOrPermissionGuard } from './guards/admin-or-permission.guard';

export const routes: Routes = [
    
    //Página principal
    //{path: ''},

    //Login
    {
        path: '', 
        component: LoginLayoutComponent,
        children: [
            {path: '', component: LoginComponent}
        ]
    },

    //Main
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [isAuthGuard], //Proteger rutas con guardia de autenticación
        children: [

            //Ventas
            {path: 'ventas', component: IndexSalesComponent, canActivate: [isAdminGuard]},

            //Ordenes
            {path: 'ordenes', component: IndexOrdersComponent, canActivate: [adminOrPermissionGuard('Ver Ordenes')]},
            {path: 'ordenes/crear', component: CreateOrderComponent, canActivate: [isAdminGuard, hasPermissionGuard('Crear Orden')]},
            {path: 'ordenes/crear/:id', component: CreateOrderComponent, canActivate: [isAdminGuard, hasPermissionGuard('Editar Orden')]},

            //Productos
            {path: 'productos', component: IndexProductsComponent, canActivate: [adminOrPermissionGuard('Ver Productos')]},
            {path: 'productos/crear', component: CreateProductComponent, canActivate: [isAdminGuard, hasPermissionGuard('Crear Producto')]},
            {path: 'productos/editar/:id', component: EditProductComponent, canActivate: [isAdminGuard, hasPermissionGuard('Editar Producto')]},

            //Ingredients
            {path: 'ingredientes', component: IndexIngredientComponent, canActivate: [adminOrPermissionGuard('Ver Ingredientes')]},
            {path: 'ingredientes/crear', component: CreateIngredientComponent, canActivate: [isAdminGuard, hasPermissionGuard('Crear Ingrediente')]},
            {path: 'ingredientes/editar/:id', component: EditIngredientComponent, canActivate: [isAdminGuard, hasPermissionGuard('Editar Ingrediente')]},

            //Status
            {path: 'status', component: IndexStatusComponent, canActivate: [adminOrPermissionGuard('Ver Status')]},
            {path: 'status/crear', component: CreateStatusComponent, canActivate: [isAdminGuard, hasPermissionGuard('Crear Status')]},
            {path: 'status/editar/:id', component: EditStatusComponent, canActivate: [isAdminGuard, hasPermissionGuard('Editar Status')]},

            //Combos
            {path: 'combos', component: IndexCombosComponent, canActivate: [adminOrPermissionGuard('Ver Combos')]},
            {path: 'combos/crear', component: CreateComboComponent, canActivate: [isAdminGuard, hasPermissionGuard('Crear Combo')]},
            {path: 'combos/editar/:id', component: EditComboComponent, canActivate: [isAdminGuard, hasPermissionGuard('Editar Combo')]},

            //Usuarios
            {path: 'usuarios', component: IndexUsersComponent, canActivate: [isAdminGuard, hasPermissionGuard('Ver Usuarios')]},
            {path: 'usuarios/crear', component: RegisterComponent, canActivate: [isAdminGuard, hasPermissionGuard('Crear Usuario')]},
            {path: 'usuarios/editar/:id', component: EditUserComponent, canActivate: [isAdminGuard, hasPermissionGuard('Editar Usuario')]},

            //Roles
            {path: 'roles', component: IndexRolesComponent, canActivate: [isAdminGuard, hasPermissionGuard('Ver Roles')]},
            {path: 'roles/crear', component: CreateRoleComponent, canActivate: [isAdminGuard, hasPermissionGuard('Crear Rol')]},
            {path: 'roles/editar/:id', component: EditRoleComponent, canActivate: [isAdminGuard, hasPermissionGuard('Editar Rol')]},

            //Permisos
            {path: 'permisos', component: IndexPermissionComponent, canActivate: [isAdminGuard, hasPermissionGuard('Ver Permisos')]},
            {path: 'permisos/crear', component: CreatePermissionComponent, canActivate: [isAdminGuard, hasPermissionGuard('Crear Permiso')]},
            {path: 'permisos/editar/:id', component: EditPermissionComponent, canActivate: [isAdminGuard, hasPermissionGuard('Editar Permiso')]}
        ]
    },

    //Manejo para rutas que no existen
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }