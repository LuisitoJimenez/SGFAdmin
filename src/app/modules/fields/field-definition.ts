import { DefinitionAccordion } from "src/app/models/definition";
import { ElementType, FormElement } from "src/app/models/enum";

export const fieldFormDefinition: DefinitionAccordion[] = [
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
            colClass: 'col-sm-9',
            element: FormElement.input,
            disabled: false,
            hidden: false,
            label: 'Nombre',
            name: 'name',
            type: ElementType.text,
            placeholder: 'Nombre',
            readonly: false,
            validation: {
              required: true
            },
            validationMsg: 'Requerido',
            value: ''
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
          },
          {
            name: 'street',
            label: 'Calle',
            placeholder: 'Calle',
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
          },
          {
            name: 'municipality',
            label: 'Municipio',
            placeholder: 'Municipio',
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
          },
          {
            name: 'postalCode',
            label: 'Código postal',
            placeholder: 'Código postal',
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
          },
          {
            name: 'capacity',
            label: 'Capacidad',
            placeholder: 'Capacidad',
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
        panelTitle: 'Datos de la cancha',
        panelDescription: 'Completa los datos de la cancha',
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
            label: 'Cargar una foto',
            name: 'imageField',
            readonly: false,
            validation: {
              required: true
            },
          }
        ],
        panelTitle: 'Foto',
        panelDescription: 'Cargar foto de la cancha',
        panelIcon: 'check_circle',
        step: 1,
        hidden: false,
        disabled: false
      }

]