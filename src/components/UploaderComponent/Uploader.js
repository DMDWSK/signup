import React, {useContext, useState} from "react";
import {Card, Col, Row} from "reactstrap";
import UploadService from "../../services/UploaderService";
import List from '@material-ui/core/List';
import {useStyles} from "../../styles/styles";
import {Redirect, withRouter} from "react-router-dom";
import {I18nContext} from "../../i18n";
import Toast from 'react-bootstrap/Toast'
import ToastHeader from 'react-bootstrap/ToastHeader'
import './Uploader.css';
import 'react-notifications/lib/notifications.css';
import 'react-notifications-component/dist/theme.css'
import {getToken} from "../../token/tokenOperations";


function UploadFiles() {
    const classes = useStyles();
    const formData = new FormData;
    const token = getToken();
    const [notification, setNotification] = useState(true);
    const [hiddenProgress, setHideProgress] = useState(false)

    const {translate} = useContext(I18nContext);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadedFolder, setUploadedFolder] = useState([]);

    function ifLogged() {
        return !!token;
    }

    const selectFile = (e, url, array = []) => {
        let currentFile = e.target.files;
        let uploadedData = formData.getAll('file');
        uploadedData.forEach(function (item, index, object) {
            if (item.size > 50) {
                object.splice(index, 1)
                currentFile = object
            } else {
                currentFile = uploadedData;
            }
        })
        setHideProgress(false);
        setNotification(true)
        setCurrentFile(currentFile);

        UploadService.upload(currentFile, url, (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
        })
            .then(function (response) {
                Object.values(response.data).forEach(value => {
                    array.push(value)
                })
                setHideProgress(true);
                setProgress(0)
            })
    };

    const hideNotification = () => setNotification(!notification);

    if (ifLogged() === true)
        return (
            <div>
                <Row>
                    <Col sm="6">
                        <Card body>
                            <label className="labelUpload" htmlFor="fileUpload">
                                {translate(('uploadFile'))}
                            </label>
                            <input className="uploadButton" type="file" multiple
                                   id="fileUpload"
                                   onChange={e => selectFile(e, "upload/files", uploadedFiles, setUploadedFiles)}/>
                            <List className={classes.root} subheader={<li/>}>
                                <li className={classes.listSection}>
                                    <ul className={classes.ul}>
                                        {uploadedFiles.map((item) => (
                                            <Col xs={20}>
                                                <Toast show={notification} onClose={hideNotification}
                                                       className="toastCard">
                                                    <ToastHeader/>
                                                    <Toast.Body>
                                                        <p>{`${(item)}`}</p>
                                                    </Toast.Body>
                                                </Toast>
                                            </Col>
                                        ))}
                                    </ul>
                                </li>
                            </List>
                        </Card>
                    </Col>

                    <Col sm="6">
                        <Card body>
                            <label className="labelUpload" htmlFor="folderUpload">
                                {translate(('uploadFolder'))}
                            </label>
                            <input className="uploadButton" type="file"
                                   id="folderUpload"
                                   onChange={e => selectFile(e, "upload/dicom", uploadedFolder, setUploadedFolder)}
                                   directory="" webkitdirectory=""
                                   mozdirectory=""
                                   multiple
                            />
                            <List className={classes.root} subheader={<li/>}>
                                <li className={classes.listSection}>
                                    <ul className={classes.ul}>
                                    </ul>
                                </li>
                            </List>
                            {uploadedFolder.map((item) => (
                                <Col xs={20}>
                                    <Toast show={notification} onClose={hideNotification}
                                           className="toastCard">
                                        <ToastHeader>
                                            <strong className="mr-auto">{`${Object.values(item)[5]}`}</strong>
                                        </ToastHeader>
                                        <Toast.Body>
                                            <div className="row">
                                                <div className="column">
                                                    <p>{`${Object.keys(item)[0]}`}</p>
                                                    <p>{`${Object.keys(item)[1]}`}</p>
                                                    <p>{`${Object.keys(item)[2]}`}</p>
                                                    <p>{`${Object.keys(item)[3]}`}</p>
                                                    <p>{`${Object.keys(item)[4]}`}</p>
                                                </div>
                                                <div className="column">
                                                    <p>{`${Object.values(item)[0]}`}</p>
                                                    <p>{`${Object.values(item)[1]}`}</p>
                                                    <p>{`${Object.values(item)[2]}`}</p>
                                                    <p>{`${Object.values(item)[3]}`}</p>
                                                    <p>{`${Object.values(item)[4]}`}</p>
                                                </div>
                                            </div>
                                        </Toast.Body>
                                    </Toast>
                                </Col>
                            ))}
                        </Card>
                    </Col>
                </Row>
                {currentFile && (
                    <div className="progress"
                         hidden={hiddenProgress}>
                        <div
                            className="progress-bar progress-bar-info progress-bar-striped"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{width: progress + "%"}}
                        >
                            {progress}%
                        </div>
                    </div>
                )}
            </div>
        );
    else return (<Redirect
        to={{
            pathname: "/login",
        }}/>)
}

export default withRouter(UploadFiles);