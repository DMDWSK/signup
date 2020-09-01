import React, {useContext, useState} from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import PhoneInput from "react-phone-input-2";
import {withRouter} from "react-router-dom";
import {useDispatch} from 'react-redux';
import {savePhoneNumber} from "../../redux/actions"
import {API_BASE_URL} from "../../constants/apiContants";
import {I18nContext} from "../../i18n";
import {redirectToUpload, redirectToLogin} from "../../redirect/redirect"
import Loader from 'react-loader-spinner'
import RefreshIcon from "@material-ui/icons/Refresh";
import {Redirect} from "react-router-dom";
import {addToken, getToken} from "../../token/tokenOperations";
import {NotificationManager} from "react-notifications";



let today = new Date();
today = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-"
    + String(today.getDate()).padStart(2, '0')


function RegistrationForm(props) {
    const token = getToken()
    const {translate} = useContext(I18nContext);
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(false);
    const [state, setState] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        middleName: "",
        dateOfBirth: "",
        code: "",

        payload: {"username": ""},
        url: "auth/token/signup",
        buttonDisabled: true,
        disabled: false,
        hidden: true,
    })
    let buttonLabel = translate(('getCode'));

    function ifLogged() {
        let url = window.location.href.split('/').slice(-1)[0]
        return !(url === "" && token);
    }

    const handleChangeBirthDate = (event) => {
        const {id, value} = event.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleChangePhoneNumber = (value) => {
        if (value.length < 12) {
            setState(prevState => (
                {
                    ...prevState,
                    buttonDisabled: false
                }
            ));
        } else {
            setState(prevState => (
                {
                    ...prevState,
                    buttonDisabled: false,
                    username: value
                }
            ));
        }
    }

    const handleChangeInitials = (event) => {
        if (event.target.value.match("^[аА-яЯєЄіIїЇґҐa-zA-Z]*$") != null) {
            const {id, value} = event.target
            setState(prevState => ({
                ...prevState,
                [id]: value.charAt(0).toUpperCase() + value.slice(1),
                disabled: false,
            }))
        }
    }

    const handleUserEmail = (event) => {
        if (event.target.value.match("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,})+$") !== null) {
            setState(prevState => ({
                ...prevState,
                email: event.target.value,
            }))
        }
    }

    const handleChangeCode = (event) => {
        const {id, value} = event.target
        setState(prevState => ({
            ...prevState,
            buttonDisabled: false,
            [id]: value
        }))

    }

    const receiveToken = () => {
        setState(prevState => ({
            ...prevState,
            url: "auth/token/signup",
        }))
        let payload = {
            "username": state.username
        }
        axios.post(API_BASE_URL + state.url, payload)
            .then(function () {
                NotificationManager.success(translate(('sentCode')))
                buttonLabel = translate(('signUp'))
                setChecked(true);
                setState(prevState => (
                    {
                        ...prevState,
                        hidden: false,
                        buttonDisabled: true,
                        url: "auth/signup",
                        disabled: true,
                    }
                ))
            })
            .catch(function (error) {
                if (error.response.status === 409) {
                    dispatch(savePhoneNumber(state.username));
                    NotificationManager.error(translate(('error_401')))
                    redirectToLogin(props);

                }
            });
    }

    const signUp = () => {
        let payload = {
            "username": state.username,
            "email": state.email,
            "firstName": state.firstName,
            "lastName": state.lastName,
            "middleName": state.middleName,
            "dateOfBirth": state.dateOfBirth,
            "code": state.code
        };

        axios.post(API_BASE_URL + state.url, payload)
            .then(function (response) {
                setState(prevState => (
                    {
                        ...prevState,
                        url: "auth/signup",
                    }
                ))
                addToken(response.data.accessToken)
                redirectToUpload(props);
            })
    }

    const handleRefresh = (e) => {
        e.preventDefault();
        setChecked(false);
        setState(prevState => (
            {
                ...prevState,
                username: "",
                password: "",
                payload: {
                    "username": ""
                },
                url: "auth/token/signup",
                disabled: false,
                hidden: true,
            }
        ));
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (checked) {
            signUp()
        } else {
            receiveToken()
        }
    }

    if (ifLogged() === true) return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center" id="signUp">
            <div id="categoryName" className="card-header">{translate(('registration'))}</div>
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputLastName">{translate(('surname'))}</label>
                    <input type="text"
                           className="form-control"
                           id="lastName"
                           placeholder={translate(('enterSurname'))}
                           value={state.lastName}
                           onChange={handleChangeInitials}
                    />
                </div>

                <div className="form-group text-left">
                    <label htmlFor="exampleInputFirstName">{translate(('name'))}</label>
                    <input type="text"
                           className="form-control"
                           id="firstName"
                           placeholder={translate(('enterName'))}
                           value={state.firstName}
                           onChange={handleChangeInitials}
                    />
                </div>

                <div className="form-group text-left">
                    <label htmlFor="exampleInputMiddleName">{translate(('middleName'))}</label>
                    <input type="text"
                           className="form-control"
                           id="middleName"
                           placeholder={translate(('enterMiddleName'))}
                           value={state.middleName}
                           onChange={handleChangeInitials}
                    />
                </div>

                <div className="form-group text-left">
                    <label htmlFor="exampleInputBirthDateName">{translate(('birthDate'))}</label>
                    <input type="date"
                           className="form-control"
                           id="dateOfBirth"
                           value={state.dateOfBirth}
                           onChange={handleChangeBirthDate}
                           min="1900-01-01"
                           max={today}
                    />
                </div>

                <div className="form-group text-left">
                    <label htmlFor="exampleInputPhone">{translate(('phoneNumber'))}</label>
                    <PhoneInput
                        country={'ua'}
                        value={state.username}
                        onChange={handleChangePhoneNumber}
                        buttonDisabled={state.disabled}
                    />
                </div>

                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">{translate(('email'))}</label>
                    <input type="email"
                           className="form-control"
                           id="email"
                           aria-describedby="emailHelp"
                           placeholder={translate(('enterEmail'))}
                           value={state.email}
                           onChange={handleUserEmail}
                    />
                </div>

                <div className="form-group text-left"
                     hidden={state.hidden}>
                    <label htmlFor="exampleInputCode">{translate(('code'))}</label>
                    <input type="text"
                           className="form-control"
                           id="code"
                           placeholder={translate(('enterCode'))}
                           value={state.code}
                           onChange={handleChangeCode}
                    />
                </div>

                <button
                    type="submit"
                    className="buttonStyle"
                    onClick={handleSubmitClick}
                    disabled={!state.lastName || !state.firstName || !state.middleName || !state.dateOfBirth || state.buttonDisabled}
                >
                    {buttonLabel}
                </button>
            </form>

            <RefreshIcon
                className="refreshIcon"
                hidden={state.hidden}
                onClick={handleRefresh}
            />

            <div className="mt-2">
                <span>{translate(('question'))}</span>
                <span className="loginText" onClick={() => redirectToLogin(props)}> {translate(('signIn'))}</span>
            </div>
        </div>
    )
    else return (<Redirect
        to={{
            pathname: "/upload",
        }}/>)
}

export default withRouter(RegistrationForm);

