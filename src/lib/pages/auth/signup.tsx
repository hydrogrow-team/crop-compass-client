import {
    Box,
    StepIcon,
    StepNumber,
    Stepper,
    useSteps,
    Step,
    StepSeparator,
    StepDescription,
    StepTitle,
    StepIndicator,
    StepStatus,
    Input,
    Stack,
    Button,
    HStack,
    useToast,
    InputGroup,
    InputRightElement,
    Heading,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    List,
    ListItem,
    Text,

} from '@chakra-ui/react';
import { createContext, useContext, useReducer, type ReactElement, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, } from '@chakra-ui/react'
import { generateRandomPassword } from './utils';

interface SignUpState {
    username: string | undefined;
    email: string | undefined;
    password: string | undefined;
    confirm_password: string | undefined;
    location: number | undefined;
}

const initialState: SignUpState = {
    username: undefined,
    email: undefined,
    password: undefined,
    confirm_password: undefined,
    location: undefined,
};
interface SignUpErrorsState {
    username: boolean;
    email: boolean;
    password: boolean;
    confirm_password: boolean;
    location: boolean;
}

const initialErrorsState: SignUpErrorsState = {
    username: false,
    email: false,
    password: false,
    confirm_password: false,
    location: false,
};
type Action =
    | { type: 'SET_USERNAME'; payload: string }
    | { type: 'SET_EMAIL'; payload: string }
    | { type: 'SET_PASSWORD'; payload: string }
    | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
    | { type: 'SET_LOCATION'; payload: number }
    | { type: 'RESET' };

