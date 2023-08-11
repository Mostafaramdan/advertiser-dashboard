export interface FormInputProps {
  modelValue: any
  name: string
  rules?: string
  hideDefaultLabel?: boolean
}

export interface FormRadioProps {
  name: string
  label: string
  modelValue: any
  options: any[]
  optionLabel: string
  optionValue: string
  rules?: string
  hideLabel?: boolean
}

export interface FormCheckboxProps {
  name: string
  label: string
  modelValue: any
  options: any[]
  optionLabel: string
  optionValue: string
  rules?: string
  hideLabel?: boolean
}

export interface FormFileProps {
  modelValue: any
  name: string
  label: string
  rules: string
  hideLabel?: boolean
  acceptedTypes?: string[]
  maxFileSize?: number
  uploadTip?: string
  width?: string
  height?: string
}

export interface FormSwitchProps {
  modelValue: any
  name: string
  label: string
  rules?: string
  hideLabel?: boolean
}

export type FormActionType = 'create' | 'edit' | 'delete' | 'view'

export interface FormModalProps {
  showModal: boolean
  activeItem: any
  formAction?: FormActionType
}
