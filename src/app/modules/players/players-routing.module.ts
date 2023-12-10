import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayersMgmtComponent } from './players-mgmt/players-mgmt.component';

const routes: Routes = [
  {
    path: '',
    component: PlayersMgmtComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayersRoutingModule { }
