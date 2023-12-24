import { AccessService } from './../../../services/access.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { min } from 'rxjs';
import { OptionsElement, optionsElement } from 'src/app/models/definition';
import { DefinitionService } from 'src/app/services/definition.service';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';

@Component({
  selector: 'app-teams-mgmt',
  templateUrl: './teams-mgmt.component.html',
  styleUrls: ['./teams-mgmt.component.scss']
})
export class TeamsMgmtComponent implements OnInit {

  clubsList: any[] = [];
  operation: string = '';
  openStep: number = 0;
  optionsSubs: any[] = [];
  titleModule: string = 'Equipos';

  form: any = {
    definition: [],
    data: []
  };

  constructor(
    private accessService: AccessService,
    private definitionService: DefinitionService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
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
      error: (error) => { }
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
      error: (error) => { }
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
      } else if (result && this.operation === 'Agregar') {
        console.log(teamId);
        console.log(result.data);
      }
    });
  }

  handleTeamOperation(teamId?: number): void {
    if (teamId) {
      this.operation = 'Editar';
      this.getTeamData(teamId);
    } else {
      this.operation = 'Agregar';
      this.form.data = [];
      this.openOperationDialog();
    }
  }

  getTeamData(teamId: number): void { }

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

}
