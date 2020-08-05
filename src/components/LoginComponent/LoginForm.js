import React, {useContext, useState} from 'react';
import axios from 'axios';
import './LoginForm.css';
import {withRouter} from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import {useDispatch, useSelector} from "react-redux";
import {API_BASE_URL} from "../../constants/apiContants";
import {I18nContext} from "../../i18n";
import {savePhoneNumber} from "../../redux/actions";
import Redirect from "react-router-dom/es/Redirect";
import {redirectToRegister, redirectToUpload} from "../../redirect/redirect"


function LoginForm(props) {
    const token = localStorage.getItem("token")
    const {translate} = useContext(I18nContext);
    const value = useSelector(state => state.phone[0])
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(false);
    const [state, setState] = useState({
        username: "",
        password: "",
        payload: {
            "username": ""
        },
        url: "auth/token",
        disabled: false,
        hidden: true,
        buttonLabel: "Отримати код",
        successMessage: null
    })

    function ifLogged() {
        let url = window.location.href.split('/').slice(-1)[0]
        return !(url === "login" && token);
    }

    const handleChangePhoneNumber = (value) => {
        state.username = value
    }

    const handleChangePassword = (event) => {
        const {id, value} = event.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
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
                        url: "auth/signin",
                        'successMessage': 'Вам надіслано код на ваш номер телефону'
                    }
                ))
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    dispatch(savePhoneNumber(state.payload.username))
                    props.showError("Ви ввели неіснуючий номер.Перевірте будь ласка ще раз!")

                }
            });

    }


    const signIn = () => {
        let payload = {
            "username": state.username,
            "password": state.password
        };

        axios.post(API_BASE_URL + state.url, payload)
            .then(function (response) {
                setState(prevState => (
                    {
                        ...prevState,
                        url: "auth/signin",
                        'successMessage': 'Ви успішно увійшли'
                    }
                ))
                localStorage.setItem("token", response.data.accessToken)
                console.log(response.data.accessToken)
                redirectToUpload(props);
            })
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (checked) {
            signIn()
        } else {
            getToken()
        }
    }


    if (ifLogged() === true) return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <div id="categoryName" className="card-header">{translate(('login'))}</div>
            <form>
                <div className="form-group text-left">
                    <PhoneInput
                        country={'ua'}
                        value={value}
                        onChange={handleChangePhoneNumber}
                        disabled={state.disabled}
                    />
                </div>

                <div className="form-group text-left"
                     hidden={state.hidden}>
                    <label htmlFor="exampleInputPassword">{translate(('code'))}</label>
                    <input type="text"
                           className="form-control"
                           id="password"
                           placeholder="Введіть отриманий код"
                           value={state.password}
                           onChange={handleChangePassword}
                    />
                </div>

                <button
                    type="submit"
                    className="buttonStyle"
                    onClick={handleSubmitClick}
                >{translate(('getCode'))}
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none'}}
                 role="alert">
                {state.successMessage}
            </div>
            <div className="registerMessage">
                <span>{translate(('question2'))}</span>
                <span className="loginText" onClick={() => redirectToRegister(props)}> {translate(('signUp'))}</span>
            </div>
        </div>
    )
    else return (<Redirect
        to={{
            pathname: "/upload",
        }}/>)

}


export default withRouter(LoginForm);