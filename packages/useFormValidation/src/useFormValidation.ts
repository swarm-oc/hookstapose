// @flow
import {useReducer, useEffect, useRef, MutableRefObject} from 'react'
import {CHANGE_VALUE, VALIDATE_FIELD, RESET_FIELDS} from './actions'
import {State, Action, IFormValidationResult, IOptions, InputProps} from './types'

function resetAllFields(state: State): State {
  return Object.keys(state.values).reduce<State>(
    (acum: State, fieldName: string) => {
      acum.values[fieldName] = ''
      acum.statuses[fieldName] = {
        status: 'standard'
      }
      return acum
    },
    {
      values: {},
      statuses: {}
    }
  )
}

function reducer(state: State, {type, field, payload}: Action): State {
  switch (type) {
    case CHANGE_VALUE:
      return {...state, values: {...state.values, [field!]: payload}}
    case VALIDATE_FIELD:
      return {...state, statuses: {...state.statuses, [field!]: payload}}
    case RESET_FIELDS:
      return resetAllFields(state)
    default:
      throw Error('Reducer: Bad action type')
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

export function useFormValidation(options: IOptions): IFormValidationResult {
  const [state, dispatch] = useReducer(reducer, getInitialState(options))
  const updatedField: MutableRefObject<string | null> = useRef(null)

  function validateField(field: string, errorCb?: (message: string) => void): void {
    const fieldIsEmpty = !state.values[field]

    if (fieldIsEmpty && !options.fields[field].isRequired) {
      return dispatch({type: VALIDATE_FIELD, field, payload: {status: 'standard'}})
    }

    const {rules, onSuccess, onError} = options.fields[field]

    try {
      rules.forEach(rule => rule(state.values[field]))
      dispatch({type: VALIDATE_FIELD, field, payload: {status: 'success'}})
      if (onSuccess) onSuccess(state.values[field])
    } catch (error) {
      dispatch({
        type: VALIDATE_FIELD,
        field,
        payload: fieldIsEmpty
          ? {
            status: 'standard'
          }
          : {
            status: 'error',
            message: error.message
          }
      })
      if (errorCb) errorCb(error.message)
      if (onError) onError(error.message)
    }
  }

  useEffect(
    function validateFieldOnChange() {
      if (updatedField.current) {
        validateField(updatedField.current)
      }
    },
    [state.values]
  )

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
      updatedField.current = field
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
    dispatch({type: CHANGE_VALUE, field: fieldName, payload: value})
    updatedField.current = fieldName
  }

  function mapFieldProps(): InputProps {
    return Object.keys(options.fields).reduce(function mapStateToInputProps(
      fieldsObject: InputProps,
      fieldName: string
    ) {
      return {
        ...fieldsObject,
        [fieldName]: {
          input: {onChange: onChangeField(fieldName), value: state.values[fieldName]},
          info: state.statuses[fieldName]
        }
      }
    },
    {})
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
