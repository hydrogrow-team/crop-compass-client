import { Heading, Image, HStack, Highlight, Stack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';



const Home = () => {
  const navigate = useNavigate()
  return (

    <HStack width={"full"} height={"full"} justifyItems={"center"} alignItems={"center"} spacing={10}>
      <Stack>

        <Heading lineHeight='tall'>
          <Highlight
            query={['future']}
            styles={{ px: '2', py: '1', rounded: '5px', bg: 'green.100', textTransform: "uppercase" }}
          >
            Your future is coming!
          </Highlight>
          <br />
          Make your farm land ready for increase its productivity!
        </Heading>

        <Button colorScheme='green' size='lg' onClick={() => navigate("/auth/signup")}>
          Getting Started now!
        </Button>
      </Stack>

      <Image width={"40%"} src="/assets/wall.jpg" />
    </HStack>
  );
};

export default Home;
