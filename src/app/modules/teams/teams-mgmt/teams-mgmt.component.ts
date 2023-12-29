import { AccessService } from './../../../services/access.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { min } from 'rxjs';
import { CardModel } from 'src/app/models/CardModel';
import { OptionsElement, optionsElement } from 'src/app/models/definition';
import { DefinitionService } from 'src/app/services/definition.service';
import { TeamService } from 'src/app/services/team.service';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-teams-mgmt',
  templateUrl: './teams-mgmt.component.html',
  styleUrls: ['./teams-mgmt.component.scss']
})
export class TeamsMgmtComponent implements OnInit {

  imageSrc!: { url: string, itemId: number };
  clubsList: any[] = [];
  operation: string = '';
  openStep: number = 0;
  optionsSubs: any[] = [];
  teamsList: any[] = [];
  titleModule: string = 'Equipos';

  form: any = {
    definition: [],
    data: []
  };

  cardDefinition: CardModel = {
    title: 'name',
    subtitle: 'gender',
    image: '',
    labels: [
       'Club',
       'Coach',
       'Sub'
    ],
    values: [
      { element: 'club'},
      { element: 'coach'},
      { element: 'sub'},
    ],
    showLabels: true,
    showImage: false
  };

  constructor(
    private accessService: AccessService,
    private teamService: TeamService,
    private definitionService: DefinitionService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getTeamList();
    this.getDefinition();
    this.getClubsOptions();
    this.getSubsOptions();
    this.getPlayersOptions();
    this.getGenderOptions();
  }

