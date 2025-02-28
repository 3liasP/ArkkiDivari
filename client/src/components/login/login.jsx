import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
    Box,
    Button,
    Card,
    Divider,
    FormControl,
    FormLabel,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import textLogo from '../../assets/svg/logo-no-background.svg';
import { login, register } from '../user/user.actions';

const StyledLogo = styled('img')(() => ({
    alignSelf: 'center',
    width: '250px',
    height: 'auto',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    backgroundColor: theme.palette.background.paper,
    ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.background.default,
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage: `radial-gradient(ellipse at 50% 50%, ${theme.palette.primary.light}, ${theme.palette.background.paper})`,
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage: `radial-gradient(at 50% 50%, ${theme.palette.primary.dark}, ${theme.palette.background.default})`,
        }),
    },
}));

const SignIn = ({ login, register }) => {
    const [signingUp, setSigningUp] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [verifyPasswordError, setVerifyPasswordError] = useState(false);
    const [verifyPasswordErrorMessage, setVerifyPasswordErrorMessage] =
        useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (emailError || passwordError) {
            return;
        }

        const callBack = () => navigate('/');
        const data = new FormData(event.currentTarget);
        const userData = {
            name: data.get('name'),
            userid: data.get('email'),
            password: data.get('password'),
        };

        signingUp
            ? register(userData, callBack)
            : login(userData.userid, userData.password, callBack);
    };

    const validateInputs = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const name = document.getElementById('name');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Sähköpostiosoite on virheellinen');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage(
                'Salasanan tulee olla vähintään 6 merkkiä pitkä',
            );
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (signingUp) {
            const verifyPassword = document.getElementById('verifyPassword');
            if (password.value !== verifyPassword.value) {
                setVerifyPasswordError(true);
                setVerifyPasswordErrorMessage('Salasanat eivät täsmää');
                isValid = false;
            } else {
                setVerifyPasswordError(false);
                setVerifyPasswordErrorMessage('');
            }

            if (!name.value || name.value.length < 1) {
                setNameError(true);
                setNameErrorMessage('Nimi on pakollinen');
                isValid = false;
            } else {
                setNameError(false);
                setNameErrorMessage('');
            }
        }

        return isValid;
    };

    return (
        <SignInContainer direction="column" justifyContent="space-between">
            <StyledCard variant="outlined">
                <StyledLogo src={textLogo} alt="ArkkiDivari" />
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    {signingUp && (
                        <FormControl>
                            <FormLabel htmlFor="name">Nimi</FormLabel>
                            <TextField
                                autoComplete="name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                placeholder="Etunimi Sukunimi"
                                error={nameError}
                                helperText={nameErrorMessage}
                                color={nameError ? 'error' : 'primary'}
                            />
                        </FormControl>
                    )}
                    <FormControl>
                        <FormLabel htmlFor="email">Sähköposti</FormLabel>
                        <TextField
                            error={emailError}
                            helperText={emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="sinun@email.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={emailError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Salasana</FormLabel>
                        <TextField
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={passwordError ? 'error' : 'primary'}
                        />
                    </FormControl>
                    {signingUp && (
                        <FormControl>
                            <FormLabel htmlFor="password">
                                Salasana uudelleen
                            </FormLabel>
                            <TextField
                                error={verifyPasswordError}
                                helperText={verifyPasswordErrorMessage}
                                name="verifyPassword"
                                placeholder="••••••"
                                type="password"
                                id="verifyPassword"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={
                                    verifyPasswordError ? 'error' : 'primary'
                                }
                            />
                        </FormControl>
                    )}
                    <Button
                        sx={{ mt: 2 }}
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                        endIcon={signingUp ? <PersonAddIcon /> : <LoginIcon />}
                    >
                        {signingUp ? 'Rekisteröidy' : 'Kirjaudu sisään'}
                    </Button>
                </Box>
                <Divider />
                <Button
                    onClick={() => setSigningUp(!signingUp)}
                    variant="text"
                    sx={{ alignSelf: 'center' }}
                >
                    <Typography variant="body2">
                        {signingUp
                            ? 'Oletko jo käyttäjä? Kirjaudu sisään.'
                            : 'Ei vielä käyttäjää? Luo tili.'}
                    </Typography>
                </Button>
            </StyledCard>
        </SignInContainer>
    );
};

const mapDispatchToProps = (dispatch) => ({
    login: (username, password, callBack) =>
        dispatch(login(username, password, callBack)),
    register: (userInfo, callBack) => dispatch(register(userInfo, callBack)),
});

export default connect(null, mapDispatchToProps)(SignIn);
