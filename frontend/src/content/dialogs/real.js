import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import {
  transactionTypes,
  currencies,
  propertyTypes
} from '../../constants/common';
import {
  addNewTransaction,
  updateTransaction
} from '../applications/Transactions/transactionSlice';
import { useForm } from 'src/utils/hooks/form-hook';
import Input from '../../components/FormElements/Input';
import { VALIDATOR_REQUIRE } from 'src/utils/validators';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { transactionStateDescriptor } from 'src/components/TransactionModal/transactionStateDescriptor';
import Selector from 'src/components/FormElements/Selector';
import { roundNumber, validateStateEntity } from 'src/utils/functions';

function RealModal(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [tab, setTab] = useState(0);
  const [isEditForm, setIsEditForm] = useState(false);

  const [formState, inputHandler, setFormData] = useForm({
    ...transactionStateDescriptor(),
    property_type: {
      value: '',
      isValid: true,
      isTouched: true
    }
  });

  useEffect(() => {
    setFormData({
      ...formState.inputs,
      category: {
        value: 'real',
        isValid: true,
        isTouched: true
      }
    });
  }, []);

  useEffect(() => {
    setIsEditForm(false);
    if (Object.keys(props.transaction).length > 0) {
      setFormData({
        ...formState.inputs,
        id: {
          value: props.transaction.id,
          isValid: true,
          isTouched: false
        },
        name: {
          value: props.transaction.name,
          isValid: true,
          isTouched: false
        },
        category: {
          value: props.transaction.category,
          isValid: true,
          isTouched: false
        },
        price: {
          value:
            props.transaction.type === 1
              ? roundNumber(props.transaction.price) * -1
              : roundNumber(props.transaction.price),
          isValid: true,
          isTouched: false
        },
        quantity: {
          value:
            props.transaction.type === 1
              ? props.transaction.quantity * -1
              : props.transaction.quantity,
          isValid: true,
          isTouched: false
        },
        currency: {
          value: props.transaction.currency,
          isValid: true,
          isTouched: false
        },
        date: {
          value: props.transaction.date,
          isValid: true,
          isTouched: false
        },
        type: {
          value: props.transaction.type,
          isValid: true,
          isTouched: false
        }
      });
      setTab(props.transaction.type);
      setIsEditForm(true);
    }
  }, [props.transaction]); // eslint-disable-line

  const setType = (value) => {
    const transactionType = transactionTypes.find((type) => type.key === value);
    const transfer = value === 2 ? 2 : null;

    setFormData({
      ...formState.inputs,
      type: { value: value, isValid: true },
      transfer: { value: transfer, isValid: true }
    });

    setTab(transactionType.parent);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  const submitTransactionForm = async () => {
    const currentState = { ...formState.inputs };
    const validationResult = validateStateEntity({
      stateEntity: currentState,
      toSkip: ['price_per_asset']
    });

    if (!validationResult.valid) {
      setFormData(validationResult.stateEntity);
      return;
    }
    try {
      let transactionPayload = {};
      for (const [key, description] of Object.entries(formState.inputs)) {
        transactionPayload[key] = description.value;
      }

      if (isEditForm) {
        dispatch(updateTransaction(transactionPayload));
      } else {
        dispatch(addNewTransaction(transactionPayload));
      }

      props.close();
      setFormData({
        ...transactionStateDescriptor(),
        property_type: {
          value: '',
          isValid: true,
          isTouched: true
        }
      });
      setTab(0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseDialog = () => {
    setFormData({
      ...transactionStateDescriptor(),
      property_type: {
        value: '',
        isValid: true,
        isTouched: true
      }
    });
    setTab(0);
    props.close();
  };

  return (
    <>
      <Dialog open={props.open} fullWidth>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.contentText}</DialogContentText>
          <Box sx={{ width: 1, pt: 2, pl: 5, pr: 5 }}>
            {props.tabs && (
              <Tabs
                centered
                textColor="primary"
                indicatorColor="primary"
                value={tab}
                onChange={(event, value) => setType(value)}
              >
                <Tab label={t('Buy')} {...a11yProps(0)} />
                <Tab label={t('Sell')} {...a11yProps(1)} />
                <Tab label={t('Heritage')} {...a11yProps(2)} />
              </Tabs>
            )}

            {isEditForm ? (
              <Typography
                variant="h3"
                component="h2"
                align="center"
                sx={{ m: 2 }}
              >
                {t(formState.inputs.name.value)}
              </Typography>
            ) : (
              <Input
                required
                autoHighlight
                fullWidth
                id="name"
                type="text"
                label={t('Address')}
                sx={{ mt: 2, mb: 1 }}
                onInput={inputHandler}
                {...formState.inputs.name}
              />
            )}

            <Selector
              id="property_type"
              options={propertyTypes}
              label={t('Property type')}
              sx={{ gridColumn: '1', mt: 1, mb: 1 }}
              onInput={inputHandler}
              {...formState.inputs.property_type}
            />

            {tab !== 2 && (
              <Box sx={{ display: 'grid' }}>
                <Selector
                  required
                  showKey
                  id="currency"
                  options={currencies}
                  label={t('Currency')}
                  sx={{ gridColumn: '1', mt: 1, mb: 1 }}
                  onInput={inputHandler}
                  {...formState.inputs.currency}
                />
                <Input
                  required
                  sx={{ gridColumn: '2', input: { textAlign: 'right' } }}
                  margin="dense"
                  id="price"
                  label={t('Price')}
                  type="number"
                  valueType="number"
                  validators={[VALIDATOR_REQUIRE()]}
                  onInput={inputHandler}
                  onFocus={(event) => event.target.select()}
                  {...formState.inputs.price}
                  emptyValue={0}
                />
              </Box>
            )}

            <Input
              required
              sx={{ gridColumn: '1', input: { textAlign: 'right' } }}
              margin="dense"
              id="quantity"
              label={t('Quantity')}
              type="number"
              valueType="number"
              onFocus={(event) => event.target.select()}
              onInput={inputHandler}
              fullWidth
              validators={[VALIDATOR_REQUIRE()]}
              {...formState.inputs.quantity}
              emptyValue={0}
            />

            <Input
              margin="dense"
              id="date"
              label={t('Date')}
              type="datetime-local"
              onInput={inputHandler}
              fullWidth
              value={
                isNaN(Date.parse(formState.inputs.date.value)) == false
                  ? format(
                      new Date(formState.inputs.date.value),
                      'yyyy-MM-dd HH:mm'
                    )
                  : ''
              }
              isTouched={formState.inputs.date.isTouched}
              isValid={formState.inputs.date.isValid}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ m: 3 }}>
          <Button onClick={handleCloseDialog}>{t('Cancel')}</Button>
          <Button
            onClick={submitTransactionForm}
            variant="contained"
            color="primary"
            autoFocus
          >
            {t('Save')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RealModal;
