import { createContext } from 'react';
import { LibraryClient } from './library-client';
import {useContext} from "react";

const ApiContext = createContext(new LibraryClient());

export default function ApiProvider({children,}: {
    children: React.ReactNode;
}) {
    const apiClient = new LibraryClient();
    const ourClient = useContext(ApiContext);
    return (
        <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
    );
}

export function useApi() {
    return useContext(ApiContext);
}

