import {
    Input,
    Stack,
    Button,
    InputGroup,
    InputRightElement,
    FormControl,
    FormLabel,
    Flex,
    useToast,
} from '@chakra-ui/react';
import { useState, useReducer } from 'react';
import { generateRandomPassword } from './utils';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'

// Define the initial login state
interface LoginState {
    email: string;
    password: string;
}

const initialLoginState: LoginState = {
    email: '',
    password: '',
};

// Define login actions
type LoginAction =
    | { type: 'SET_EMAIL'; payload: string }
    | { type: 'SET_PASSWORD'; payload: string };

// Create a reducer to handle login state updates
const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
    switch (action.type) {
        case 'SET_EMAIL':
            return { ...state, email: action.payload };
        case 'SET_PASSWORD':
            return { ...state, password: action.payload };
        default:
            return state;
    }
};




const Login = () => {
    const [state, dispatch] = useReducer(loginReducer, initialLoginState);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [passwordPlaceholder] = useState<string>(generateRandomPassword(16));

    const toast = useToast()
    const navigavte = useNavigate();
    function loginHandler() {
        toast({
            title: 'Welcome again!',
            status: 'success',
            duration: 9000,
            isClosable: true, 
            position: "top"

        })
        navigavte("/dashboard")

    }

    return (
        <Flex width={"full"} justifyContent={"center"} >

            <Stack width={540} spacing={4} alignItems={"center"}>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        variant="filled"
                        placeholder="name@domain.com"
                        isInvalid={!state.email}
                        value={state.email}
                        onChange={(e) =>
                            dispatch({ type: 'SET_EMAIL', payload: e.target.value })
                        }
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="md">
                        <Input
                            pr="4.5rem"
                            type={showPassword ? 'text' : 'password'}
                            placeholder={passwordPlaceholder}
                            value={state.password}
                            isInvalid={!state.password}
                            variant="filled"
                            onChange={(e) =>
                                dispatch({ type: 'SET_PASSWORD', payload: e.target.value })
                            }
                        />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button width="50%" colorScheme='green' type="submit" onClick={loginHandler}>Login</Button>
                <ChakraLink as={ReactRouterLink} to='/auth/signup'>
                    Already have an account?
                </ChakraLink>
            </Stack>
        </Flex>
    );
};

export default Login;
