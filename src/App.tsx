import '@xyflow/react/dist/style.css';
import { Chart } from './components/Chart';
import { Box, Heading, Image } from '@chakra-ui/react';
import { Toaster } from './components/ui/toaster';

const App = () => {
  return (
    <>
      <Box display="flex" justifyContent="center" padding={4}>
        <Image src="./images/hadrian-logo.png" alt="logo" />
      </Box>
      <Box display="flex" justifyContent="center">
        <Heading size="3xl">Process Chart</Heading>
      </Box>
      <Chart />
      <Toaster />
    </>
  );
};

export default App;
