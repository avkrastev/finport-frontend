import { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Autocomplete, Box, Tab, Tabs, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { autocomplete } from '../../utils/api/stocksApiFunction';

function Modal(props) {
  const [value, setValue] = useState(
    new Date(),
  );
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const responseData = await autocomplete('apple');
      console.log(responseData)
    }
  
    // call the function
    // fetchData()
    //   // make sure to catch any error
    //   .catch(console.error);
  }, [])

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


  return (
    <>
        <Dialog open={props.open} onClose={props.close}>
          {/* <DialogTitle>{props.title}</DialogTitle> */}
            <DialogContent>
              <DialogContentText>
                  {props.contentText}
              </DialogContentText>
              <Box sx={{ width: '100%' }}>
                  <Tabs centered
                    textColor="primary"
                    indicatorColor="primary" 
                    value={tab} 
                    onChange={handleTabChange} >
                    <Tab label="Buy" {...a11yProps(0)} />
                    <Tab label="Sell" {...a11yProps(1)} />
                    <Tab label="Transfer" {...a11yProps(2)} />
                  </Tabs>
                  <TabPanel value={tab} index={0}>
                  {
                    props.content && props.content.map((item, i) => {
                      switch (item.id) {
                        case 'category':
                          return <Autocomplete
                                  id="country-select-demo"
                                  sx={{ pt: 1 }}
                                  key={i}
                                  options={props.categories}
                                  autoHighlight
                                  getOptionLabel={(option) => option.name}
                                  renderOption={(props, option) => {
                                    if (option.show) {
                                      return <Box component="li" {...props}>
                                                {option.name}
                                              </Box>
                                    }
                                  }}
                                  renderInput={(params) => {
                                    return <TextField
                                      {...params}
                                      label="Choose a category"
                                      inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                      }}
                                    />
                                  }}
                                />;
                        case 'date':
                          return <LocalizationProvider 
                                  key={i} 
                                  dateAdapter={AdapterDateFns}>
                                  <MobileDatePicker
                                    label="Date"
                                    inputFormat="dd.MM.yyyy"
                                    value={value}
                                    onChange={handleChange}
                                    renderInput={(params) => <TextField sx={{ mt: 1, width: 1 }} {...params} />}
                                  />
                                </LocalizationProvider>;   
                        default:
                          return <TextField
                          key={i}
                          autoFocus={item.autofocus}
                          margin="dense"
                          id={item.id}
                          label={item.label}
                          type={item.type}
                          fullWidth
                        />
                      }
                    })
                  }
                  </TabPanel>
                  <TabPanel value={tab} index={1}>
                    Sell
                  </TabPanel>
                  <TabPanel value={tab} index={2}>
                    Transfer
                  </TabPanel>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.close}>Cancel</Button>
                <Button onClick={props.close}>Save</Button>
            </DialogActions>
        </Dialog>
    </>
  );
}

export default Modal;
