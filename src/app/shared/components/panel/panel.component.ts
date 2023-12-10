import { DataService } from './../../../services/data.service';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DefinitionAccordion } from 'src/app/models/definition';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {

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

  originalOptions: { [key: string]: any[] } = {};

  onSelectionChange(event: any, element: any) {
    const selectedOption = event.options[0].value;
    const selectedLabelWithNumber = this.filteredOptions[element].find((option: any) => option.value === selectedOption).label;
    this.selectedLabel = selectedLabelWithNumber.split(' ').slice(1).join(' ');
    this.form.get(this.linkedElement[element])?.setValue(this.selectedLabel);
    const isSelected = event.options.some((option: any) => option.value === selectedOption);
    if (event.options[0].selected) {
      if (element === 'titularPlayers') {
        this.filteredOptions['substitutePlayers'] = this.filteredOptions['substitutePlayers'].filter((option: any) => option.value !== selectedOption);
      }
      else if (element === 'substitutePlayers') {
        this.filteredOptions['titularPlayers'] = this.filteredOptions['titularPlayers'].filter((option: any) => option.value !== selectedOption);
      }
    }
    else {
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

/*   onSelectionChange(event: any, element: any) {
    const selectedOption = event.options[0].value;
    const selectedLabelWithNumber = this.filteredOptions[element].find((option: any) => option.value === selectedOption).label;
    this.selectedLabel = selectedLabelWithNumber.split(' ').slice(1).join(' ');
    this.form.get(this.linkedElement[element])?.setValue(this.selectedLabel);
    const isSelected = event.options.some((option: any) => option.value === selectedOption);
    if (event.options[0].selected) {
      if (element === 'titularPlayers') {
        this.filteredOptions['substitutePlayers'] = this.filteredOptions['substitutePlayers'].filter((option: any) => option.value !== selectedOption);
      }
      else if (element === 'substitutePlayers') {
        this.filteredOptions['titularPlayers'] = this.filteredOptions['titularPlayers'].filter((option: any) => option.value !== selectedOption);
      }
    }
    else {
      if (element === 'titularPlayers') {
        this.filteredOptions['substitutePlayers'] = this.originalOptions['substitutePlayers'].filter((option: any) => {
          return this.form.get('substitutePlayers')?.value?.includes(option.value) || !this.form.get('titularPlayers')?.value?.includes(option.value);
        });
      } else if (element === 'substitutePlayers') {
        this.filteredOptions['titularPlayers'] = this.originalOptions['titularPlayers'].filter((option: any) => {
          return this.form.get('titularPlayers')?.value?.includes(option.value) || !this.form.get('substitutePlayers')?.value?.includes(option.value);
        });
      }
    }

    // Aplica los filtros de los select
    Object.keys(this.appliedFilters).forEach(filterField => {
      this.filteredOptions[element] = this.filteredOptions[element].filter((option: any) => {
        return option[filterField] === this.appliedFilters[filterField];
      });
    });
  } */

/*   onSelectionChange(event: any, element: any) {
    const selectedOption = event.options[0].value;
    const selectedLabelWithNumber = this.filteredOptions[element].find((option: any) => option.value === selectedOption).label;
    this.selectedLabel = selectedLabelWithNumber.split(' ').slice(1).join(' ');
    this.form.get(this.linkedElement[element])?.setValue(this.selectedLabel);
    const isSelected = event.options.some((option: any) => option.value === selectedOption);
    if (event.options[0].selected) {
      if (element === 'titularPlayers') {
        this.filteredOptions['substitutePlayers'] = this.filteredOptions['substitutePlayers'].filter((option: any) => option.value !== selectedOption);
      }
      else if (element === 'substitutePlayers') {
        this.filteredOptions['titularPlayers'] = this.filteredOptions['titularPlayers'].filter((option: any) => option.value !== selectedOption);
      }
    }
    else {
      if (element === 'titularPlayers') {
        this.filteredOptions['substitutePlayers'] = this.originalOptions['substitutePlayers'].filter((option: any) => {
          return this.form.get('substitutePlayers')?.value?.includes(option.value) || !this.form.get('titularPlayers')?.value?.includes(option.value);
        });
      } else if (element === 'substitutePlayers') {
        this.filteredOptions['titularPlayers'] = this.originalOptions['titularPlayers'].filter((option: any) => {
          return this.form.get('titularPlayers')?.value?.includes(option.value) || !this.form.get('substitutePlayers')?.value?.includes(option.value);
        });
      }
    }
  } */

  applyFilter(event: Event, element: any) {
    const filterWords = this.removeAccents((event.target as HTMLInputElement).value.trim().toLowerCase()).split(' ');

    this.filteredOptions[element] = this.options[element].filter((option: any) => {
      // Aplica el filtro de búsqueda
      const optionWords = this.removeAccents(option.label.toLowerCase()).split(' ');
      const matchesSearchFilter = filterWords.every(filterWord => optionWords.some(optionWord => optionWord.startsWith(filterWord)));

      // Aplica los filtros de los select
      const matchesSelectFilters = Object.keys(this.appliedFilters).every(filterField => {
        return option[filterField] === this.appliedFilters[filterField];
      });

      return matchesSearchFilter && matchesSelectFilters;
    });
  }

/*   applyFilter(event: Event, element: any) {
    console.log(event);
    console.log(element);
    const filterWords = this.removeAccents((event.target as HTMLInputElement).value.trim().toLowerCase()).split(' ');
    this.filteredOptions[element] = this.options[element].filter((option: any) => {
      const optionWords = this.removeAccents(option.label.toLowerCase()).split(' ');
      return filterWords.every(filterWord => optionWords.some(optionWord => optionWord.startsWith(filterWord)));
    });
  } */

  appliedFilters: { [key: string]: any } = {};

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

/*   applyFilter2(event: MatSelectChange, filterField: string) {
    const filterValue = event.value;
    Object.keys(this.linkedElements).forEach(element => {
      const linkedElementNames = this.linkedElements[element];
      linkedElementNames.forEach((linkedElementName: any) => {
        this.filteredOptions[linkedElementName] = this.options[linkedElementName].filter((option: any) => {
          return option[filterField] === filterValue;
        });
        console.log(this.filteredOptions[linkedElementName]);
      });
    });
  } */

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

}
