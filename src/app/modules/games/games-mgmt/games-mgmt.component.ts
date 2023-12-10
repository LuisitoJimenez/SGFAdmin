import { DefinitionService } from 'src/app/services/definition.service';
import { Component, OnInit } from '@angular/core';
import { AccessService } from 'src/app/services/access.service';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OptionsElement, optionsElement } from 'src/app/models/definition';

@Component({
  selector: 'app-games-mgmt',
  templateUrl: './games-mgmt.component.html',
  styleUrls: ['./games-mgmt.component.scss']
})
export class GamesMgmtComponent implements OnInit{

  form: any = {
    definition: [],
    data: []
  }

  operation: string = '';
  openStep: number = 0;
  titleModule: string = 'Partidos';

  constructor(
    private accessService: AccessService,
    private definitionService: DefinitionService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getGamesList();
    this.getDefinition();
    this.getGenderOptions();
    this.getSubsOptions();
    this.getClubsOptions();
  }

  getDefinition(): void {
    this.definitionService.getGameFormDefinition().subscribe({
      next: (result) => {
        console.log(result);
        this.form.definition = JSON.parse(result);
        console.log(this.form.definition);
      },
      error: (error) => {

      }
    });
  }

  getGamesList(): void {

  }

  updateGameData(gameId: number, game: any): void {

  }

  addGame(game: any): void {

  }

  getGameData(gameId: number): void {

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
              if (element.name === 'clubOne') {
                element.options = options;
              }

              if (element.name === 'clubTwo') {
                element.options = options;
              }
            });
          });

          console.log(this.form.definition);
        }


      },
      error: (error) => {

      }
    });
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
      console.log(this.form.definition);

    });
  }

  getSubsOptions() {
    this.accessService.getSubsList().subscribe({
      next: (result) => {
        const options: optionsElement[] = result.map((sub) => {
          const option: optionsElement = {
            value: sub.id,
            label: sub.name
          };
          return option;
        });
        console.log(options);
        this.form.definition.forEach((step: any) => {
          step.content.forEach((element: any) => {
            if (element.name === 'subs') {
              element.options = options;
            }
          });
        });
      },
      error: (error) => { }
    });
  }

  openOperationDialog(gameId?: number) {
    console.log(gameId);
    console.log(this.form.definition);
    const dialogRef = this.dialog.open(PanelComponent, {
      disableClose: true,
      data: {
        openStep: this.openStep,
        gameId: gameId,
        itemData: this.form.data,
        definition: this.form.definition,
        operation: this.operation
      },
      width: '50vw'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result && this.operation === 'Editar' && gameId) {
        console.log(gameId);
        console.log(result.data);
        this.updateGameData(gameId, result.data);

      } else if (result && this.operation === 'Agregar') {
        console.log(result);
        this.addGame(result.data);
      }

    });
  }

  handleGameOperation(userId?: number): void {
    console.log(userId);
    if (userId) {
      console.log(userId);
      this.operation = 'Editar';
      this.form.definition.forEach((step: any) => {
        step.content.forEach((element: any) => {
          if (element.name === 'users') {
            step.hidden = true;
            element.hidden = true;
          }
          if (element.name === 'id') {
            element.readonly = true;
            element.disabled = false;
          }
        });
      });
      this.getGameData(userId);
    } else {
      console.log(this.form.definition);
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

  showSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['center-message']
    });
  }
}