  getDefinition(): void {
    this.definitionService.getTeamFormDefinition().subscribe({
      next: (result) => {
        this.form.definition = JSON.parse(result);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getTeamList() {
    this.teamService.getTeamList().subscribe({
      next: (result: any) => {
        if (result.success) {
          console.log(result.data);
          this.teamsList = result.data;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getClubsOptions(): void {
    this.accessService.getClubsList().subscribe({
      next: (result: any) => {
        if (result.success) {
          const options: OptionsElement[] = result.data.map((club: any) => {
            const option: OptionsElement = {
              value: club.id,
              label: `${club.id} ${club.name}`
            };
            return option;
          });
          this.form.definition.forEach((step: any) => {
            step.content.forEach((element: any) => {
              if (element.name === 'clubs') {
                element.options = options;
              }
            });
          });
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  calculateAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getPlayersOptions() {
    this.accessService.getPlayersList().subscribe({
      next: (result: any) => {
        console.log(this.optionsSubs);
        console.log(result);
        if (result.success) {
          const options: OptionsElement[] = result.data.map((player: any) => {
            const parsedName = player.name;
            const age = this.calculateAge(player.birthday);
            console.log(age);
            console.log(this.calculateSub(age, this.optionsSubs));
            const sub = this.calculateSub(age, this.optionsSubs);
            let gender;
            if (player.genderId === 1) {
              gender = 'Masculino';
            } else if (player.genderId === 2) {
              gender = 'Femenino';
            }
            const option: any = {
              value: player.id,
              label: `${player.id} ${parsedName.first} ${parsedName.last} ${parsedName.secondLast}`,
              gender: player.genderId,
              sub: sub
            };
            return option;
          });
          console.log(options);
          this.form.definition.forEach((step: any) => {
            step.content.forEach((element: any) => {
              if (element.name === 'titularPlayers') {
                element.options = options;
              }
              if (element.name === 'substitutePlayers') {
                element.options = options;
              }
            });
          });
        }
      },
      error: (error) => { }
    });
  }

  calculateSub(age: number, subs: any[]): any {
    const subId = subs.find(sub => age >= sub.minAge && age <= sub.maxAge)?.value;
    return subId ? subId : null;
  }

  openOperationDialog(teamId?: number): void {
    const dialogRef = this.dialog.open(PanelComponent, {
      disableClose: true,
      data: {
        openStep: this.openStep,
        teamId: teamId,
        itemData: this.form.data,
        //operation: this.operation,
        definition: this.form.definition,
        operation: this.operation
      },
      width: '50vw'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.operation === 'Editar' && teamId) {
        console.log(teamId);
        console.log(result.data);
        this.updateTeam(teamId, result.data);
      } else if (result && this.operation === 'Agregar') {
        console.log(teamId);
        console.log(result.data);
        this.addTeam(result.data, result.data.clubs[0]);
      }
    });
  }

  addTeam(team: any, clubId: number): void {
    console.log(team, clubId);
    const body = {
      teamName: team.name,
      coachName: team.coach,
      genderId: team.gender,
      subId: team.sub,
    }
    console.log(body);
    this.teamService.addTeam(body, clubId).subscribe({
      next: (result) => {
        this.showSnackBar('Equipo agregado correctamente', 'check_circle', 'green');
        setTimeout(() => {
          this.getTeamList();
        }, 1000);
      },
      error: (error) => {
        console.log(error);
        this.showSnackBar('Error al agregar equipo', 'error', 'red');
      }
    });
  }

  deleteTeam(teamId: number): void {
    this.teamService.deleteTeam(teamId).subscribe({
      next: (result) => {
        this.getTeamList();
        this.showSnackBar('Equipo eliminado correctamente', 'check_circle', 'green');
      },
      error: (error) => {
        console.log(error);
        this.showSnackBar('Error al eliminar equipo', 'error', 'red');
      }
    });
  }

  updateTeam(teamId: number, team: any) {
    const body = {
      teamName: team.name,
      coachName: team.coach,
      genderId: team.gender,
      subId: team.sub,
    }
    this.teamService.updateTeam(body, teamId).subscribe({
      next: (result) => {
        this.getTeamList();
        this.showSnackBar('Equipo actualizado correctamente', 'check_circle', 'green');
      },
      error: (error) => {
        console.log(error);
        this.showSnackBar('Error al actualizar equipo', 'error', 'red');
      }
    });
  }

  handleTeamOperation(teamId?: number): void {
    if (teamId) {
      this.operation = 'Editar';
      this.form.definition.forEach((step: any) => {
        step.content.forEach((element: any) => {
          if (element.name === 'clubs') {
            step.hidden = true;
            element.hidden = true;
          }
          if (element.name === 'id') {
            element.readonly = true;
            element.disabled = false;
          }
        });
      });
      this.getTeamData(teamId);
    } else {
      this.operation = 'Agregar';
      this.form.data = [];
      this.form.definition.forEach((step: any) => {
        step.content.forEach((element: any) => {
          if (element.name === 'users') {
            step.hidden = false;
            element.hidden = false;
          }
          if (element.name === 'id') {
            element.readonly = true;
            element.disabled = true;
          }
        });
      });
      this.openOperationDialog();
    }
  }

  getTeamData(teamId: number): void {
    this.teamService.getTeamData(teamId).subscribe({
      next: (result) => {
        console.log(result);
        if (result.success) {
          this.form.data = result.data;
          this.openOperationDialog(teamId);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.openStep = 1;
  }

  getGenderOptions() {
    this.accessService.getGendersList().subscribe((result) => {
      const options: optionsElement[] = result.map((gender) => {
        if (gender.name === 'Masculino') {
          gender.name = 'Varonil'
        } else if (gender.name === 'Femenino') {
          gender.name = 'Femenil'
        }
        const option: optionsElement = {
          //value: gender.name,
          value: gender.id,
          label: gender.name
        };
        return option;
      });
      console.log(options);
      this.form.definition.forEach((step: any) => {
        step.content.forEach((element: any) => {
          if (element.name === 'gender') {
            element.options = options;
          }
        });
      });
    });
  }

  getSubsOptions() {
    this.accessService.getSubsList().subscribe({
      next: (result) => {
        console.log(result);
        if (result.success) {
          console.log(result.data);
          this.optionsSubs = result.data.map((sub: any) => {
            const option = {
              value: sub.id,
              label: sub.name,
              minAge: sub.minAge,
              maxAge: sub.maxAge
            }
            return option;
          });

          this.form.definition.forEach((step: any) => {
            step.content.forEach((element: any) => {
              if (element.name === 'sub') {
                element.options = this.optionsSubs;
              }
            });
          });
          console.log(this.optionsSubs);
        }
        /*         const options: optionsElement[] = result.map((sub) => {
                  const option: any = {
                    value: sub.id,
                    label: sub.name,
                    //sub: sub.age
                  };
                  return option;
                });
                console.log(options);
                this.form.definition.forEach((step: any) => {
                  step.content.forEach((element: any) => {
                    if (element.name === 'sub') {
                      element.options = options;
                    }
                  });
                }); */
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  showSnackBar(message: string, snackIcon: string, iconColor: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: { message: message, snackIcon: snackIcon, iconColor: iconColor },
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['center-message']
    });
  }

}
