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

export type RangeDataType = { downloads: number; day: string };
export type AppContextStateType = {
  status: States; // not-loaded in flag to use server side fetched data
  range: string;
  package: string;
  total: number;
  data?: RangeDataType[];
  message?: string;
};
type ReplaceAllType = {
  type: "replace-all";
  payload: Partial<AppContextStateType>;
};
type LoadingType = {
  type: "loading";
  payload?: Partial<AppContextStateType>;
};
type ErrorType = {
  type: "error";
  payload?: { message: string };
};
type AppActionsType = ReplaceAllType | LoadingType | ErrorType;
type AppContextType = {
  state: AppContextStateType;
  dispatch: Dispatch<AppActionsType>;
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
        message: "",
      };
    case "loading":
      return {
        ...state,
        status: States.LOADING,
        message: "",
      };
    case "error":
      return {
        ...state,
        data: [],
        total: 0,
        package: "",
        status: States.ERROR,
        message: action.payload?.message,
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
