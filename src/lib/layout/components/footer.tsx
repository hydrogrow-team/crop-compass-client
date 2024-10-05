import { Divider, Link, Stack, Text } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Stack
      as="footer"
      width="full"
      align="center"
      flexDirection={'column'}
      alignSelf="flex-end"
      justifyContent="center"
      spacing={10}
    >
      <Divider />
      <Text fontSize="xs">
        {new Date().getFullYear()} -{' '}
        <Link href="https://github.com/hydrogrow-team/" isExternal>
          HydroGrow
        </Link>
      </Text>
    </Stack>
  );
};
