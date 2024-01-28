import {
  createContext,
  Dispatch,
  Reducer,
  useContext,
  useReducer,
} from "react";

export enum States {
  NOT_LOADED = "not-loaded",
  LOADING = "loading",
  LOADED = "loaded",
  ERROR = "error",
}
export type AppContextStateType = {
  status: States; // not-loaded in flag to use server side fetched data
  range: string;
  package: string;
  total: number;
  data?: { downloads: number; day: string }[];
};
type ReplaceAllType = {
  type: "replace-all";
  payload: Partial<AppContextStateType>;
};
type LoadingType = {
  type: "loading";
  payload?: Partial<AppContextStateType>;
};
type AppActionsType = ReplaceAllType | LoadingType;
type AppContextType = {
  state: AppContextStateType;
  dispatch: Dispatch<any>;
};

const defaultValue: AppContextStateType = {
  status: States.NOT_LOADED,
  range: "last month",
  package: "react",
  total: 0,
};

const AppContext = createContext<AppContextType>({
  state: defaultValue,
  dispatch: () => {},
});

function reducer(state: AppContextStateType, action: AppActionsType) {
  switch (action.type) {
    case "replace-all":
      return {
        ...state,
        ...action.payload,
      };
    case "loading":
      return {
        ...state,
        status: States.LOADING,
      };
    default:
      throw Error("Unknown action.");
  }
}

function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<
    Reducer<AppContextStateType, AppActionsType>
  >(reducer, defaultValue);
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
