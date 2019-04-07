# useFormValidation

This hook lets you set rules for every input in your form and validate `onChange` and on form `submit`, also you can setup a callback when a field success validating or when it does not validate correctly.

## Installation

Install with yarn:
```
yarn install @react-hook-utils/use-form-validation
```
Install with npm:
```
npm install @react-hook-utils/use-form-validation
```

## API

```javascript
import useFormValidation from '@react-hook-utils/use-form-validation

const {form, fields, resetFields, manuallySetField} = useFormValidation(options)
```

*`options`*: Object containing hook configuration
- `form`: Object `form options`
- - `onSubmit`: Function `submit callback when all fields success`
- `fields`: *(Required)* Object `fields configuration`
- - `inputName`: Object `inputName field configuration`
- - - `value`: String `input initial value`
- - - `rules`: *(Required)* Function[] `input rules`
- - - - `(value: String) => void` Function `input rule, it must throw an error with the error message when the value is wrong`
- - - `onSuccess`: Function `input callback on successful validation`
- - - `onError`: Function `input callback on erroneous validation`
- - - `isRequired`: Boolean `indicates if the field is required to submit the form`

*`hook return`*: Object containing hook return
- `form`: Object `form props to spread`
- - `noValidate`: true `disables form validate api`
- - `onSubmit`: Function `form's submit function`
- `fields`: Object `inputs properties and status`
- - `inputName`: Object
- - - `input`: Object `inputName props`
- - - - `onChange`: Function `inputName onChange function`
- - - - `value`: String `current inputName value`
- - - `info`: Object `inputName
- - - - `status`: 'standard' | 'success' | 'error' `input validation status`
- - - - `message`: string `input error message`
- `resetFields`: Function `resets all fields values to ''`
- `manuallySetField`: (inputName: String, value: String) => void `sets the inputName value`

## Usage

```javascript
import React from 'react`
import {useFormValidation} from '@react-hook-utils/use-form-validation'

function shouldContainLowerZ(value) {
    if (value.indexOf('z') !== -1) return
    throw new Error('The field must contain a Z letter')
}

function fieldLength(length) {
    return (value) => {
        if (value.length >= length) return
        throw new Error(`The field must have a length of ${length}`)
    }
}

function Example() {

    const userNameLength = fieldLength(10)
    const passwordLength = fieldLength(8)

    const {form, fields} = useFormValidation({
        fields: {
            username: {
                isRequired: true,
                rules: [
                    shouldContainLowerZ,
                    usernameLength
                ]
            },
            password: {
                isRequired: true,
                rules: [
                    passwordLength
                ]
            }
        }
    })

    const usernameField = fields['username']
    const passwordField = fields['password']

    return (
        <form {...form}>
            <label htmlFor='username'>Username</label>
            <input name='username' id='username' {...usernameField.input}/>
            {usernameField.info.message && <p>{usernameField.info.message}</p>}
            <label htmlFor='password'>Password</label>
            <input name='password' id='password' {...passwordField.input}/>
            {passwordField.info.message && <p>{passwordField.info.message}</p>}
            <button type='submit'>Login</button>
        </form>
    )
}
```
