import React, {useContext, useState} from 'react';
import axios from 'axios';
import './LoginForm.css';
import {withRouter} from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import {useSelector} from "react-redux";
import {API_BASE_URL} from "../../constants/apiContants";
import {I18nContext} from "../../i18n";


function LoginForm(props) {
    const { translate } = useContext(I18nContext);
    const value = useSelector(state => state.phone[0])
    const [state, setState] = useState({
        username: "",
        // code: "",
        // disabled: false,
        // hidden:true,
        buttonLabel: "Отримати код",
        successMessage: null
    })

    const handleChangePhoneNumber = (value) => {
        state.username = value
    }

    const sendDetailsToServer = () => {
        const payload = {
            "username": state.username,
            // "code": state.code,
        }
        axios.post(API_BASE_URL + "auth/signin", payload)
            .then(function (response) {
                setState(prevState => ({
                    ...prevState,
                    'successMessage': 'Вам надіслано код на ваш номер телефону'
                }))
                localStorage.setItem("token", response.data.accessToken);
                redirectToUpload();
                // else if (response.status === 200 && payload.code !== "") {
                //     setState(prevState => ({
                //         ...prevState,
                //         'successMessage': 'Ви успішно увйшли на сервіс'
                //     }))
                //     sessionStorage.setItem("token",response.data.accessToken)
                //     redirectToUpload();
                //     props.showError(null)
                // }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleChangeCode = (event) => {
        const {id, value} = event.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        setState(prevState => ({
            ...prevState,
            // disabled: true,
            // hidden: false,
            // buttonLabel: "Увійти"
        }))
        sendDetailsToServer()
    }
    const redirectToUpload = () => {
        props.updateTitle('Upload')
        props.history.push('/upload');
    }
    const redirectToRegister = () => {
        props.history.push('/register');
        props.updateTitle('Register');
    }
    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <PhoneInput
                        country={'ua'}
                        value={value}
                        onChange={handleChangePhoneNumber}
                        disabled={state.disabled}
                    />
                </div>

                {/*<div className="form-group text-left"*/}
                {/*     hidden={state.hidden}>*/}
                {/*    <label htmlFor="exampleInputCode">Код</label>*/}
                {/*    <input type="text"*/}
                {/*           className="form-control"*/}
                {/*           id="code"*/}
                {/*           placeholder="Введіть отриманий код"*/}
                {/*           value={state.code}*/}
                {/*           onChange={handleChangeCode}*/}
                {/*    />*/}
                {/*</div>*/}

                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >{state.buttonLabel}
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none'}}
                 role="alert">
                {state.successMessage}
            </div>
            <div className="registerMessage">
                <span>Досі не створили акаунт?</span>
                <span className="loginText" onClick={() => redirectToRegister()}>Реєстрація</span>
            </div>
        </div>
    )
}

export default withRouter(LoginForm);