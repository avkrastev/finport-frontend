import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { validate } from 'src/utils/validators';

function Input(props) {
  const [helpMessage, setHelpMessage] = useState('');

  const emptyValue = props.hasOwnProperty('emptyValue') ? props.emptyValue : '';

  const onChange = (event, checkValidity = false) => {
    let value = event.target.value || emptyValue;

    if (props.onChange) {
      props.onChange(event);
    }

    if (props.change) {
      props.change(event);
    }

    if (props.valueTransformer) {
      value = props.valueTransformer(value);
    }

    if (props.onInput) {
      const isValid = checkValidity
        ? validate(value, props.validators || [])
        : true;

      const validators = checkValidity ? props.validators || [] : [];

      if (props.valueType === 'number') {
        value = Number(value);
      }

      props.onInput(props.id, value, isValid, true, validators);
    }
  };

  const onBlur = (event) => {
    onChange(event, true);
    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  useEffect(() => {
    const errorMessage = props.errorMessage || '';

    setHelpMessage(props.helperText || '');

    if (!props.isValid && props.isTouched) {
      setHelpMessage(props.isValid ? props.helperText : errorMessage);
    }
  }, [props.errorMessage, props.helperText, props.isValid, props.isTouched]);

  return (
    <TextField
      fullWidth={props.fullWidth}
      sx={props.sx}
      margin={props.margin}
      variant={props.variant}
      required={props.required}
      disabled={props.disabled}
      type={props.type}
      inputProps={props.inputProps}
      InputProps={{
        endAdornment: props.endAdornment
      }}
      id={props.id}
      label={props.label}
      onChange={onChange}
      onBlur={onBlur}
      value={props.value || ''}
      error={!props.isValid && props.isTouched}
      helperText={helpMessage}
    />
  );
}

export default Input;
