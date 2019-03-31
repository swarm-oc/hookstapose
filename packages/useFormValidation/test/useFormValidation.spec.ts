import {act} from 'react-testing-library'
import useFormValidation from '../src/useFormValidation'
import { IFormValidationResult } from '../src/types'

describe('useFormValidation', () => {
  let formValidation: IFormValidationResult

  function charactersLong(numberOfCharacters: number): (value: string) => void {
    return (value) => {
      if (value.length < numberOfCharacters) throw new Error(`Characters must be ${numberOfCharacters} long`)
    }
  }

  const options = {
    form: {
      onSubmit: jest.fn()
    },
    fields: {
      username: {
        rules: [
          charactersLong(5),
          function onlyLetters(value: string) {
            if (!/[a-zA-Z]+/g.test(value)) throw new Error('only letters allowed')
          }
        ]
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

  beforeEach(() => {
    formValidation = useFormValidation(options)
  })

  it('should pee', () => {
    console.log(formValidation)
  })
})
