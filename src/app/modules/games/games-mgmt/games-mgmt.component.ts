import { DefinitionService } from 'src/app/services/definition.service';
import { Component, OnInit } from '@angular/core';
import { AccessService } from 'src/app/services/access.service';
import { PanelComponent } from 'src/app/shared/components/panel/panel.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OptionsElement, optionsElement } from 'src/app/models/definition';
import { TeamService } from 'src/app/services/team.service';
import { RefereeService } from 'src/app/services/referee.service';
import { GameService } from 'src/app/services/game.service';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';
import { CardModel } from 'src/app/models/CardModel';

export interface optionsGroup {
  letter: string;
  option: { value: string; label: string }[];
}

@Component({
  selector: 'app-games-mgmt',
  templateUrl: './games-mgmt.component.html',
  styleUrls: ['./games-mgmt.component.scss']
})
export class GamesMgmtComponent implements OnInit {

  form: any = {
    definition: [],
    data: []
  }

  gamesList: any[] = [];
  imageSrc!: { url: string, itemId: number };

  operation: string = '';
  openStep: number = 0;
  titleModule: string = 'Partidos';
  optionsSubs: any[] = [];
  optionsGroup: optionsGroup[] = [];

  cardDefinition: CardModel = {
    title: 'name',
    subtitle: 'gender',
    image: '',
    labels: [
      'Fecha',
      'Hora',
      'Árbitro',
      'Sub'
    ],
    values: [
      { element: 'game_date' },
      { element: 'game_time' },
      { element: 'referee' },
      { element: 'sub' },
    ],
    showLabels: true,
    showImage: false
  }


  constructor(
    private accessService: AccessService,
    private definitionService: DefinitionService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private teamsService: TeamService,
    private refereeService: RefereeService,
    private gameService: GameService
  ) { }
  ngOnInit(): void {
    this.getGamesList();
    this.getDefinition();
    this.getGenderOptions();
    this.getSubsOptions();
    this.getTeamsOptions();
    this.getRefereeOptions();
    //this.teamsService.getTeamList();
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
    this.gameService.getGamesList().subscribe({
      next: (result) => {
        if (result.success) {
          console.log(result.data);
          const games = result.data.map((game: any) => {
            const { referee, ...rest } = game;
            const refereeName = JSON.parse(game.referee);
            console.log(refereeName);
            return {
              ...rest,
              referee: `${refereeName.first} ${refereeName.last} ${refereeName.secondLast}`,
            }
          });
          this.gamesList = games;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateGameData(gameId: number, game: any): void {
    console.log(game);
    game.gameTime = this.convertToHHMMSS(game.gameTime);
    this.gameService.updateGame(game, gameId).subscribe({
      next: (result) => {
        this.getGamesList();
        this.showSnackBar('El partido se ha actualizado', 'check_circle', 'green');
      },
      error: (error) => {
        console.log(error);
        this.showSnackBar('Error al actualizar el partido', 'error', 'red');
      }
    });
  }

  addGame(game: any): void {
    console.log(game);
    game.gameTime = this.convertToHHMMSS(game.gameTime);
    this.gameService.addGame(game).subscribe({
      next: (result) => {
        console.log(result);
        if (result.success) {
          this.showSnackBar('El partido se ha agregado', 'check_circle', 'green');
        this.getGamesList();
        } else {
          this.showSnackBar(result.message!, 'error', 'red');
        }
      },
      error: (error) => {
        console.log(error);
        this.showSnackBar('Error al agregar el partido', 'error', 'red');
      } 
    });
  }

   convertToHHMMSS(time: string): string {
    const parts = time.split(':');
    if (parts.length === 2) {
      return `${parts[0]}:${parts[1]}:00`;
    }
    return time;
  }

  deleteGame(gameId: number): void {
    console.log(gameId);
    this.gameService.deleteGame(gameId).subscribe({
      next: (result) => {
        this.showSnackBar('El partido se ha eliminado', 'check_circle', 'green');
        this.getGamesList();
      },
      error: (error) => {
        console.log(error);
        this.showSnackBar('Error al eliminar el partido', 'error', 'red');
      }
    });
  }

  getGameData(gameId: number): void {
    this.gameService.getGameData(gameId).subscribe({
      next: (result) => {
        if (result.success) {
          this.form.data = result.data;
          this.openOperationDialog(gameId);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  calculateSub(age: number, subs: any[]): any {
    const subId = subs.find(sub => age >= sub.minAge && age <= sub.maxAge)?.value;
    return subId ? subId : null;
  }

  getTeamsOptions(): void {
    this.teamsService.getTeamList().subscribe({
      next: (result: any) => {
        if (result.success) {
          const options: OptionsElement[] = result.data.map((team: any) => {
            console.log(team);
            const option: OptionsElement = {
              value: team.id,
              label: `${team.id} ${team.name} ${team.club}`
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

          this.optionsGroup = [];

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
              /*               if (element.name === 'clubOne') {
                              element.options = options;
                            }
              
                            if (element.name === 'clubTwo') {
                              element.options = options;
                            } */

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
        console.log(error);
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
          if (element.name === 'genderId') {
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
              if (element.name === 'subId') {
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
  /*   showSnackBar(message: string) {
      this._snackBar.open(message, '', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['center-message']
      });
    } */

  getRefereeOptions(): void {
    this.refereeService.getRefereesOptions().subscribe({
      next: (result) => {
        console.log(result);
        if (result.success) {
          console.log(result.data);
          const options = result.data.map((referee: any) => {
            return {
              value: referee.id,
              label: `${referee.id} ${referee.name.first} ${referee.name.last} ${referee.name.secondLast}`
            }
          });

          options.sort((a: any, b: any) => {
            let labelPartA = a.label.split(' ')[1];
            let labelPartB = b.label.split(' ')[1];
            if (labelPartA < labelPartB) {
              return -1;
            } else if (labelPartA > labelPartB) {
              return 1;
            } else {
              return 0;
            }
          });

          this.optionsGroup = [];

          options.forEach((option: any) => {
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

          console.log(options);

          this.form.definition.forEach((step: any) => {
            step.content.forEach((element: any) => {
              if (element.name === 'refereeId') {
                element.options = this.optionsGroup;
              }
            });
          });
          console.log(this.form.definition);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
