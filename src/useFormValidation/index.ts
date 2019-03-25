// @flow
import {useReducer} from 'react'
import { CHANGE_VALUE, VALIDATE_FIELD, RESET_FIELDS } from './actions'

interface IOptions {
  form?: {
    onSubmit?: (e: React.SyntheticEvent<HTMLFormElement>) => void | Promise<unknown>,
  },
  fields: {
    [field: string]: {
      value?: string,
      rules: ((value: string) => void)[],
    },
  },
}

interface IFormValidationResult {
  form: {
    noValidate: true,
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void,
  },
  fields: InputProps,
  resetFields: () => void,
  manuallySetField: (fieldName: string, value: string) => void,
}

type InputProps = {
  [field: string]: {
    input: {
      onChange: any,
      value: (e: React.ChangeEvent<HTMLInputElement>) => void,
    },
    info: Status,
  },
}

type State = {
  values: {
    [field: string]: string,
  },
  statuses: {
    [field: string]: Status,
  },
}

type Status = {
  status: 'standard' | 'success' | 'error',
  message?: string,
}

type Action = {
  type: string,
  field?: string,
  payload?: any,
}

function resetAllFields(state: State): State {
  return Object.keys(state.values).reduce<State>((acum: State, fieldName: string) => {
    acum.values[fieldName] = ''
    acum.statuses[fieldName] = {
      status: "standard"
    }
    return acum
  }, {
    values: {}, statuses: {}
  })
}

function reducer(state: State, {type, field, payload}: Action): State  {
  switch (type) {
    case CHANGE_VALUE:
      return {...state, values: {...state.values, [field!]: payload}}
    case VALIDATE_FIELD:
      return {...state, statuses: {...state.statuses, [field!]: payload}}
    case RESET_FIELDS:
      return resetAllFields(state)
    default:
      throw Error()
  }
}

function getInitialState(options: IOptions): State {
  return Object.keys(options.fields).reduce<State>(
    (initialValue, fieldName: string) => {
      initialValue.values[fieldName] = options.fields[fieldName].value || ''
      initialValue.statuses[fieldName] = {status: 'standard'}
      return initialValue
    },
    {values: {}, statuses: {}}
  )
}

export default function useFormValidation(options: IOptions): IFormValidationResult {
  const [state, dispatch] = useReducer(reducer, getInitialState(options))

  function validateField(field: string, errorCb?: (message: string) => void, successCb?: () => void): void {

    if (!state.values[field]) {
      return dispatch({type: VALIDATE_FIELD, field, payload: {status: 'standard'}})
    }

    try {
      options.fields[field].rules.forEach(rule => rule(state.values[field]))
      dispatch({type: VALIDATE_FIELD, field, payload: {status: 'success'}})
      if (successCb) successCb()
    } catch (error) {
      dispatch({
        type: VALIDATE_FIELD,
        field,
        payload: {
          status: 'error',
          message: error.message
        }
      })
      if (errorCb) errorCb(error.message)
    }
  }

  function thereIsAnError(): boolean {
    let thereIsAnError = false

    Object.keys(options.fields).forEach((fieldName: string) => {
      validateField(fieldName, () => {
        thereIsAnError = true
      })
    })

    return thereIsAnError
  }

  function onChangeField(field: string): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return function onChange(e: React.ChangeEvent<HTMLInputElement>) {
      dispatch({type: CHANGE_VALUE, field, payload: e.target.value})
      validateField(field)
    }
  }

  function onSubmit(e: React.SyntheticEvent<HTMLFormElement>): void {
    if (thereIsAnError()) {
      e.preventDefault()
      return
    }

    if (options.form && options.form.onSubmit) options.form.onSubmit(e)
  }

  function resetFields(): void {
    dispatch({
      type: RESET_FIELDS
    })
  }

  function manuallySetField(fieldName: string, value: string): void {
    dispatch(
      {type: CHANGE_VALUE, field: fieldName, payload: value}
    )
    validateField(fieldName)
  }

  function mapFieldProps(): InputProps {
    return Object.keys(options.fields).reduce(
      function mapStateToInputProps(fieldsObject: InputProps, fieldName: string) {
        return {
          ...fieldsObject,
          [fieldName]: {
            input: {onChange: onChangeField(fieldName), value: state.values[fieldName]},
            info: state.statuses[fieldName]
          }
        }
      },
      {}
    )
  }

  return {
    form: {
      onSubmit,
      noValidate: true
    },
    fields: mapFieldProps(),
    resetFields,
    manuallySetField
  }
}
