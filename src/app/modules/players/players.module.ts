import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersRoutingModule } from './players-routing.module';
import { PlayersMgmtComponent } from './players-mgmt/players-mgmt.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PlayersMgmtComponent
  ],
  imports: [
    CommonModule,
    PlayersRoutingModule,
    SharedModule
  ]
})
export class PlayersModule { }
