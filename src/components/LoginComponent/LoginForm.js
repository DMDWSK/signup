import React, {useContext, useState} from 'react';
import axios from 'axios';
import './LoginForm.css';
import {withRouter} from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import {useDispatch, useSelector} from "react-redux";
import {API_BASE_URL} from "../../constants/apiContants";
import {I18nContext} from "../../i18n";
import {savePhoneNumber} from "../../redux/actions";
import {Redirect} from "react-router-dom";
import {redirectToRegister, redirectToUpload} from "../../redirect/redirect"
import RefreshIcon from '@material-ui/icons/Refresh';
import {addToken, getToken} from "../../token/tokenOperations";
import {NotificationManager} from 'react-notifications';
import Loader from "react-loader-spinner";


function LoginForm(props) {
    const token = getToken();
    let url = "auth/token/signin"
    const {translate} = useContext(I18nContext);
    const value = useSelector(state => state.phone[0])
    const [checked, setChecked] = useState(false);
    const [state, setState] = useState({
        username: "",
        password: "",

        disabled: false,
        buttonDisabled: true,
        hidden: true,
        buttonLabel: translate(('getCode')),
    })

    function ifLogged() {
        let url = window.location.href.split('/').slice(-1)[0]
        return !(url === "login" && token);
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

    const handleChangePassword = (event) => {
        const {id, value} = event.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }
    const resendCode = () => {
        receiveToken(url = "auth/token/signin");
    }
    const receiveToken = (url) => {
        let payload = {
            "username": state.username
        }
        axios.post(API_BASE_URL + url, payload)
            .then(function () {
                NotificationManager.success(translate(('sentCode')))
                setChecked(true);
                url = "auth/signin";
                setState(prevState => (
                    {
                        ...prevState,
                        hidden: false,
                        disabled: true,
                        buttonLabel: translate(('signIn'))
                    }
                ))
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    NotificationManager.error(translate(('error_401')))
                }
            });
    }

    const signIn = (url) => {
        let payload = {
            "username": state.username,
            "password": state.password
        };

        axios.post(API_BASE_URL + url, payload)
            .then(function (response) {
                addToken(response.data.accessToken);
                redirectToUpload(props);
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    NotificationManager.error(translate(('error_401')))

                }
            });
    }

    const handleRefresh = (e) => {
        e.preventDefault();
        setChecked(false);
        setState(prevState => (
            {
                ...prevState,
                password: "",
                payload: {
                    "username": ""
                },
                url: "auth/token/signin",
                disabled: false,
                hidden: true,
                buttonLabel: translate(('getCode')),
            }
        ));
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (checked) {
            signIn(url)
        } else {
            receiveToken(url)
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
                           value={state.password}
                           onChange={handleChangePassword}
                    />
                </div>

                <button
                    type="submit"
                    className="buttonStyle"
                    onClick={handleSubmitClick}
                    disabled={state.buttonDisabled}
                >{state.buttonLabel}
                </button>
            </form>

            <RefreshIcon
                className="refreshIcon"
                hidden={state.hidden}
                onClick={handleRefresh}
            />


            <div className="registerMessage">
                <span>{translate(('question2'))}</span>
                <span className="loginText" onClick={() => redirectToRegister(props)}> {translate(('signUp'))}</span>
            </div>
            <button
                className="buttonStyle"
                hidden={state.hidden}
                onClick={resendCode}
                disabled={state.buttonDisabled}
            >Код
            </button>
           
        </div>
    )
    else return (<Redirect
        to={{
            pathname: "/upload",
        }}/>)

}


export default withRouter(LoginForm);