import { Autocomplete, TextField, Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { validate } from '../../utils/validators';

export function Selector(props: any) {
  const [helpMessage, setHelpMessage] = useState('');

  const onChange = (event, value) => {
    if (props.change) {
      props.change(event, value);
    }

    if (props.onChange) {
      props.onChange(event, value);
    }

    let toSet = value?.key || '';
    if (!isNaN(parseInt(value?.key))) {
      toSet = parseInt(value.key);
    }

    if (props.multiple) {
      toSet = value.map((item) =>
        item instanceof Object ? parseInt(item.key) : item
      );
    }

    if (props.onInput) {
      const isValid = validate(value, props.validators || []);
      props.onInput(props.id, toSet, isValid, true, props.validators);
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
    <Autocomplete
      freeSolo={!props.noOptionsText}
      noOptionsText={props.noOptionsText}
      className="autocomplete"
      id={props.id}
      options={props.options}
      disabled={props.disabled}
      disableClearable={props.required || props.disableClearable}
      multiple={props.multiple}
      defaultValue={props.defaultValue}
      isOptionEqualToValue={(option, value) => option.key === value}
      onChange={(e, value) => onChange(e, value)}
      value={props.value}
      autoHighlight={props.autoHighlight}
      getOptionLabel={(key) =>
        props.options.find((option) => option.key === key)?.value || ''
      }
      sx={props.sx}
      renderOption={(props, option) => {
        return (
          <Box component="li" {...props} key={option.key}>
            {option.value}
          </Box>
        );
      }}
      filterOptions={(options, state) => {
        return options.filter((item) =>
          item.value.toLowerCase().includes(state.inputValue.toLowerCase())
        );
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={props.label}
            placeholder={props.placeholder}
            inputProps={{
              ...params.inputProps
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {props.loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
            required={props.required}
            error={!props.isValid && props.isTouched}
            helperText={helpMessage}
            onChange={props.inputChange}
            InputLabelProps={{ style: { fontWeight: 'bold' } }}
          />
        );
      }}
    />
  );
}

export default Selector;
