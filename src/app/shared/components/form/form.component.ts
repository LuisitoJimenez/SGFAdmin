import { Component, Inject, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DefinitionModel } from 'src/app/models/definition';


interface User {
  value: number;
  label: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  definition: DefinitionModel[];
  userId: number;
  form: FormGroup = new FormGroup({});
  isLoaded: boolean = false;
  initialData: any;
  itemData: any;
  operation: string = '';
  options: any[] = [];
  filteredOptions: any[] = [];
  selectedOption: any;
  selectedLabel: string = '';
  linkedElement: string = '';

  @ViewChildren('optionElement') optionElements!: QueryList<ElementRef>;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public formData: any
  ) {
    this.definition = formData.definition;
    this.userId = formData.userId;
    this.operation = formData.operation;
    this.itemData = formData.data;
  }

  ngOnInit(): void {
    this.createForm();
    if (this.userId) {
      this.initialData = this.form.value;
    }
  }

  ngAfterViewInit() {
    this.optionElements.changes.subscribe(() => {
      const selectedOptionElement = this.optionElements.find((optionElement, index) => this.filteredOptions[index].value === this.form.get('names')?.value);
      if (selectedOptionElement) {
        selectedOptionElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    });
  }

  onSelectionChange(event: any) {
    const selectedOption = event.options[0].value;
    const selectedLabelWithNumber = this.filteredOptions.find(option => option.value === selectedOption).label;
    this.selectedLabel = selectedLabelWithNumber.split(' ').slice(1).join(' '); // Elimina el número
    this.form.get(this.linkedElement)?.setValue(this.selectedLabel);
  }

  applyFilter(event: Event) {
    const filterWords = this.removeAccents((event.target as HTMLInputElement).value.trim().toLowerCase()).split(' ');
    this.filteredOptions = this.options.filter((option: any) => {
      const optionWords = this.removeAccents(option.label.toLowerCase()).split(' ');
      return filterWords.every(filterWord => optionWords.some(optionWord => optionWord.startsWith(filterWord)));
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
    this.definition?.forEach((element: any) => {
      if (element.element === 'list') {
        this.options = element.options;
        this.filteredOptions = [...this.options];
        this.linkedElement = element.linkedElement;
      }
      if (this.formData.itemData) {
        formsControls[element.name] = [
          {
            value: this.formData.itemData[element.name],
            disabled: element.disabled
          },
          this.validation(element.validation)
        ];
      }
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
      if (JSON.stringify(this.form.value) !== JSON.stringify(this.initialData) && !this.userId) {
        this.dialogRef.close(result);
      } else if (JSON.stringify(this.form.value) !== JSON.stringify(this.initialData) && this.userId) {
        this.dialogRef.close(result);
      } else {
        this.dialogRef.close();
      }
    }
  }

}



