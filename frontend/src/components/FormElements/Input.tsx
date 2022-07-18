import { TextField } from '@mui/material';
import { useReducer, useEffect } from 'react';
import { validate } from '../../utils/validators';

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE': 
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            }
        case 'TOUCH': 
            return {
                ...state,
                isTouched: true
            }
        default:
            return state;
    }
}
  
function Input(props) {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '', 
        isValid: props.initialValid || false,
        isTouched: false
    });
    const { id, onInput } = props;
    const { value, isValid } = inputState;

    const changeHandler = (event) => {
        dispatch({
            type: 'CHANGE', 
            val: event.target.value,
            validators: props.validators
        })
    }

    const touchHandler = () => {
        dispatch({type: 'TOUCH'})
    }

    useEffect(() => {
        onInput(id, value, isValid);
    }, [id, value, isValid, onInput]);

    return (
        <TextField
            required={props.isRequired}
            type={props.type}
            id={id}
            label={props.label}
            onChange={(e) => changeHandler(e)}
            onBlur={touchHandler}
            value={inputState.value}
            error={!inputState.isValid && inputState.isTouched}
            helperText={!inputState.isValid && inputState.isTouched ? props.errorMessage : ""}
        />
    );
}

export default Input;