import React from 'react';
import { withRouter } from "react-router-dom";
import LanguageSelect from "../LanguageSelectComponent/LanguageSelect";

function Header(props) {
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    const title = capitalize(props.location.pathname.substring(1,props.location.pathname.length))
    return(
        <nav className="navbar navbar-dark bg-primary">
            <div className="row col-12 d-flex justify-content-center text-white">
                {/*<span className="h3">{props.title || title}</span>*/}
                <span className="h3">Angelholm</span>
            </div>
            <LanguageSelect />
        </nav>

    )
}
export default withRouter(Header);