import {act, renderHook, cleanup} from 'react-hooks-testing-library'
import useFormValidation from '../src/useFormValidation'

describe('useFormValidation', () => {
  let formValidation: any
  let event: any

  function charactersLong(numberOfCharacters: number): (value: string) => void {
    return value => {
      if (value.length < numberOfCharacters) throw new Error(`Characters must be ${numberOfCharacters} long`)
    }
  }

  const options = {
    fields: {
      username: {
        value: 'Manu',
        rules: [
          charactersLong(5),
          function onlyLetters(value: string) {
            if (!/[a-zA-Z]+/g.test(value)) throw new Error('only letters allowed')
          }
        ],
        isRequired: true
      },
      password: {
        rules: [
          charactersLong(8),
          function onlyNumbers(value: string) {
            if (!/[0-9]+/g.test(value)) throw new Error('only numbers allowed')
          }
        ]
      }
    }
  }

  afterEach(() => cleanup())

  beforeEach(() => {
    event = {
      preventDefault: jest.fn()
    }
    formValidation = renderHook(() => useFormValidation(options))
  })

  it('should set initialValues properly', () => {
    const {username, password} = formValidation.result.current.fields
    expect(username.input.value).toBe('Manu')
    expect(password.input.value).toBe('')
  })

  it('should reset all fields when calling resetFields', () => {
    expect(formValidation.result.current.fields.username.input.value).toBe('Manu')
    act(() => formValidation.result.current.resetFields())
    expect(formValidation.result.current.fields.username.input.value).toBe('')
  })

  it('should change an input when manually setted', () => {
    expect(formValidation.result.current.fields.password.input.value).toBe('')
    const newPassword = '03034567'
    act(() => formValidation.result.current.manuallySetField('password', newPassword))
    expect(formValidation.result.current.fields.password.input.value).toBe(newPassword)
  })

  it('should change field when using native onChange event', () => {
    expect(formValidation.result.current.fields.username.input.value).toBe('Manu')
    act(() => {
      formValidation.result.current.fields.username.input.onChange({
        target: {
          value: 'Mickey Mouse'
        }
      })
    })
    expect(formValidation.result.current.fields.username.input.value).toBe('Mickey Mouse')
  })

  it('should validate field on every onChange proc', () => {
    expect(formValidation.result.current.fields.username.info.status).toBe('standard')

    act(() => {
      formValidation.result.current.fields.username.input.onChange({
        target: {
          value: 'M'
        }
      })
    })

    expect(formValidation.result.current.fields.username.info.status).toBe('error')

    act(() => {
      formValidation.result.current.fields.username.input.onChange({
        target: {
          value: 'MaanuChi'
        }
      })
    })

    expect(formValidation.result.current.fields.username.info.status).toBe('success')
  })

  it('should validate fields and prevent submit if fields are invalid', () => {
    act(() =>
      formValidation.result.current.fields.username.input.onChange({
        target: {
          value: ''
        }
      })
    )

    act(() => {
      formValidation.result.current.fields.password.input.onChange({
        target: {
          value: 'hi'
        }
      })
    })

    act(() => formValidation.result.current.form.onSubmit(event))

    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('should run submit when all fields are valid', () => {
    act(() => {
      formValidation.result.current.fields.username.input.onChange({
        target: {
          value: 'aValidUsername'
        }
      })
    })

    act(() => {
      formValidation.result.current.fields.password.input.onChange({
        target: {
          value: '03034567'
        }
      })
    })

    act(() => formValidation.result.current.form.onSubmit(event))

    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  it('should not check for non required fields when they are empty', () => {
    act(() => {
      formValidation.result.current.fields.username.input.onChange({
        target: {
          value: 'Mr Roboto'
        }
      })
    })

    act(() => formValidation.result.current.form.onSubmit(event))

    expect(event.preventDefault).not.toBeCalled()
  })

  it('Should check if a required field is empty at submit time', () => {
    act(() => {
      formValidation.result.current.fields.username.input.onChange({
        target: {
          value: ''
        }
      })
    })

    act(() => {
      formValidation.result.current.fields.password.input.onChange({
        target: {
          value: '030345678'
        }
      })
    })

    act(() => formValidation.result.current.form.onSubmit(event))
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('should call a custom onSubmit when fields are valid', () => {
    const onSubmit = jest.fn()
    const formValidationWithSubmit = renderHook(() => useFormValidation({...options, form: {onSubmit}}))

    act(() => {
      formValidationWithSubmit.result.current.fields.username.input.onChange({
        target: {
          value: 'Mr Roboto'
        }
      })
    })

    act(() => {
      formValidationWithSubmit.result.current.form.onSubmit(event)
    })

    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalled()
  })
})
