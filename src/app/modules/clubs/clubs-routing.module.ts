import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubsMgmtComponent } from './clubs-mgmt/clubs-mgmt.component';

const routes: Routes = [
  {
    path: '',
    component: ClubsMgmtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubsRoutingModule { }
