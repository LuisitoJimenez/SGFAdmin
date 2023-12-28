import { DataService } from './../../../services/data.service';
import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Observable, map, of, startWith } from 'rxjs';
import { DefinitionAccordion } from 'src/app/models/definition';

//test
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';

//test autocomplete
export interface State {
  flag: string;
  name: string;
  population: string;
}


export interface optionsGroup {
  letter: string;
  option: { value: string; label: string }[];
}

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {

  appliedFilters: { [key: string]: any } = {};
  openStep = 0;
  uploadElementName: any;
  initialDataClone: any;
  buttonNextLabel: string = '';
  buttonPrevLabel: string = '';
  hiddenActions: boolean = true;
  panelTitle: string[] = [];
  panelDescription: string[] = [];
  panelIcon: string[] = [];
  definition: DefinitionAccordion[];
  userId: number;
  firstListOptions: any[] = [];
  secondListOptions: any[] = [];
  form: FormGroup = new FormGroup({});
  isLoaded: boolean = false;
  initialData: any;
  itemData: any;
  operation: string = '';
  options: any[] = [];
  filteredOptions: { [key: string]: any[] } = {};
  selectedOption: any;
  optionsList: any[] = [];
  originalImageUrl: string = '';
  originalOptions: { [key: string]: any[] } = {};
  selectedLabel: string = '';
  linkedElements: { [key: string]: any[] } = {};
  linkedElement: string[] = [];
  imageUrl2: string = '';
  fileUrl: string = '';
  //filteredHours!: Observable<string[]>;
  //groupOptions: Observable<optionsGroup[]>[]= [];



  //filteredFruits: Observable<string[]>;


  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private dataService: DataService
  ) {
    this.openStep = data.openStep;
    this.definition = data.definition;
    this.userId = data.userId;
    this.operation = data.operation;
    this.itemData = data.data;

/*     this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    ); */

    //test
/*     this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit, 'team1') : this.allFruits.slice())),
    ); */

/*     this.filteredOptions = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice())
    );
 */
    //test autocomplete
/*     this.filteredHours = this.form.get('time')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterHours(value))
    ); */

  }

