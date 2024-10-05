import { Box, Flex } from '@chakra-ui/react';

import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';

export const Header = () => {
  return (
    <Flex
      as="header"
      width="full"
      align="center"
      alignSelf="flex-start"
      justifyContent="space-between"
      gridGap={2}
    >
      <Logo />
      <Box marginLeft="auto">
        <ThemeToggle />
      </Box>
    </Flex>
  );
};
