import React, {useContext, useState} from 'react';
import axios from 'axios';
import './LoginForm.css';
import {withRouter} from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import {useDispatch, useSelector} from "react-redux";
import {API_BASE_URL} from "../../constants/apiContants";
import {I18nContext} from "../../i18n";
import {savePhoneNumber} from "../../redux/actions";
import { Redirect } from "react-router-dom";
import {redirectToRegister, redirectToUpload} from "../../redirect/redirect"
import RefreshIcon from '@material-ui/icons/Refresh';


function LoginForm(props) {
    const token = localStorage.getItem("token")
    const {translate} = useContext(I18nContext);
    const value = useSelector(state => state.phone[0])
    const [checked, setChecked] = useState(false);
    const [state, setState] = useState({
        username: "",
        password: "",

        payload: {
            "username": ""
        },
        url: "auth/token/signin",
        disabled: false,
        buttonDisabled: true,
        hidden: true,
        buttonLabel: translate(('getCode')),
        successMessage: null
    })

    function ifLogged() {
        let url = window.location.href.split('/').slice(-1)[0]
        return !(url === "login" && token);
    }

    const handleChangePhoneNumber = (value) => {
        if (value.length < 12) {
            console.log(state.disabled)
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
                        'successMessage': translate(('sentCode')),
                        buttonLabel: translate(('signIn'))
                    }
                ))
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    props.showError(translate(('error_401')))

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

    const handleRefresh = (e) => {
        console.log("REFRESH")
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
                successMessage: null
            }
        ));
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

            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none'}}
                 role="alert">
                {state.successMessage}
            </div>
            <div className="registerMessage">
                <span>{translate(('question2'))}</span>
                <span className="loginText" onClick={() => redirectToRegister(props)}> {translate(('signUp'))}</span>
            </div>
            <div className="mt-2">
                <span className="sentCode" hidden={state.hidden}
                      onClick={() => getToken()}> {translate(('noCode'))}</span>
            </div>
        </div>
    )
    else return (<Redirect
        to={{
            pathname: "/upload",
        }}/>)

}


export default withRouter(LoginForm);