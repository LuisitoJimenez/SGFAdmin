import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesMgmtComponent } from './games-mgmt/games-mgmt.component';

const routes: Routes = [
   {
    path: '',
    component: GamesMgmtComponent
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
