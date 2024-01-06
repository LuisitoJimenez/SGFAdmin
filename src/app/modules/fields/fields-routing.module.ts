import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FieldsMgmtComponent } from './fields-mgmt/fields-mgmt.component';

const routes: Routes = [
  {
    path: '',
    component: FieldsMgmtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FieldsRoutingModule { }
