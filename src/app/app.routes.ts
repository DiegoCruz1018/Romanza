import { Routes } from '@angular/router';
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

export const routes: Routes = [
    
    //Página principal
    //{path: ''},

    //Productos
    {path: 'productos', component: IndexProductsComponent},
    {path: 'productos/crear', component: CreateProductComponent},
    {path: 'productos/editar/:id', component: EditProductComponent},

    //Ingredients
    {path: 'ingredientes', component: IndexIngredientComponent},
    {path: 'ingredientes/crear', component: CreateIngredientComponent},
    {path: 'ingredientes/editar/:id', component: EditIngredientComponent},

    //Status
    {path: 'status', component: IndexStatusComponent},
    {path: 'status/crear', component: CreateStatusComponent},
    {path: 'status/editar/:id', component: EditStatusComponent},

    {path: 'combos', component: IndexCombosComponent},
    {path: 'combos/crear', component: CreateComboComponent},
    {path: 'combos/editar/:id', component: EditComboComponent},

    //Manejo para rutas que no existen
    {path: '**', redirectTo: ''}
];
