export interface IOptions {
  form?: {
    onSubmit?: (e: React.SyntheticEvent<HTMLFormElement>) => void | Promise<unknown>,
  },
  fields: {
    [field: string]: {
      value?: string,
      rules: ((value: string) => void)[],
      onSuccess?: (value: string) => void | Promise<unknown>,
      onError?: (message: string) =>  void | Promise<unknown>,
    },
  },
}

export interface IFormValidationResult {
  form: {
    noValidate: true,
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void,
  },
  fields: InputProps,
  resetFields: () => void,
  manuallySetField: (fieldName: string, value: string) => void,
}

export type InputProps = {
  [field: string]: {
    input: {
      onChange: any,
      value: (e: React.ChangeEvent<HTMLInputElement>) => void,
    },
    info: Status,
  },
}

export type State = {
  values: {
    [field: string]: string,
  },
  statuses: {
    [field: string]: Status,
  },
}

export type Status = {
  status: 'standard' | 'success' | 'error',
  message?: string,
}

export type Action = {
  type: string,
  field?: string,
  payload?: any,
}