const signUpReducer = (state: SignUpState, action: Action): SignUpState => {
    switch (action.type) {
        case 'SET_USERNAME':
            return { ...state, username: action.payload };
        case 'SET_EMAIL':
            return { ...state, email: action.payload };
        case 'SET_PASSWORD':
            return { ...state, password: action.payload };
        case 'SET_CONFIRM_PASSWORD':
            return { ...state, confirm_password: action.payload };
        case 'SET_LOCATION':
            return { ...state, location: action.payload };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
};


const SignUpContext = createContext<{
    state: SignUpState;
    errors: SignUpErrorsState;
    dispatch: React.Dispatch<Action>;
}>({
    state: initialState,
    errors: initialErrorsState,
    dispatch: () => undefined,
});


type StepPref = {
    title: string,
    description: string,
    element: ReactElement,
    index: number,
    are_inputs_valid: () => boolean
}




const SignUp = () => {
    const [state, dispatch] = useReducer(signUpReducer, initialState);

    const [errors, setErrors] = useState<SignUpErrorsState>(initialErrorsState);

    const steps: Array<StepPref> = [
        {
            title: 'Username',
            description: 'Setup your username',
            index: 0,
            element: <Username />,
            are_inputs_valid: () => {
                const validPattern = /^[a-zA-Z0-9_]+$/g;
                const username = state.username;
                if (typeof username === "string") {

                    if ((username.length < 3 || username.length > 20 || !validPattern.test(username) || username.trim() !== username)) {
                        setErrors({ ...errors, username: true });
                        return false
                    }
                    setErrors({ ...errors, username: false });
                    return true
                }
                return false
            }
        },
        {
            title: 'Authentication Information',
            description: 'Set your email and password',
            index: 1,
            element: <Authentication />,

            are_inputs_valid: () => {
                const email = state.email;
                const password = state.password;
                const confirm_password = state.confirm_password;

                if (typeof email === "string" && typeof password === "string" && typeof confirm_password === "string") {

                    // Email validation
                    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g;
                    if (!emailPattern.test(email)) {
                        setErrors((prev) => ({ ...prev, email: true }));
                        return false;
                    }
                    setErrors((prev) => ({ ...prev, email: false }));


                    // Password validation
                    const isPasswordValid = password.length >= 8 &&
                        /[A-Z]/g.test(password) && // At least one uppercase
                        /[a-z]/g.test(password) && // At least one lowercase
                        /[0-9]/g.test(password) && /[\W_]/g.test(password);   // At least one number

                    if (!isPasswordValid) {
                        setErrors((prev) => ({ ...prev, password: true }));
                        return false;
                    }
                    setErrors((prev) => ({ ...prev, password: false }));


                    // Confirm password validation
                    const isConfirmPasswordValid = confirm_password === password;

                    if (!isConfirmPasswordValid) {
                        setErrors((prev) => ({ ...prev, confirm_password: true }));
                        return false;
                    }
                    setErrors((prev) => ({ ...prev, confirm_password: false }));

                    return true; // All inputs are valid
                }
                return false; // Invalid type checks

            }

        },
        {
            title: 'Location Setup',
            description: 'Setup the location of your farm land',
            index: 2,
            element: <Location />,
            are_inputs_valid: () => {
                if (typeof Number(state.location) !== "number") {
                    setErrors({ ...errors, location: true });
                    return false
                }

                setErrors({ ...errors, location: false });
                return true;
            }
        },
    ];

    const { activeStep, goToNext, goToPrevious } = useSteps({
        index: 0,
        count: steps.length,
    })

    const isLastStep = activeStep === steps.length - 1;

    const [disableNext, setDisableNext] = useState<boolean>(false);
    useEffect(() => {
        if (steps[activeStep].are_inputs_valid()) {
            setDisableNext(false);
        } else {
            setDisableNext(true);
        }
    }, [state, activeStep])

    const toast = useToast()
    const navigate = useNavigate()
    function finishHandler() {

        toast({
            title: 'Account created.',
            description: "We've created your account for you.",
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: "top"
        })
        navigate("/dashboard")
        // redirect("/dashboard")
    }

    const isAuthenticated = false;

    if (isAuthenticated) {
        navigate("/dashboard")
    }



    return (
        <SignUpContext.Provider value={{ state, dispatch, errors }}>
            <Stack alignItems={"center"} spacing={20}>
                <Heading>Create your account</Heading>
                <Stack alignItems={"center"} spacing={16} width={"full"}>

                    <Box width={"full"}>

                        <Stepper colorScheme="green" index={activeStep}>


                            {steps.map((step) => (
                                <Step key={step.index}>
                                    <StepIndicator>
                                        <StepStatus
                                            complete={<StepIcon />}
                                            incomplete={<StepNumber />}
                                            active={<StepNumber />}
                                        />
                                    </StepIndicator>


                                    <Box flexShrink='0'>
                                        <StepTitle>{step.title}</StepTitle>
                                        <StepDescription>{step.description}</StepDescription>
                                    </Box>

                                    <StepSeparator />

                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                    <Box >
                        {steps[activeStep].element}
                    </Box>
                    H</Stack>
                <HStack width="full" justifyContent="space-between">
                    {activeStep !== 0 ? <Button colorScheme='green' onClick={goToPrevious}>Previous</Button> : <div />}
                    {isLastStep ?
                        <Button onClick={finishHandler}>Done</Button> :
                        <Button isDisabled={disableNext} colorScheme="green" onClick={goToNext}>
                            Next
                        </Button>
                    }

                </HStack>
                <ChakraLink as={ReactRouterLink} to='/auth/login'>
                    Already have an account?
                </ChakraLink>
            </Stack>
        </SignUpContext.Provider>
    )
};


function Username() {
    const { dispatch, state, errors } = useContext(SignUpContext);

    return (

        <FormControl isInvalid={!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input width={"full"} type='text' isInvalid={errors.username} variant="filled" placeholder="Username" onChange={e => dispatch({ type: "SET_USERNAME", payload: e.target.value })} value={state.username} />
            {!errors.location ? (
                <FormHelperText>
                    Enter your username.
                </FormHelperText>
            ) : (
                <FormErrorMessage>Usernmae is required.</FormErrorMessage>
            )}
        </FormControl>
    )
}


function Authentication() {
    const { state, dispatch, errors } = useContext(SignUpContext);
    const [show_password, setShowPassword] = useState(false);
    const [show_confirm_password, setShowConfirmPassword] = useState(false);

    const [password_placeholder, _] = useState<string>(generateRandomPassword(16));

    return (
        <Stack>
            <FormControl>
                <FormLabel>
                    Email
                </FormLabel>
                <Input type="email" variant="filled" placeholder="name@domain.com" isInvalid={errors.email} value={state.email} onChange={e => dispatch({ type: "SET_EMAIL", payload: e.target.value })} />
            </FormControl>

            <FormControl>
                <FormLabel>
                    Password
                </FormLabel>

                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={show_password ? 'text' : 'password'}
                        value={state.password}
                        placeholder={password_placeholder}
                        isInvalid={errors.password}
                        variant={"filled"}
                        onChange={e => dispatch({ type: "SET_PASSWORD", payload: e.target.value })}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => setShowPassword(!show_password)}>
                            {show_password ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>

                <FormLabel>
                    Confirm your password
                </FormLabel>
                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={show_confirm_password ? 'text' : 'password'}
                        isInvalid={errors.confirm_password}
                        placeholder={password_placeholder}
                        value={state.confirm_password}
                        variant={"filled"}
                        onChange={e => dispatch({ type: "SET_CONFIRM_PASSWORD", payload: e.target.value })}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => setShowConfirmPassword(!show_confirm_password)}>
                            {show_confirm_password ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <FormHelperText>
                    <Text>Password:</Text>
                    <List paddingLeft={4}>
                        <ListItem>
                            must be at least 8 characters long.
                        </ListItem>
                        <ListItem>
                            must contain least one uppercase letter.
                        </ListItem>
                        <ListItem>
                            must contain least one lowercase letter.
                        </ListItem>
                        <ListItem>
                            must contain least one special character.
                        </ListItem>
                    </List>
                </FormHelperText>
            </FormControl>

        </Stack>
    )
}

function Location() {
    const { state, dispatch, errors } = useContext(SignUpContext);
    return (
        <FormControl isInvalid={errors.location}>
            <FormLabel>Location</FormLabel>
            <Input type="number" isInvalid={errors.location} variant="filled" placeholder="Location" value={state.location} onChange={e => dispatch({ type: "SET_LOCATION", payload: Number(e.target.value) })} />
            {!errors.location ? (
                <FormHelperText>
                    Enter your specific location.
                </FormHelperText>
            ) : (
                <FormErrorMessage>Location is required.</FormErrorMessage>
            )}
        </FormControl>
    )
}



export default SignUp;


