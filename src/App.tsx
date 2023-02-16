import * as React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Home } from './Home';

const _ = String.raw;

const theme = extendTheme({
  fonts: {
    body: `'UD デジタル 教科書体 N-R', sans-serif`,
    heading: `'UD デジタル 教科書体 N-R', sans-serif`,
    text: `'UD デジタル 教科書体 N-R', sans-serif`,
  },
});

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Home />
    </ChakraProvider>
  );
};
