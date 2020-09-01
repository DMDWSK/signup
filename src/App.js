import React, {useState} from 'react';
import './App.css';
import Header from './components/HeaderComponent/Header';
import LoginForm from './components/LoginComponent/LoginForm';
import RegistrationForm from './components/RegistrationComponent/RegistrationForm';
import UploadFiles from "./components/UploaderComponent/Uploader";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Questionnaire from "./components/QuestionnaireComponent/Questionnaire";
import {NotificationContainer} from "react-notifications";


function App() {
    const [title, updateTitle] = useState(null);

    return (
        <Router>
            <div className="App">
                <Header title={title}/>
                <div className="container d-flex align-items-center flex-column">
                    <Switch>
                        <Route path="/" exact={true}>
                            <RegistrationForm  updateTitle={updateTitle}/>
                        </Route>
                        <Route path="/register">
                            <RegistrationForm updateTitle={updateTitle}/>
                        </Route>
                        <Route path="/login">
                            <LoginForm updateTitle={updateTitle}/>
                        </Route>
                        <Route path="/upload">
                            <UploadFiles  updateTitle={updateTitle}/>
                        </Route>
                        <Route path="/questionnaire">
                            <Questionnaire updateTitle={updateTitle}/>
                        </Route>
                    </Switch>
                </div>
                <NotificationContainer/>
            </div>
        </Router>
    );
}

export default App;
