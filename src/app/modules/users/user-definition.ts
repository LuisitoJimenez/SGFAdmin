import { DefinitionAccordion } from "src/app/models/definition";
import { FormElement } from "src/app/models/enum";

export const userFormDefinition: DefinitionAccordion[] = [
  {
    btnNextLabel: 'Siguiente',
    btnNextHidden: true,
    content: [
      {
        name: 'id',
        label: 'ID',
        element: FormElement.input,
        hidden: false,
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
        name: 'first',
        label: 'Nombre',
        placeholder: 'Nombre',
        element: FormElement.input,
        colClass: 'col-sm-9',
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
        name: 'last',
        label: 'Primer apellido',
        placeholder: 'Primer apellido',
        element: FormElement.input,
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
        name: 'secondLast',
        label: ' Segundo apellido',
        placeholder: 'Segundo apellido',
        element: FormElement.input,
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
        name: 'email',
        label: 'Correo electrónico',
        placeholder: 'Correo electrónico',
        element: FormElement.input,
        colClass: 'col-sm-6',
        disabled: false,
        hidden: false,
        readonly: false,
        value: '',
        validation: {
          required: true,
          email: true
        },
        validationMsg: 'Debe ser un correo electrónico'
      },
      {
        name: 'phone',
        label: 'Teléfono',
        placeholder: 'Teléfono',
        element: FormElement.input,
        hidden: false,
        readonly: false,
        colClass: 'col-sm-6',
        disabled: false,
        value: '',
        validation: {
          required: true
        },
        validationMsg: 'Requerido'
      },
      {
        name: 'password',
        label: 'Contraseña',
        placeholder: 'Contraseña',
        element: FormElement.input,
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
    ],
    panelTitle: 'Datos del jugador',
    panelDescription: 'Completa los datos del jugador',
    panelIcon: 'check_circle',
    step: 0,
    hidden: false,
    disabled: false
  },
];
