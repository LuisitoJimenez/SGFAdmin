import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { userFormDefinition } from '../modules/users/user-definition';
import { playerDefinition } from '../modules/players/player-definition';
import { refereeFormDefinition } from '../modules/referees/referee-definition';
import { teamFormDefinition } from '../modules/teams/team-definition';
import { clubFormDefinition } from '../modules/clubs/club-definition';
import { gameFormDefinition } from '../modules/games/game-definition';
import { fieldFormDefinition } from '../modules/fields/field-definition';

@Injectable({
  providedIn: 'root'
})
export class DefinitionService {

  constructor() { }

  getUserDefinition(): Observable<any> {
    const userFormDef = JSON.stringify(userFormDefinition);
    {
      return of(userFormDef);
    }
  }

  getPlayerDefinition(): Observable<any> {
    const playerDef = JSON.stringify(playerDefinition);
    {
      return of(playerDef);
    }
  }

  getClubDefinition(): Observable<any> {
    const clubFormDef = JSON.stringify(clubFormDefinition);
    {
      return of(clubFormDef);
    }
  }

  getRefereeDefinition(): Observable<any> {
    const refereeDef = JSON.stringify(refereeFormDefinition);
    {
      return of(refereeDef);
    }
  }

  getTeamFormDefinition(): Observable<any> {
    const teamFormDef = JSON.stringify(teamFormDefinition);
    {
      return of(teamFormDef);
    }
  }

  getGameFormDefinition(): Observable<any> {
    const gameFormDef = JSON.stringify(gameFormDefinition);
    {
      return of(gameFormDef);
    }
  }

  getFieldFormDefinition(): Observable<any> 
  {
    const fieldFormDef = JSON.stringify(fieldFormDefinition);
    {
      return of(fieldFormDef);
    }
  }

}
