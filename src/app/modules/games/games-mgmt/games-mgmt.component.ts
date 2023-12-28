import { DefinitionService } from 'src/app/services/definition.service';
import { Component, OnInit } from '@angular/core';
import { AccessService } from 'src/app/services/access.service';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OptionsElement, optionsElement } from 'src/app/models/definition';

export interface optionsGroup {
  letter: string;
  option: { value: string; label: string }[];
}

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
  optionsSubs: any[] = [];

   optionsGroup: optionsGroup[] = [];


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

          console.log(options);

          options.sort((a, b) => {
            // Extrae la parte de la etiqueta que sigue al número
            let labelPartA = a.label.split(' ')[1];
            let labelPartB = b.label.split(' ')[1];
          
            // Compara las partes de las etiquetas para determinar el orden
            if (labelPartA < labelPartB) {
              return -1;
            } else if (labelPartA > labelPartB) {
              return 1;
            } else {
              return 0;
            }
          });

          console.log(options);

          options.forEach(option => {
            // Extrae la parte de la etiqueta que sigue al número
            let labelPart = option.label.split(' ')[1];
          
            // Extrae la primera letra de esta parte de la etiqueta
            let firstLetter = labelPart.charAt(0);
          
            // Busca un grupo existente con la misma letra
            let group = this.optionsGroup.find(group => group.letter === firstLetter);
          
            // Si no existe un grupo con la misma letra, crea uno nuevo
            if (!group) {
              group = { letter: firstLetter, option: [] };
              this.optionsGroup.push(group);
            }
          
            // Añade la opción al grupo
            group.option.push(option);
          });
          
          console.log(this.optionsGroup);

          this.form.definition.forEach((step: any) => {
            step.content.forEach((element: any) => {
              if (element.name === 'clubOne') {
                element.options = options;
              }

              if (element.name === 'clubTwo') {
                element.options = options;
              }

              if (element.name === 'team1') {
                element.options = this.optionsGroup;
              }

              if (element.name === 'team2') {
                element.options = this.optionsGroup;
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

  showSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['center-message']
    });
  }
}