/*   private _filterHours(value: string): string[] {
    //const filterValue = value.toLowerCase();
  
    return this.hours.filter(hour => hour.toLowerCase().includes(value));
  } */

  setStep(index: number) {
    this.openStep = index;
  }

  nextStep() {
    this.openStep++;
  }

  prevStep() {
    this.openStep--;
  }

  hours: string[] = [];

  ngOnInit(): void {
    this.createForm();
    if (this.userId) {
      this.initialData = this.form.value;
    }
    this.imageUrl2 = this.data.itemData.imagePlayer;
    this.initialDataClone = JSON.parse(JSON.stringify(this.initialData));

/*     if (this.form.get('time')) {
      this.filteredHours = this.form.get('time')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, this.hours))
      );
      console.log(this.filteredHours);
    } else {
      this.filteredHours = of([]);
    }

    this.filteredHours.subscribe(values => {
      console.log(values);
    }); */


    
  }


  onSelectionChange(event: any, element: any) {
    const selectedOption = event.options[0].value;
    const selectedLabelWithNumber = this.filteredOptions[element].find((option: any) => option.value === selectedOption).label;
    this.selectedLabel = selectedLabelWithNumber.split(' ').slice(1).join(' ');
    this.form.get(this.linkedElement[element])?.setValue(this.selectedLabel);
    //const isSelected = event.options.some((option: any) => option.value === selectedOption);
    if (event.options[0].selected) {
      if (element === 'titularPlayers') {
        this.filteredOptions['substitutePlayers'] = this.filteredOptions['substitutePlayers'].filter((option: any) => option.value !== selectedOption);
      } else if (element === 'substitutePlayers') {
        this.filteredOptions['titularPlayers'] = this.filteredOptions['titularPlayers'].filter((option: any) => option.value !== selectedOption);
      }
    } else {
      this.filteredOptions['titularPlayers'] = [...this.originalOptions['titularPlayers']];
      this.filteredOptions['substitutePlayers'] = [...this.originalOptions['substitutePlayers']];
    }
    Object.keys(this.appliedFilters).forEach(filterField => {
      this.filteredOptions['titularPlayers'] = this.filteredOptions['titularPlayers'].filter((option: any) => {
        return option[filterField] === this.appliedFilters[filterField];
      });
      this.filteredOptions['substitutePlayers'] = this.filteredOptions['substitutePlayers'].filter((option: any) => {
        return option[filterField] === this.appliedFilters[filterField];
      });
    });
  }

  applyFilter(event: Event, element: any) {
    console.log((event.target as HTMLInputElement).value);
    console.log(element);
    const filterWords = this.removeAccents((event.target as HTMLInputElement).value.trim().toLowerCase()).split(' ');
    this.filteredOptions[element] = this.options[element].filter((option: any) => {
      console.log(option);
      const optionWords = this.removeAccents(option.label.toLowerCase()).split(' ');
      const matchesSearchFilter = filterWords.every(filterWord => optionWords.some(optionWord => optionWord.startsWith(filterWord)));
      const matchesSelectFilters = Object.keys(this.appliedFilters).every(filterField => {
        return option[filterField] === this.appliedFilters[filterField];
      });
      return matchesSearchFilter && matchesSelectFilters;
    });
  }

  applyFilter2(event: MatSelectChange, filterField: string) {
    const filterValue = event.value;
    this.appliedFilters[filterField] = filterValue;
    Object.keys(this.linkedElements).forEach(element => {
      const linkedElementNames = this.linkedElements[element];
      linkedElementNames.forEach((linkedElementName: any) => {
        this.filteredOptions[linkedElementName] = this.options[linkedElementName].filter((option: any) => {
          return Object.keys(this.appliedFilters).every(filterField => {
            return option[filterField] === this.appliedFilters[filterField];
          });
        });
      });
    });
  }

  applyFilter3(event: Event, element: any) {
    console.log((event.target as HTMLInputElement).value);
    console.log(element);
    const filterWords = this.removeAccents((event.target as HTMLInputElement).value.trim().toLowerCase()).split(' ');
  
    this.filteredOptions[element] = this.options[element].map((group: any) => {
      // Filtra las opciones dentro de cada grupo
      const filteredGroup = {
        ...group,
        option: group.option.filter((option: any) => {
          console.log(option);
          const optionWords = this.removeAccents(option.label.toLowerCase()).split(' ');
          const matchesSearchFilter = filterWords.every(filterWord => optionWords.some(optionWord => optionWord.startsWith(filterWord)));
          const matchesSelectFilters = Object.keys(this.appliedFilters).every(filterField => {
            return option[filterField] === this.appliedFilters[filterField];
          });
          return matchesSearchFilter && matchesSelectFilters;
        })
      };
  
      // Solo devuelve el grupo si tiene al menos una opción después del filtrado
      return filteredGroup.option.length > 0 ? filteredGroup : null;
    }).filter((group: any) => group !== null);  // Elimina los grupos vacíos
  }

  removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  private validation(validations: any): Validators[] {
    const validators: Validators[] = [];
    if (validations.required) {
      validators.push(Validators.required);
    }
    if (validations.email) {
      validators.push(Validators.email);
    }
    return validators;
  }

  createForm(): void {


    const formsControls: { [key: string]: any } = {};
    this.definition?.forEach((step: any) => {
      step.content.forEach((element: any) => {
        if (element.element === 'list') {
          this.options[element.name] = element.options;
          this.filteredOptions[element.name] = element.options;
          this.linkedElement[element.name] = element.linkedElement;
          console.log(this.linkedElement[element.name]);
          this.originalOptions[element.name] = [...element.options];
        }
        if (element.element === 'filter') {
          this.options[element.name] = element.options;
          this.filteredOptions[element.name] = element.options;
          this.linkedElements[element.name] = element.linkedElements;
          console.log(this.linkedElements[element.name]);
          this.originalOptions[element.name] = [...element.options];
        }
        if (element.element === 'upload') {
          this.dataService.getData(element.name).subscribe((data) => {
            if (data) {
              this.form.controls[element.name].setValue(data);
            }
            this.uploadElementName = element.name;
            this.originalImageUrl = data;
          });
        }
        if (element.element === 'chip') {
          this.options[element.name] = element.options;          
          this.originalOptions[element.name] = [...element.options];
          this.filteredOptions[element.name] = element.options;
          //this.linkedElements[element.name] = element.linkedElements;
          console.log(this.filteredOptions[element.name]);
          console.log(this.options[element.name]);
          console.log(this.originalOptions[element.name]);
          console.log(this.linkedElement[element.name]);
        }
/*         if (element.element === 'autocomplete') {
          this.options[element.name] = element.options;
          this.filteredOptions[element.name] = element.options;
          //this.originalOptions[element.name] = [...element.options];
          //this.linkedElement[element.name] = element.linkedElement;
        } */

        if (element.element === 'autocomplete') {
          console.log(element.name);
          this.options[element.name] = element.options;
          this.originalOptions[element.name] = [...element.options];
          this.filteredOptions[element.name] = element.options;
          console.log(this.filteredOptions[element.name]);
          console.log(this.filteredOptions);
          //this.groupOptions[element.name] = element.options;
          
         /*  console.log(this.groupOptions[element.name]);         
          console.log(this.groupOptions);
          console.log(this.groupOptions[element.name]); */

        }
        if (element.element === 'time') {
          for(let i = 0; i < 24; i++) {
            for(let j = 0; j < 60; j+=60) {
              let hour = i + ':' + j.toString().padStart(2, '0');
              this.hours.push(hour);
            }
          }
          console.log(this.hours);
        }
        if (this.data) {
          formsControls[element.name] = [
            {
              value: this.data.itemData[element.name],
              disabled: element.disabled
            },
            [...this.validation(element.validation)]
          ];
        }
        console.log(this.filteredOptions);
      });
    });
    this.form = this.formBuilder.group(formsControls);
    this.isLoaded = true;
  }

  cancelOperation() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const result = {
        data: this.form.value,
      };
      const finalData = { ...this.form.value };
      const initialData = { ...this.initialData };
      const finalImageUrl = finalData[this.uploadElementName];
      delete finalData[this.uploadElementName];
      delete initialData[this.uploadElementName];
      if (JSON.stringify(finalData) !== JSON.stringify(initialData) || finalImageUrl !== this.originalImageUrl) {
        this.dialogRef.close(result);
      } else {
        this.dialogRef.close();
      }
      console.log(result);
    }
  }

  isPanelValid(panel: any): boolean {
    let hasRequiredFields = false;
    for (let element of panel.content) {
      if (element.required) {
        hasRequiredFields = true;
      }
      if (element.element === 'list' && !this.form.get(element.name)?.value) {
        this.panelIcon = ['info'];
        return false;
      }
      if (this.form.get(element.name)?.invalid) {
        this.panelIcon = ['error'];
        return false;
      }
    }
    this.panelIcon = hasRequiredFields ? ['check_circle'] : ['info'];
    return true;
  }


  //test
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  //filteredFruits: Observable<string[]>;
  //fruits: string[] = ['Lemon'];
  //fruits: { value: number, viewValue: string }[] = [];
  fruits: { [key: string]: { value: number, label: string }[] } = {};
  allFruits: string[] = ['82 Luis Alberto Jiménez Sánchez', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  //@ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    console.log(event);
    const value = (event.value || '').trim();
    console.log(value);
    const number = parseInt(value.split(' ')[0]);
    console.log(number);
/*     if (number && !this.fruits.map(fruit => fruit.value).includes(number)) {
      console.log('okay');
      this.fruits.push({ value: number, viewValue: value });
    }   */    
    console.log(this.fruits);
    event.chipInput!.clear();
    console.log(this.fruitCtrl);
    this.fruitCtrl.setValue(null);
  }
  
