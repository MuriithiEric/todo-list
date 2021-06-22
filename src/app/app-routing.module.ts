import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'overview',
    loadChildren: () => import('./pages/overview/overview.module').then( m => m.OverviewPageModule)
  },
  
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
 
  {
    path: 'project/:id',
    loadChildren: () => import('./pages/project/project.module').then( m => m.ProjectPageModule)
  },
  //{
  //  path: 'new-project-modal',
  //  loadChildren: () => import('./pages/new-project-modal/new-project-modal.module').then( m => m.NewProjectModalPageModule)
  //},
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
