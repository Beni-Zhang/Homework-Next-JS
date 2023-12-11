import { ChakraProvider } from "@chakra-ui/react";
import { CSSReset } from "@chakra-ui/css-reset";

function MyApp({ Component, pageProps }) {
 return (
    <ChakraProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
 );
}

export default MyApp;