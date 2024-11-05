import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from '../../material.module';
import { MaterialRoutingModule } from './material-routing.module';
import { MaterialComponent } from './material.component';

@NgModule({
  declarations: [MaterialComponent],
  imports: [CommonModule, MaterialRoutingModule, MaterialExampleModule, FormsModule, ReactiveFormsModule]
})
export class MaterialModule {}
