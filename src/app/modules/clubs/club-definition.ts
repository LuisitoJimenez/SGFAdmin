import { ElementType, FormElement } from "src/app/models/enum";
import { DefinitionAccordion } from './../../models/definition';

export const clubFormDefinition: DefinitionAccordion[] = [
  {
    btnNextLabel: 'Siguiente',
    content: [
      {
        name: 'id',
        label: 'ID',
        element: FormElement.input,
        hidden: true,
        colClass: 'col-sm-3',
        disabled: true,
        readonly: false,
        value: '',
        validation: {
          required: false
        },
        validationMsg: 'Required'
      },
      {
        name: 'name',
        label: 'Nombre',
        placeholder: 'Nombre',
        element: FormElement.input,
        hidden: true,
        type: ElementType.text,
        colClass: 'col-sm-9',
        disabled: false,
        readonly: false,
        value: '',
        validation: {
          required: true
        },
        validationMsg: 'First name is required',
      },
      {
        name: 'email',
        label: 'Correo electrónico',
        placeholder: 'Correo electrónico',
        element: FormElement.input,
        hidden: true,
        readonly: false,
        colClass: 'col-sm-6',
        disabled: false,
        value: '',
        validation: {
          required: true,
          email: true
        },
        validationMsg: 'Este campo debe ser un correo electrónico'
      },
      {
        name: 'phone',
        label: 'Teléfono',
        placeholder: 'Teléfono',
        element: FormElement.input,
        hidden: true,
        readonly: false,
        colClass: 'col-sm-6',
        disabled: false,
        value: '',
        validation: {
          required: true
        },
        validationMsg: 'Este campo es requerido'
      },
      {
        name: 'facebook',
        label: 'Facebook',
        placeholder: 'Facebook',
        element: FormElement.input,
        hidden: true,
        readonly: true,
        type: ElementType.text,
        colClass: 'col-sm-6',
        disabled: false,
        value: '',
        validation: {
          required: false
        },
        validationMsg: 'First name is required',
      },
      {
        name: 'twitter',
        label: 'Twitter',
        placeholder: 'Twitter',
        element: FormElement.input,
        hidden: true,
        type: ElementType.text,
        colClass: 'col-sm-6',
        disabled: false,
        readonly: false,
        value: '',
        validation: {
          required: false
        },
        validationMsg: 'First name is required',
      },
      {
        name: 'instagram',
        label: 'Instagram',
        placeholder: 'Instagram',
        element: FormElement.input,
        hidden: true,
        type: ElementType.text,
        colClass: 'col-sm-6',
        disabled: false,
        readonly: false,
        value: '',
        validation: {
          required: false
        },
        validationMsg: 'First name is required',
      },
      {
        name: 'youtube',
        label: 'Youtube',
        placeholder: 'Youtube',
        element: FormElement.input,
        hidden: true,
        type: ElementType.text,
        colClass: 'col-sm-6',
        disabled: false,
        readonly: false,
        value: '',
        validation: {
          required: false
        },
        validationMsg: 'First name is required',
      },
      {
        name: 'tiktok',
        label: 'TikTok',
        placeholder: 'TikTok',
        element: FormElement.input,
        hidden: true,
        type: ElementType.text,
        colClass: 'col-sm-6',
        disabled: false,
        readonly: false,
        value: '',
        validation: {
          required: false
        },
        validationMsg: 'First name is required',
      },
      {
        name: 'website',
        label: 'Sitio web',
        placeholder: 'Sitio web',
        element: FormElement.input,
        hidden: true,
        type: ElementType.text,
        colClass: 'col-sm-6',
        disabled: false,
        readonly: false,
        value: '',
        validation: {
          required: false
        },
        validationMsg: 'First name is required',
      }
    ],
    panelTitle: 'Datos del club',
    panelDescription: 'Completa los datos del club',
    panelIcon: 'check_circle',
    step: 0,
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
        label: 'Cargar una imagen',
        name: 'imageClub',
        readonly: false,
        validation: {
          required: true
        },
      }
    ],
    panelTitle: 'Imagen',
    panelDescription: 'Cargar foto del club',
    panelIcon: 'check_circle',
    step: 1,
    hidden: false,
    disabled: false
  }
];
