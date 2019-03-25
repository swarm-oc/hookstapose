// @flow
import {useReducer, SyntheticEvent} from 'react'

const CHANGE_VALUE = 'changeValue'
const VALIDATE_FIELD = 'validateField'

interface IOptions {
    form?: {
        onSubmit?: (e: React.SyntheticEvent<HTMLFormElement>) => void | Promise<void>;
    };
    fields: {
        [field: string]: {
            value?: string;
            rules: ((value: string) => void)[];
        };
    };
}

interface IFormValidationResult {
    form: {
        noValidate: true;
        onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    };
    fields: {
        [field: string]: {
            input: {
                value: string;
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
            };
            info: {
                status: 'standard' | 'success' | 'error';
                message?:  string;
            };
        };
    };
}

type State = {
    values: {
        [field: string]: string;
    };
    statuses: {
        [field: string]: {
            status: 'standard' | 'success' | 'error';
            message?: string;
        };
    };
}

type Action = {
    type: string;
    field: string;
    payload: any;
}

function reducer(state: State, {type, field, payload}: Action): State  {
    switch (type) {
        case CHANGE_VALUE:
            return {...state, values: {...state.values, [field]: payload}}
        case VALIDATE_FIELD:
            return {...state, statuses: {...state.statuses, [field]: payload}}
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

    return {
        form: {
            onSubmit,
            noValidate: true
        },
        fields: Object.keys(options.fields).reduce(
            (fieldsObject, fieldName: string) => ({
                ...fieldsObject,
                [fieldName]: {
                    input: {onChange: onChangeField(fieldName), value: state.values[fieldName]},
                    info: state.statuses[fieldName]
                }
            }),
            {}
        )
    }
}
