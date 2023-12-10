import { AccessService } from './../../../services/access.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    this.getPlayersOptions();
    this.getGenderOptions();
    this.getSubsOptions();
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
        console.log(result);
        if (result.success) {
          const options: OptionsElement[] = result.data.map((player: any) => {
            const parsedName = player.name;
            const age = this.calculateAge(player.birthday);
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
              sub: age
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

  openOperationDialog() {
    const dialogRef = this.dialog.open(PanelComponent, {
      disableClose: true,
      data: {
        openStep: this.openStep,
        itemData: this.form.data,
        operation: this.operation,
        definition: this.form.definition
      },
      width: '50vw'
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
        const options: optionsElement[] = result.map((sub) => {
          const option: any = {
            value: sub.age,
            label: sub.name,
            //sub: sub.age
          };
          return option;
        });
        this.form.definition.forEach((step: any) => {
          step.content.forEach((element: any) => {
            if (element.name === 'sub') {
              element.options = options;
            }
          });
        });
      },
      error: (error) => { }
    });
  }

}
