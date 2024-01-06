import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldsRoutingModule } from './fields-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FieldsMgmtComponent } from './fields-mgmt/fields-mgmt.component';


@NgModule({
  declarations: [
    FieldsMgmtComponent
  ],
  imports: [
    CommonModule,
    FieldsRoutingModule,
    SharedModule
  ]
})
export class FieldsModule { }
