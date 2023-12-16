import { DataService } from './../../../services/data.service';
import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Observable, map, startWith } from 'rxjs';
import { DefinitionAccordion } from 'src/app/models/definition';

//test
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';

//test autocomplete
export interface State {
  flag: string;
  name: string;
  population: string;
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

    //test
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );

    //test autocomplete
    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.states.slice())),
    );
  }

  setStep(index: number) {
    this.openStep = index;
  }

  nextStep() {
    this.openStep++;
  }

  prevStep() {
    this.openStep--;
  }

  ngOnInit(): void {
    this.createForm();
    if (this.userId) {
      this.initialData = this.form.value;
    }
    this.imageUrl2 = this.data.itemData.imagePlayer;
    this.initialDataClone = JSON.parse(JSON.stringify(this.initialData));
  }

  onSelectionChange(event: any, element: any) {
    const selectedOption = event.options[0].value;
    const selectedLabelWithNumber = this.filteredOptions[element].find((option: any) => option.value === selectedOption).label;
    this.selectedLabel = selectedLabelWithNumber.split(' ').slice(1).join(' ');
    this.form.get(this.linkedElement[element])?.setValue(this.selectedLabel);
    const isSelected = event.options.some((option: any) => option.value === selectedOption);
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
    const filterWords = this.removeAccents((event.target as HTMLInputElement).value.trim().toLowerCase()).split(' ');
    this.filteredOptions[element] = this.options[element].filter((option: any) => {
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
        if (this.data) {
          formsControls[element.name] = [
            {
              value: this.data.itemData[element.name],
              disabled: element.disabled
            },
            [...this.validation(element.validation)]
          ];
        }
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
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
    console.log(event.option.viewValue);
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  //test autocomplete
  stateCtrl = new FormControl('');
  filteredStates: Observable<State[]>;

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

}
