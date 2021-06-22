import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskRowComponent } from './task-row/task-row.component';
import { IonicModule } from '@ionic/angular';
import { SharedPipesModule } from '../pipes/shared-pipes.module';



@NgModule({
  declarations: [TaskRowComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedPipesModule
  ], 
  exports: [TaskRowComponent]
})
export class SharedComponentsModule { }
