import { DefinitionAccordion } from "src/app/models/definition";
import { ElementType, FormElement } from "src/app/models/enum";

export const gameFormDefinition: DefinitionAccordion[] = [
  {
    btnNextLabel: 'Siguiente',
    btnPrevDisabled: false,
    btnNextDisabled: false,
    content: [
      {
        name: 'id',
        label: 'ID',
        element: FormElement.input,
        hidden: true,
        colClass: 'col-sm-3',
        disabled: true,
        readonly: true,
        value: '',
        validation: {
          required: false
        },
        validationMsg: 'Requerido'
      },
      {
        colClass: 'col-sm-9',
        element: FormElement.input,
        disabled: false,
        hidden: false,
        label: 'Partido',
        name: 'game',
        type: ElementType.text,
        placeholder: 'Partido',
        readonly: false,
        validation: {
          required: true
        },
        validationMsg: 'El club es requerido',
        value: ''
      },
      {
        name: 'gender',
        label: 'Género',
        placeholder: 'Género',
        element: FormElement.select,
        colClass: 'col-sm-6',
        disabled: false,
        hidden: false,
        readonly: false,
        options: [],
        value: '',
        validation: {
          required: true
        },
        validationMsg: 'Requerido'
      },
      {
        name: 'subs',
        label: 'SUB',
        placeholder: 'SUB',
        element: FormElement.select,
        colClass: 'col-sm-6',
        disabled: false,
        hidden: false,
        readonly: false,
        options: [],
        value: '',
        validation: {
          required: true
        },
        validationMsg: 'Requerido'
      },
    ],
    panelTitle: 'Datos del partido',
    panelDescription: 'Completa los datos del partido',
    panelIcon: 'info',
    step: 0,
    hidden: false,
    disabled: false
  },
  {
    btnNextLabel: 'Siguiente',
    btnPrevLabel: 'Anterior',
    btnPrevDisabled: false,
    btnNextDisabled: false,
    content: [
      {
        colClass: 'col-sm-12',
        element: FormElement.list,
        disabled: false,
        hidden: false,
        label: '',
        options: [],
        multiple: false,
        name: 'clubOne',
        readonly: false,
        validation: {
          required: false
        },
      }
    ],
    panelTitle: 'Equipo oponente 1',
    panelDescription: 'Selecciona un equipo contrincante',
    panelIcon: 'info',
    step: 1,
    hidden: false,
    disabled: false
  },
  {
    btnNextHidden: true,
    btnPrevLabel: 'Anterior',
    btnPrevDisabled: false,
    btnNextDisabled: false,
    content: [
      {
        colClass: 'col-sm-12',
        element: FormElement.list,
        disabled: false,
        hidden: false,
        label: '',
        options: [],
        multiple: false,
        name: 'clubTwo',
        readonly: false,
        validation: {
          required: false
        },
      }
    ],
    panelTitle: 'Equipo oponente 2',
    panelDescription: 'Selecciona un equipo',
    panelIcon: 'info',
    step: 2,
    hidden: false,
    disabled: false
  }
];
