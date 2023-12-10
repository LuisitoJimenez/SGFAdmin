import { Component } from '@angular/core';

@Component({
  selector: 'app-tournaments-mgmt',
  templateUrl: './tournaments-mgmt.component.html',
  styleUrls: ['./tournaments-mgmt.component.scss']
})
export class TournamentsMgmtComponent {

  titleModule: string = 'Torneos';

  handleUserOperation(userId?: number): void { }

}
