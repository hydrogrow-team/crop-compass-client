import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useSteps,
  useToast,
} from '@chakra-ui/react';
import {
  type ReactElement,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { Link as ChakraLink } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { generateRandomPassword } from './utils';

interface SignUpState {
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirm_password: string | undefined;
  location: {
    latitude: number | undefined;
    longitude: number | undefined;
  };
}

const initialState: SignUpState = {
  username: undefined,
  email: undefined,
  password: undefined,
  confirm_password: undefined,
  location: {
    longitude: undefined,
    latitude: undefined,
  },
};
interface SignUpErrorsState {
  username: boolean;
  email: boolean;
  password: boolean;
  confirm_password: boolean;
  location: {
    longitude: boolean;
    latitude: boolean;
  };
}

const initialErrorsState: SignUpErrorsState = {
  username: false,
  email: false,
  password: false,
  confirm_password: false,
  location: {
    longitude: false,
    latitude: false,
  },
};
type Action =
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
  | { type: 'SET_LOCATION_LONGITUDE'; payload: number }
  | { type: 'SET_LOCATION_LATITUDE'; payload: number }
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
    case 'SET_LOCATION_LONGITUDE':
      return {
        ...state,
        location: { ...state.location, longitude: action.payload },
      };
    case 'SET_LOCATION_LATITUDE':
      return {
        ...state,
        location: { ...state.location, latitude: action.payload },
      };
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
  title: string;
  description: string;
  element: ReactElement;
  index: number;
  are_inputs_valid: () => boolean;
};

const SignUp = () => {
  const [state, dispatch] = useReducer(signUpReducer, initialState);

  const [errors, setErrors] = useState<SignUpErrorsState>(initialErrorsState);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        dispatch({ type: 'SET_LOCATION_LONGITUDE', payload: longitude });
        dispatch({ type: 'SET_LOCATION_LATITUDE', payload: latitude });
      },
      (_err) => {},
    );
  }, []);

  const steps: Array<StepPref> = [
    {
      title: 'Username',
      description: 'Setup your username',
      index: 0,
      element: <Username />,
      are_inputs_valid: () => {
        const validPattern = /^[a-zA-Z0-9_]+$/g;
        const username = state.username;
        if (typeof username === 'string') {
          if (
            username.length < 3 ||
            username.length > 20 ||
            !validPattern.test(username) ||
            username.trim() !== username
          ) {
            setErrors({ ...errors, username: true });
            return false;
          }
          setErrors({ ...errors, username: false });
          return true;
        }
        return false;
      },
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

        if (
          typeof email === 'string' &&
          typeof password === 'string' &&
          typeof confirm_password === 'string'
        ) {
          // Email validation
          const emailPattern =
            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g;
          if (!emailPattern.test(email)) {
            setErrors((prev) => ({ ...prev, email: true }));
            return false;
          }
          setErrors((prev) => ({ ...prev, email: false }));

          // Password validation
          const isPasswordValid =
            password.length >= 8 &&
            /[A-Z]/g.test(password) && // At least one uppercase
            /[a-z]/g.test(password) && // At least one lowercase
            /[0-9]/g.test(password) &&
            /[\W_]/g.test(password); // At least one number

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
      },
    },
    {
      title: 'Location Setup',
      description: 'Setup the location of your farm land',
      index: 2,
      element: <Location />,
      are_inputs_valid: () => {
        const { longitude, latitude } = state.location;

        const isValidNumber = (value, field: string) => {
          if (typeof value === 'undefined' || typeof value !== 'number') {
            setErrors({
              ...errors,
              location: { ...errors.location, [field]: true },
            });
            return false;
          }
          setErrors({
            ...errors,
            location: { ...errors.location, [field]: false },
          });
          return true;
        };
        const isLongitudeValid = isValidNumber(longitude, 'longitude');
        const isLatitudeValid = isValidNumber(latitude, 'latitude');

        return isLongitudeValid && isLatitudeValid;
      },
    },
  ];

  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });

  const isLastStep = activeStep === steps.length - 1;

  const [disableNext, setDisableNext] = useState<boolean>(false);
  useEffect(() => {
    if (steps[activeStep].are_inputs_valid()) {
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
  }, [state, activeStep]);

  const toast = useToast();
  const navigate = useNavigate();
  function finishHandler() {
    const { longitude, latitude } = state.location;
    if (typeof longitude === 'number' && typeof latitude === 'number') {
      // Save longitude and latitude as a JSON string in localStorage
      localStorage.setItem('location', JSON.stringify({ longitude, latitude }));
    } else {
    }

    toast({
      title: 'Account created.',
      description: "We've created your account for you.",
      status: 'success',
      duration: 9000,
      isClosable: true,
      position: 'top',
    });
    navigate('/dashboard');
    // redirect("/dashboard")
  }

  const isAuthenticated = false;

  if (isAuthenticated) {
    navigate('/dashboard');
  }

  return (
    <SignUpContext.Provider value={{ state, dispatch, errors }}>
      <Stack alignItems={'center'} spacing={20}>
        <Heading>Create your account</Heading>
        <Stack alignItems={'center'} spacing={16} width={'full'}>
          <Box width={'full'}>
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

                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box maxW="300px" w="full">
            {steps[activeStep].element}
          </Box>
          H
        </Stack>
        <HStack width="full" justifyContent="space-between">
          {activeStep !== 0 ? (
            <Button colorScheme="green" onClick={goToPrevious}>
              Previous
            </Button>
          ) : (
            <div />
          )}
          {isLastStep ? (
            <Button
              onClick={finishHandler}
              isDisabled={disableNext}
              colorScheme="green"
            >
              Done
            </Button>
          ) : (
            <Button
              isDisabled={disableNext}
              colorScheme="green"
              onClick={goToNext}
            >
              Next
            </Button>
          )}
        </HStack>
        <ChakraLink as={ReactRouterLink} to="/auth/login">
          Already have an account?
        </ChakraLink>
      </Stack>
    </SignUpContext.Provider>
  );
};