/*   remove(fruit: { value: number; viewValue: string }): void {
    console.log(fruit);
    const index = this.fruits.findIndex(f => f.value === fruit.value);
  
    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.announcer.announce(`Removed ${fruit.value}`);
    }
    console.log(this.fruits);
  } */

  remove(fruit: { value: number; label: string}, element: any): void {
    console.log(fruit);
  
    // Verifica si la lista correspondiente existe en fruits
    if (this.fruits[element]) {
      console.log(this.fruits[element]);
      const index = this.fruits[element].findIndex(f => f.value === fruit.value);
    
      if (index >= 0) {
        this.fruits[element].splice(index, 1);
        this.announcer.announce(`Removed ${fruit.value}`);
      }
    }
  
    console.log(this.fruits);
  }
  
/*   selected(event: MatAutocompleteSelectedEvent, element: any): void {
    const fruit = { value: event.option.value, viewValue: event.option.viewValue };
    console.log(fruit);
    if (!this.fruits.map(f => f.value).includes(fruit.value)) {
      this.fruits.push(fruit);
      console.log(this.fruits);
    }
    this.fruitCtrl.setValue(JSON.stringify(this.fruits.map(f => f.value)));
    console.log(this.fruitCtrl.value);
    //this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.reset();

  } */

  selected(event: MatAutocompleteSelectedEvent, element: any): void {
    console.log(element);
    const fruit = { value: event.option.value, label: event.option.viewValue};
    console.log(fruit);
  
    // Verifica si la lista correspondiente existe en fruits, si no, la inicializa
    if (!this.fruits[element]) {
      this.fruits[element] = [];
      console.log(this.fruits);
    } 
  
    // Verifica si el elemento ya existe en la lista correspondiente
    if (!this.fruits[element].map(f => f.value).includes(fruit.value)) {
      this.fruits[element].push(fruit);
      console.log(this.fruits);

/*       const index = this.filteredOptions[element].findIndex(f => f.value === fruit.value);
      console.log(index);
      if (index >= 0) {
         //const index = this.fruits[element].findIndex(f => f.value === fruit.value);
        this.filteredOptions[element].splice(index, 1);
        console.log(this.fruits);
      } */
    }
  
    this.fruitCtrl.setValue(JSON.stringify(this.fruits[element].map(f => f.value)));
    console.log(this.fruitCtrl.value);
  
    //this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.reset();


    /* const selectedOption = event.option.value;
    const selectedLabelWithNumber = this.filteredOptions[element].find((option: any) => option.value === selectedOption).label;
    this.selectedLabel = selectedLabelWithNumber.split(' ').slice(1).join(' ');
    this.form.get(this.linkedElement[element])?.setValue(this.selectedLabel);
    //const isSelected = event.options.some((option: any) => option.value === selectedOption);
    if (event.option.selected) {
      if (element === 'titularPlayers') {
        this.filteredOptions['substitutePlayers'] = this.filteredOptions['substitutePlayers'].filter((option: any) => option.value !== selectedOption);
      } else if (element === 'substitutePlayers') {
        this.filteredOptions['titularPlayers'] = this.filteredOptions['titularPlayers'].filter((option: any) => option.value !== selectedOption);
      }
    } else {
      this.filteredOptions['titularPlayers'] = [...this.originalOptions['titularPlayers']];
      this.filteredOptions['substitutePlayers'] = [...this.originalOptions['substitutePlayers']];
    }
    Object.keys(this.appliedFilters).forEach(filterField => {
      this.filteredOptions['titularPlayers'] = this.filteredOptions['titularPlayers'].filter((option: any) => {
        return option[filterField] === this.appliedFilters[filterField];
      });
      this.filteredOptions['substitutePlayers'] = this.filteredOptions['substitutePlayers'].filter((option: any) => {
        return option[filterField] === this.appliedFilters[filterField];
      });
    }); */
  }
  
/*   filter(event: Event, element: any): string[] {
    const filterValue = value.toLowerCase();
    return this.options[element.name].filter((option: any) => option.toLowerCase().includes(filterValue));
  } */
  
  private _filter(value: string, element: any): string[] {
    const filterValue = value.toLowerCase();
    return this.originalOptions[element.name].filter(option => option.toLowerCase().includes(filterValue));
  }

  //test autocomplete
  stateCtrl = new FormControl('');
  filteredStates!: Observable<State[]>;

  states: State[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg',
    },
    {
      name: 'California',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg',
    },
    {
      name: 'Florida',
      population: '20.27M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    },
    {
      name: 'Texas',
      population: '27.47M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg',
    },
  ];



  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.name.toLowerCase().includes(filterValue));
  }

/*   displayFn(option: any): string {
    return option ? option.label : '';
  } */

  displayFn(value: any): string {
    return value ? value.label : '';
  }
}
