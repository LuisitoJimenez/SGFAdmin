import { DefinitionAccordion } from "src/app/models/definition";
import { ElementType, FormElement } from 'src/app/models/enum';

export const teamFormDefinition: DefinitionAccordion[] = [
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
        name: 'clubs',
        readonly: false,
        linkedElement: 'club',
        validation: {
          required: false
        },
      }
    ],
    panelTitle: 'Clubs',
    panelDescription: 'Selecciona un club',
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
        label: 'Nombre del equipo',
        name: 'name',
        type: ElementType.text,
        placeholder: 'Nombre',
        readonly: false,
        validation: {
          required: true
        },
        validationMsg: 'El nombre es requerido',
        value: ''
      },
      {
        colClass: 'col-sm-',
        element: FormElement.input,
        disabled: false,
        hidden: false,
        label: 'Director técnico',
        name: 'coach',
        type: ElementType.text,
        placeholder: 'Nombre',
        readonly: false,
        validation: {
          required: true
        },
        validationMsg: 'El nombre es requerido',
        value: ''
      },
      {
        colClass: 'col-sm-6',
        element: FormElement.input,
        disabled: false,
        hidden: false,
        label: 'Club',
        name: 'club',
        type: ElementType.text,
        placeholder: 'Club',
        readonly: true,
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
        element: FormElement.filter,
        colClass: 'col-sm-6',
        disabled: false,
        hidden: false,
        readonly: false,
        linkedElements: ['titularPlayers', 'substitutePlayers'],
        options: [],
        value: '',
        validation: {
          required: true
        },
        validationMsg: 'Requerido'
      },
      {
        name: 'sub',
        label: 'SUB',
        placeholder: 'SUB',
        element: FormElement.filter,
        colClass: 'col-sm-6',
        disabled: false,
        hidden: false,
        readonly: false,
        linkedElements: ['titularPlayers', 'substitutePlayers'],
        options: [],
        value: '',
        validation: {
          required: true
        },
        validationMsg: 'Requerido'
      },
      
    ],
    panelTitle: 'Datos del equipo',
    panelDescription: 'Completa los datos del equipo',
    panelIcon: 'check_circle',
    step: 1,
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
        element: FormElement.chip,
        disabled: false,
        hidden: false,
        label: 'Jugador titular',
        options: [],
        multiple: true,
        name: 'titularPlayers',
        readonly: false,
        validation: {
          required: true
        },
      }
    ],
    panelTitle: 'Jugadores titulares',
    panelDescription: 'Selecciona los jugadores titulares',
    panelIcon: 'check_circle',
    step: 2,
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
        element: FormElement.chip,
        disabled: false,
        hidden: false,
        label: 'Jugador suplente',
        options: [],
        multiple: true,
        name: 'substitutePlayers',
        readonly: false,
        validation: {
          required: true
        },
      }
    ],
    panelTitle: 'Jugadores suplentes',
    panelDescription: 'Selecciona los jugadores suplentes',
    panelIcon: 'check_circle',
    step: 3,
    hidden: false,
    disabled: false
  }/* ,
  {
    btnNextHidden: true,
    btnPrevLabel: 'Anterior',
    btnPrevDisabled: false,
    btnNextDisabled: false,
    content: [
      {
        colClass: 'col-sm-12',
        element: FormElement.chip,
        disabled: false,
        hidden: false,
        label: 'Jugadores titulares',
        options: [],
        multiple: true,
        name: 'team1',
        readonly: false,
        validation: {
          required: true
        },
      }
    ],
    panelTitle: 'Jugadores suplentes',
    panelDescription: 'Selecciona los jugadores suplentes',
    panelIcon: 'check_circle',
    step: 4,
    hidden: false,
    disabled: false
  } */
];
