import { createContext, useContext, useMemo, useState } from "react";
import { Loader } from "../components";

type AppState = "loading" | "success" | "failure";

type LoadingContextFn = {
    appState: AppState;
    error: any;
    setLoadingState: (state: AppState, error?: any) => void;
};

const LoadingContext = createContext<LoadingContextFn>({
    appState: "success",
    error: undefined,
    setLoadingState: () => {}
});

export function LoadingProvider({ children }: React.PropsWithChildren<any>) {
    const value = useLoadingProvider();
    const shouldShowChildren = useMemo(() => value.appState !== "failure", [value.appState])
    return (
        <LoadingContext.Provider value={value}>
            {value.appState === "loading" && <Loader />}
            {!shouldShowChildren && (
                <div>
                    There was an error!
                    {value.error && <pre style={{ whiteSpace: "normal" }}>{value.error}</pre>}
                </div>
            )}
            {shouldShowChildren && children}
        </LoadingContext.Provider>
    );
}

export const useLoading = () => {
    return useContext(LoadingContext);
};

function useLoadingProvider(): LoadingContextFn {
    const [appState, setAppState] = useState<AppState>("success");
    const [error, setError] = useState<any>();
    
    const setLoadingState = (state: AppState, error?: any) => {
        setAppState(state);
        setError(error);
    }

    return {
        appState,
        error,
        setLoadingState,
    };
}
