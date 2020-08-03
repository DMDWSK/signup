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


let today = new Date();
today = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-"
    + String(today.getDate()).padStart(2, '0')


const isEmpty = (value) => {
    return value === 0;

}

function RegistrationForm(props)  {
    const { translate } = useContext(I18nContext);
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
        payload: {
            "username": ""
        },
        url: "auth/token",
        disabled: false,
        buttonDisabled: true,
        hidden: true,
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

        state.username = value

    }

    const handleChangeInitials = (event) => {
        if ((!isEmpty(event.target.value.length))) {
            if (event.target.value.match("^[аА-яЯєЄіIїЇґҐa-zA-Z]*$") != null) {
                const {id, value} = event.target
                setState(prevState => ({
                    ...prevState,
                    [id]: value.charAt(0).toUpperCase() + value.slice(1),
                    buttonDisabled: false,
                }))
                setState(prevState => ({
                    ...prevState,
                    buttonDisabled: false,
                }))
            }
        } else {
            setState(prevState => ({
                ...prevState,
                buttonDisabled: true,
            }))
        }
    }

    const handleUserEmail = (event) => {
        // if (event.target.value.match("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,})+$")!= null) {
        const {id, value} = event.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
        // }
    }

    const handleChangeCode = (event) => {
        const {id, value} = event.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const redirectToUpload = () => {
        props.updateTitle('Upload')
        props.history.push('/upload')
    }

    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login');
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
            .then(function () {
                setState(prevState => (
                    {
                        ...prevState,
                        url: "auth/signup",
                        'successMessage': 'Ви були успішно зареєстровані'
                    }
                ))
                redirectToUpload();
            })
            .catch(function (error) {
                if (error.response.status === 409) {
                    dispatch(savePhoneNumber(state.payload.username))
                    props.showError("Даний номер телефону зареєстрований у нашій базі. Увійдіть!")
                    redirectToLogin();
                }
            });
    }

    const getToken = () => {

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
                        disabled: true,
                        url: "auth/signup",
                        'successMessage': 'Вам надіслано код на ваш номер телефону'
                    }
                ))
            })
            .catch(function (error) {
                if (error.response.status === 409) {
                    dispatch(savePhoneNumber(state.payload.username))
                    props.showError("Даний номер телефону зареєстрований у нашій базі. Увійдіть!")
                    redirectToLogin();

                }
            });

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
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                {/*<LanguageSelect />*/}
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
                        disabled={state.disabled}
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
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                    // disabled={state.buttonDisabled}
                >
                    {translate(('signUp'))}
                </button>

            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none'}}
                 role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>{translate(('question'))}</span>
                <span className="loginText" onClick={() => redirectToLogin()}> {translate(('signIn'))}</span>
            </div>

        </div>
    )
}

export default withRouter(RegistrationForm);

