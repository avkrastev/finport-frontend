import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Link
} from '@mui/material';
  
import { Link as RouterLink } from 'react-router-dom';
import { experimentalStyled } from '@mui/material/styles';
import { useState, useContext, useEffect } from 'react';
import Input from '../../../components/FormElements/Input';
import { userLogin, userSignUp } from "../../../utils/api/userApiFunction";
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../../utils/validators';
import { useForm } from "../../../utils/hooks/form-hook";
import { AuthContext } from '../../../utils/context/authContext';
  
const TypographyH1 = experimentalStyled(Typography)(
    ({ theme }) => `
        font-size: ${theme.typography.pxToRem(50)};
    `
);

const TypographyH2 = experimentalStyled(Typography)(
    ({ theme }) => `
        font-size: ${theme.typography.pxToRem(17)};
    `
);

const TypographyH3 = experimentalStyled(Typography)(
    ({ theme }) => `
        font-size: ${theme.typography.pxToRem(12)};
    `
);

const LabelWrapper = experimentalStyled(Box)(
    ({ theme }) => `
        background-color: ${theme.colors.success.main};
        color: ${theme.palette.success.contrastText};
        font-weight: bold;
        border-radius: 30px;
        text-transform: uppercase;
        display: inline-block;
        font-size: ${theme.typography.pxToRem(11)};
        padding: ${theme.spacing(.5)} ${theme.spacing(1.5)};
        margin-bottom: ${theme.spacing(2)};
    `
);

function LoginForm() {
    const auth = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);

    const [formState, inputHandler, setFormData] = useForm({
        email: { value: '', isValid: false },
        password: { value: '', isValid: false },
    });

    useEffect(() => {
        const listener = event => {
            if (formState.isValid && (event.code === "Enter" || event.code === "NumpadEnter")) {
                loginOrSignUp();
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
          document.removeEventListener("keydown", listener);
        };
    }, [formState.isValid]);

    const switchModeHandler = () => {
        if (isLogin) {
            setFormData({
                ...formState.inputs,
                username: undefined,
                confirm_password: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        } else {
            setFormData({
                ...formState.inputs,
                username: {
                    value: '',
                    isValid: false
                },
                confirm_password: {
                    value: '',
                    isValid: false
                }
            }, false)
        }
        setIsLogin(prevMode => !prevMode);
    }

    const loginOrSignUp = async () => {
        if (isLogin) {
            try {
                const responseData = await userLogin(formState.inputs.email.value, formState.inputs.password.value);
                if (responseData.data) {
                    auth.login(responseData.data.userID, responseData.data.token, responseData.data.userData); 
                }
            } catch (err) {
                // TODO catch error
            }
        } else {
            try {
                const responseData = await userSignUp(formState.inputs.username.value, formState.inputs.email.value, formState.inputs.password.value);
                if (responseData.data) {
                    auth.login(responseData.data.userID, responseData.data.token, responseData.data.userData); 
                }
            } catch (err) {
                // TODO catch error
            }
        }
    }

    return (
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Grid spacing={{ xs: 6, md: 10 }} justifyContent="center" alignItems="center" container>
            <Grid item md={10} lg={8} mx="auto">
            <LabelWrapper color="success">Version 1.0.0</LabelWrapper>
            <TypographyH1 sx={{ mb: 2 }} variant="h1">
                Welcome to FinPort
            </TypographyH1>
            <TypographyH2
                sx={{ lineHeight: 1.5, pb: 4 }}
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
            >
                This is your financial portfolio. Here you can store everthing you have invested in plus a lot of cool features. 
            </TypographyH2>
                <Box
                    component="form"
                    sx={{'& .MuiTextField-root': { m: 1, width: '35ch' }}}
                    noValidate
                    autoComplete="on"
                >
                    <div>
                        { !isLogin && 
                            <Input
                                isRequired={true}
                                id="username"
                                label="Name"
                                errorMessage="Please enter you name!"
                                validators={[VALIDATOR_REQUIRE()]}
                                onInput={inputHandler}
                            />
                        }
                        <Input
                            isRequired={true}
                            id="email"
                            label="E-mail"
                            errorMessage="Please enter a valid email address!"
                            validators={[VALIDATOR_EMAIL()]}
                            onInput={inputHandler}
                        />
                        <Input
                            type="password"
                            isRequired={true}
                            id="password"
                            label="Password"
                            errorMessage="Password needs to be at least 8 characters"
                            validators={[VALIDATOR_MINLENGTH(8)]}
                            onInput={inputHandler}
                        />
                        { !isLogin && 
                            <Input
                                type="password"
                                isRequired={true}
                                id="confirm_password"
                                label="Confirm Password"
                                errorMessage="Please re-enter your password!"
                                onInput={inputHandler}
                                validators={[VALIDATOR_REQUIRE()]}
                            />
                        }
                    </div>
                    <Button
                        sx={{ marginTop: 2 }}
                        component={RouterLink}
                        to="/dashboards/crypto"
                        size="large"
                        variant="contained"
                        disabled={!formState.isValid}
                        onClick={() => loginOrSignUp()}
                        >
                        { isLogin ? 'Login' : 'Sign Up' }
                    </Button>
                </Box>
                { isLogin ?                 
                    <TypographyH2 mt={2}>
                        You don't have an account?&nbsp;
                        <Link 
                            href="#" 
                            underline="none"
                            onClick={switchModeHandler}
                        >
                            Sign Up
                        </Link>
                    </TypographyH2>
                    :
                    <TypographyH2 mt={2}>
                        Already have an account?&nbsp;
                        <Link 
                            href="#" 
                            underline="none"
                            onClick={switchModeHandler}
                        >
                            Login
                        </Link>
                    </TypographyH2>
                }
                {  isLogin &&  
                    <TypographyH3>
                        Forgot Password?&nbsp;
                        <Link 
                            href="/management" 
                            underline="none"
                        >
                            Recover it
                        </Link>
                    </TypographyH3>
                }
            </Grid>
        </Grid>
        </Container>
    );
}

export default LoginForm;