function Username() {
  const { dispatch, state, errors } = useContext(SignUpContext);

  return (
    <FormControl isInvalid={!errors.username}>
      <FormLabel>Username</FormLabel>
      <Input
        width={'full'}
        type="text"
        isInvalid={errors.username}
        variant="filled"
        placeholder="Username"
        onChange={(e) =>
          dispatch({ type: 'SET_USERNAME', payload: e.target.value })
        }
        value={state.username}
      />
      {!errors.username ? (
        <FormHelperText>Enter your username.</FormHelperText>
      ) : (
        <FormErrorMessage>Username is required.</FormErrorMessage>
      )}
    </FormControl>
  );
}

function Authentication() {
  const { state, dispatch, errors } = useContext(SignUpContext);
  const [show_password, setShowPassword] = useState(false);
  const [show_confirm_password, setShowConfirmPassword] = useState(false);

  const [password_placeholder] = useState<string>(generateRandomPassword(16));

  return (
    <Stack>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          variant="filled"
          placeholder="name@domain.com"
          isInvalid={errors.email}
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
            type={show_password ? 'text' : 'password'}
            value={state.password}
            placeholder={password_placeholder}
            isInvalid={errors.password}
            variant={'filled'}
            onChange={(e) =>
              dispatch({ type: 'SET_PASSWORD', payload: e.target.value })
            }
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword(!show_password)}
            >
              {show_password ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Confirm your password</FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show_confirm_password ? 'text' : 'password'}
            isInvalid={errors.confirm_password}
            placeholder={password_placeholder}
            value={state.confirm_password}
            variant={'filled'}
            onChange={(e) =>
              dispatch({
                type: 'SET_CONFIRM_PASSWORD',
                payload: e.target.value,
              })
            }
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowConfirmPassword(!show_confirm_password)}
            >
              {show_confirm_password ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormHelperText>
          <Text>Password:</Text>
          <List paddingLeft={4}>
            <ListItem>must be at least 8 characters long.</ListItem>
            <ListItem>must contain least one uppercase letter.</ListItem>
            <ListItem>must contain least one lowercase letter.</ListItem>
            <ListItem>must contain least one special character.</ListItem>
          </List>
        </FormHelperText>
      </FormControl>
    </Stack>
  );
}

function Location() {
  const { state, dispatch, errors } = useContext(SignUpContext);

  return (
    <FormControl
      isInvalid={errors.location.latitude || errors.location.longitude}
      w="full"
    >
      <Stack w="full">
        <Stack w="full">
          <FormLabel>Longitude</FormLabel>
          <NumberInput
            w="full"
            allowMouseWheel
            step={0.00001}
            max={180}
            min={-180}
            keepWithinRange
            isInvalid={errors.location.longitude}
            variant="filled"
            _placeholder="Longitude of your location"
            value={state.location.longitude ?? 0}
            onChange={(value) =>
              dispatch({
                type: 'SET_LOCATION_LONGITUDE',
                payload: Number(value),
              })
            }
          >
            <NumberInputField w="full" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Stack>

        <Stack spacing={1} w="full">
          <FormLabel>Latitude</FormLabel>
          <NumberInput
            w="full"
            allowMouseWheel
            step={0.00001}
            max={90}
            min={-90}
            keepWithinRange
            isInvalid={errors.location.latitude}
            variant="filled"
            _placeholder="Latitude of your location"
            value={state.location.latitude ?? 0}
            onChange={(value) =>
              dispatch({
                type: 'SET_LOCATION_LATITUDE',
                payload: Number(value),
              })
            }
          >
            <NumberInputField w="full" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Stack>
      </Stack>
      {!(errors.location.latitude || errors.location.longitude) ? (
        <FormHelperText>
          Enter your specific location. Your location is detected automatically,
          or you can change it by hand
        </FormHelperText>
      ) : (
        <FormErrorMessage>Location is required.</FormErrorMessage>
      )}
    </FormControl>
  );
}

export default SignUp;
