import { Routes } from '@angular/router';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { CreateIngredientComponent } from './ingredients/create-ingredient/create-ingredient.component';
import { EditIngredientComponent } from './ingredients/edit-ingredient/edit-ingredient.component';
import { IndexIngredientComponent } from './ingredients/index-ingredient/index-ingredient.component';

export const routes: Routes = [
    
    //Página principal
    //{path: ''},

    //Productos
    {path: 'productos', component: ListProductsComponent},
    {path: 'productos/crear', component: CreateProductComponent},

    //Ingredients
    {path: 'ingredientes', component: IndexIngredientComponent},
    {path: 'ingredientes/crear', component: CreateIngredientComponent},
    {path: 'ingredientes/editar/:id', component: EditIngredientComponent},

    //Manejo para rutas que no existen
    {path: '**', redirectTo: ''}
];
