import React, {useContext, useState} from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import PhoneInput from "react-phone-input-2";
import {withRouter} from "react-router-dom";
import {useDispatch} from 'react-redux';
import {store} from "../../redux/store"
import {savePhoneNumber} from "../../redux/actions"
import {API_BASE_URL} from "../../constants/apiContants";
import {I18nContext} from "../../i18n";
import {redirectToUpload, redirectToLogin} from "../../redirect/redirect"
import Loader from 'react-loader-spinner'


let today = new Date();
today = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-"
    + String(today.getDate()).padStart(2, '0')


function RegistrationForm(props) {
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
        buttonLabel: translate(('getCode')),
        disabled: false,
        hidden: true,
        loaderHidden: true,
        successMessage: null
    })


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
                    buttonDisabled: true
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

    const handleChangeLoader = () => {
        setState(prevState => (
            {
                ...prevState,
                loaderHidden: false
            }))
    }

    const getToken = () => {
        handleChangeLoader()
        let payload = {
            "username": state.username
        }
        axios.post(API_BASE_URL + state.url, payload)
            .then(function () {
                setChecked(true);
                setState(prevState => (
                    {
                        ...prevState,
                        hidden: false,
                        buttonDisabled: true,
                        url: "auth/signup",
                        'successMessage': translate(('sentCode')),
                        disabled: true,
                        buttonLabel: translate(('signUp'))
                    }
                ))
            })
            .catch(function (error) {
                if (error.response.status === 409) {
                    dispatch(savePhoneNumber(state.username))
                    console.log(state.username)
                    props.showError(translate(('error_409')))
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
                        'successMessage': 'Ви були успішно зареєстровані'
                    }
                ))
                localStorage.setItem("token", response.data.accessToken)
                redirectToUpload(props);
            })
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (checked) {
            signUp()
        } else {
            getToken()
        }
    }

    return (
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
                           required="true"
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
                           required="true"
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
                           required="true"
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
                           required="true"
                    />
                </div>

                <div className="form-group text-left">
                    <label htmlFor="exampleInputPhone">{translate(('phoneNumber'))}</label>
                    <PhoneInput
                        country={'ua'}
                        value={state.username}
                        onChange={handleChangePhoneNumber}
                        buttonDisabled={state.disabled}
                        required="true"
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
                           required="true"
                    />
                </div>

                <button
                    type="submit"
                    className="buttonStyle"
                    onClick={handleSubmitClick}
                    disabled={!state.lastName || !state.firstName || !state.middleName || !state.dateOfBirth || state.buttonDisabled}
                >
                    {state.buttonLabel}
                </button>
            </form>


            <div
                onChange={handleChangeLoader}>
                {state.loaderHidden ? null
                    : <Loader
                        type="TailSpin"
                        color="#3f51b5"
                        height={100}
                        width={50}
                        timeout={800}
                    />}

            </div>

            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none'}}
                 role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>{translate(('question'))}</span>
                <span className="loginText" onClick={() => redirectToLogin(props)}> {translate(('signIn'))}</span>
            </div>

            <div className="mt-2">
                <span className="sentCode" hidden={state.hidden}
                      onClick={() => getToken()}> {translate(('noCode'))}</span>
            </div>

        </div>
    )
}

export default withRouter(RegistrationForm);

