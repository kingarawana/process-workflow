import { createRoot } from 'react-dom/client';
import App from './App';

import './index.css';
import {ChakraProvider} from "@chakra-ui/react";
import {customTheme} from "./theme";
import { defaultSystem } from "@chakra-ui/react"
import {ReactFlowProvider} from "@xyflow/react";

const container = document.querySelector('#app');
const root = createRoot(container);

root.render(
    <ChakraProvider value={defaultSystem}>
        <ReactFlowProvider>
            <App />
        </ReactFlowProvider>
    </ChakraProvider>
);
