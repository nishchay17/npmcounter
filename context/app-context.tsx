import { createContext, Dispatch, useContext, useReducer } from "react";

export type AppContextStateType = {
  status: "not-loaded" | "loading" | "loaded" | "error"; // not-loaded in flag to use server side fetched data
  range: string;
  package: string;
  total: number;
  data?: { downloads: number; day: string }[];
};
type ReplaceAllType = {
  type: "replace-all";
  payload: Partial<AppContextStateType>;
};
type AppActionsType = ReplaceAllType;
type AppContextType = {
  state: AppContextStateType;
  dispatch: Dispatch<any>;
};

const defaultValue: AppContextStateType = {
  status: "not-loaded",
  range: "last month",
  package: "react",
  total: 0,
};

const AppContext = createContext<AppContextType>({
  state: defaultValue,
  dispatch: () => {},
});

function reducer(state: AppContextStateType, action: AppActionsType) {
  if (action.type === "replace-all") {
    return {
      ...state,
      ...action.payload,
    };
  }
  throw Error("Unknown action.");
}

function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultValue);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
export default AppContextProvider;

export const useAppContext = () => {
  return useContext(AppContext);
};
