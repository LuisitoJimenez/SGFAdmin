import { DefinitionAccordion } from "src/app/models/definition";
import { ElementType, FormElement } from "src/app/models/enum";

export const playerDefinition: DefinitionAccordion[] = [
  {
    btnNextLabel: 'Siguiente',
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
        name: 'users',
        readonly: false,
        linkedElement: 'name',
        validation: {
          required: false
        },
      }
    ],
    panelTitle: 'Usuarios',
    panelDescription: 'Selecciona un usuario',
    panelIcon: 'check_circle',
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
        label: 'Nombre',
        name: 'name',
        type: ElementType.text,
        placeholder: 'Nombre',
        readonly: true,
        validation: {
          required: true
        },
        validationMsg: 'Requerido',
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
        name: 'birthday',
        label: ' Fecha de nacimiento',
        element: FormElement.picker,
        colClass: 'col-sm-6',
        disabled: false,
        hidden: false,
        readonly: false,
        value: '',
        validation: {
          required: true
        },
        validationMsg: 'Requerido'
      },
      {
        name: 'height',
        label: 'Altura',
        placeholder: 'Altura',
        element: FormElement.input,
        colClass: 'col-sm-3',
        disabled: false,
        options: [],
        value: '',
        hidden: false,
        readonly: false,
        step: 0.01,
        type: ElementType.number,
        unit: 'm',
        min: 1,
        max: 2,
        validation: {
          required: true
        },
        validationMsg: 'Requerido'
      },
      {
        name: 'weight',
        label: 'Peso',
        placeholder: 'Peso',
        element: FormElement.input,
        colClass: 'col-sm-3',
        disabled: false,
        options: [],
        value: '',
        hidden: false,
        readonly: false,
        step: 0.1,
        unit: 'kg',
        type: ElementType.number,
        min: 1,
        max: 200,
        validation: {
          required: true
        },
        validationMsg: 'Requerido'
      },
      {
        name: 'state',
        label: 'Estado',
        placeholder: 'Estado',
        element: FormElement.select,
        hidden: false,
        readonly: false,
        colClass: 'col-sm-6',
        disabled: false,
        options: [],
        value: '',
        validation: {
          required: true
        },
        validationMsg: 'Requerido'
      },
      {
        name: 'town',
        label: 'Localidad',
        placeholder: 'Localidad',
        element: FormElement.input,
        hidden: false,
        readonly: false,
        colClass: 'col-sm-6',
        disabled: false,
        options: [],
        value: '',
        validation: {
          required: true
        },
        validationMsg: 'Requerido'
      }
    ],
    panelTitle: 'Datos del jugador',
    panelDescription: 'Completa los datos del jugador',
    panelIcon: 'check_circle',
    step: 1,
    hidden: false,
    disabled: false
  },
  {
    btnPrevLabel: 'Anterior',
    btnNextHidden: true,
    btnPrevDisabled: false,
    btnNextDisabled: false,
    content: [
      {
        colClass: 'col-sm-12',
        element: FormElement.upload,
        disabled: false,
        hidden: false,
        label: 'Cargar una foto',
        name: 'imagePlayer',
        readonly: false,
        validation: {
          required: true
        },
      }
    ],
    panelTitle: 'Foto',
    panelDescription: 'Cargar foto del jugador',
    panelIcon: 'check_circle',
    step: 2,
    hidden: false,
    disabled: false
  }
];
