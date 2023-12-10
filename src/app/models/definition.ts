import { FormControl } from "@angular/forms";
import { ElementType, FormElement } from "./enum";

export interface DefinitionModel {
  name: string;
  label: string;
  placeholder?: string;
  element: 'input' | 'select' | 'picker' | 'list';
  value: '';
  disabled: boolean;
  multiple?: boolean;
  readonly?: boolean;
  colClass: string;
  hidden?: boolean;
  linkedElement?: string;
  type?: "text" | "number" | "password" | "email" | "date" | "time" | "datetime-local" | "month" | "week" | "url" | "tel" | "color" | "file" | "range" | "search" | "textarea" | "select" | "picker" | "list";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  validation: validationElement;
  validationMsg: string;
  options?: optionsElement[];
  searchControl?: FormControl;
}

export interface validationElement {
  required: boolean;
  email?: boolean;
  password?: boolean;
}

export interface optionsElement {
  label: string;
  value: any;
  checked?: boolean;
  select?: boolean;
}

export interface DefinitionAccordion {
  btnNextLabel?: string;
  btnPrevLabel?: string;
  btnPrevDisabled?: boolean,
  btnNextDisabled?: boolean,
  btnPrevHidden?: boolean;
  btnNextHidden?: boolean;
  content: DefinitionForm[];
  disabled: boolean;
  hidden: boolean;
  panelTitle: string;
  panelDescription: string;
  panelIcon: string;
  step: number;
}

export interface DefinitionForm {
  colClass: string;
  disabled: boolean;
  element: FormElement;
  hidden: boolean;
  label?: string;
  linkedElement?: string;
  linkedElements?: string[];
  multiple?: boolean;
  min?: number;
  max?: number;
  name: string;
  options?: Options[];
  placeholder?: string;
  readonly: boolean;
  step?: number;
  type?: ElementType;
  unit?: string;
  validation: ElementValidation;
  validationMsg?: string;
  value?: any;
}

export interface Options {
  label: string,
  value: any,
}

export interface ElementValidation {
  required: boolean;
  email?: boolean;
  password?: boolean;
}

export interface OptionsElement {
  label: string;
  value: any;
  checked?: boolean;
  select?: boolean;
}
