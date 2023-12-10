import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubsRoutingModule } from './clubs-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClubsMgmtComponent } from './clubs-mgmt/clubs-mgmt.component';


@NgModule({
  declarations: [
    ClubsMgmtComponent
  ],
  imports: [
    CommonModule,
    ClubsRoutingModule,
    SharedModule
  ]
})
export class ClubsModule { }
