import React, {useReducer} from "react";

import UA from "./ukrainian.json";
import US from "./english.json";

const translations = {
    US: US,
    UA: UA,
};

const getTranslate = langCode => key => translations[langCode][key] || key;
const initialState = {
    langCode: "UA",
    translate: getTranslate("UA"),
};
export const I18nContext = React.createContext(initialState);
export const I18nContextProvider = ({children}) => {

    const reducer = (state, action) => {
        switch (action.type) {
            case "setLanguage":
                return {
                    langCode: action.payload,
                    translate: getTranslate(action.payload),
                };
            default:
                return {...initialState};
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <I18nContext.Provider value={{...state, dispatch}}>
            {children}
        </I18nContext.Provider>
    );
};