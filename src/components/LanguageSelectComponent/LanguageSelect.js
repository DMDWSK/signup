import React, {useContext} from "react";
import {I18nContext} from "../../i18n/index";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import "../../styles/sideBar.css"

const LanguageSelect = () => {

    const {dispatch} = useContext(I18nContext);
    const onLanguageSelect = e =>
        dispatch({type: "setLanguage", payload: e});


    return (
        <ReactFlagsSelect
            defaultCountry={"UA"}
            className="flag"
            onSelect={onLanguageSelect}
            countries={["US", "UA"]}
            showSelectedLabel={false}
        />
    );
};

export default LanguageSelect;