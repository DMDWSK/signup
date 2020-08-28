import React, {useContext, useState} from "react";
import {Card, CardText, Col, Row} from "reactstrap";
import UploadService from "../../services/UploaderService";
import Dropzone from "react-dropzone";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {useStyles} from "../../styles/styles";
import {withRouter} from "react-router-dom";
import {redirectToLogin} from "../../redirect/redirect";
import {I18nContext} from "../../i18n";
import {Redirect} from "react-router-dom";
import {configureStore} from "@reduxjs/toolkit";
import Toast from 'react-bootstrap/Toast'
import ToastHeader from 'react-bootstrap/ToastHeader'


function UploadFiles(props) {
    const classes = useStyles();
    const formData = new FormData;
    const token = localStorage.getItem("token")
    const [showA, setShowA] = useState(true);

    const {translate} = useContext(I18nContext);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadedFolder, setUploadedFolder] = useState([]);
    const [uploadedDrag, setUploadedDrag] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const handleDrop = acceptedFiles =>
        setFileNames(acceptedFiles.map(file => file.name));

    function ifLogged() {
        return !!token;
    }


    const selectFile = (e, url, array = []) => {
        let currentFile = e.target.files;
        let uploadedData = formData.getAll('file');
        uploadedData.forEach(function (item, index, object) {
            if (item.size > 50000000000) {
                object.splice(index, 1)
                currentFile = object
            } else {
                currentFile = uploadedData;
            }
        })
        setProgress(0);
        setCurrentFile(currentFile);

        UploadService.upload(currentFile, url, (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
        })
            .then(function (response) {
                console.log(response)
                Object.values(response.data).forEach(value => {
                    array.push(value)
                })
                setProgress(0)
            })
            // .catch(function (error) {
            //     if (error.response.status === 401) {
            //         redirectToLogin(props)
            //     }
            // });
    };

    const toggleShowA = () => setShowA(!showA);

    if (ifLogged() === true)
        return (
            <div>
                <Row>
                    <Col sm="6">
                        <Card body>
                            <label className="labelUpload" htmlFor="fileUpload">
                                {translate(('uploadFile'))}
                            </label>
                            <input className="buttonStyle" type="file" multiple
                                   id="fileUpload"
                                   onChange={e => selectFile(e, "upload/files", uploadedFiles, setUploadedFiles)}/>
                            <List className={classes.root} subheader={<li/>}>
                                <li className={classes.listSection}>
                                    <ul className={classes.ul}>
                                        {uploadedFiles.map((item) => (
                                            <ListItem>
                                                <ListItemText primary={`${item}`}/>
                                            </ListItem>
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
                            <input className="buttonStyle" type="file"
                                   id="folderUpload"
                                   onChange={e => selectFile(e, "upload/dicom", uploadedFolder, setUploadedFolder)}
                                   directory="" webkitdirectory=""
                                   mozdirectory=""
                                   multiple
                            />
                            <List className={classes.root} subheader={<li/>}>
                                <li className={classes.listSection}>
                                    <ul className={classes.ul}>
                                        {uploadedFolder.map((item) => (
                                            <ListItem>
                                                <ListItemText primary={`${Object.keys(item)}`}/>
                                                <ListItemText primary={`${Object.values(item)}`}/>
                                            </ListItem>
                                            // console.log(item)
                                        ))}
                                    </ul>
                                </li>
                            </List>
                        </Card>
                    </Col>
                </Row>


                {/*<Card className={classes.cardStyle}>*/}
                {/*    <Dropzone onDrop={ha
                ndleDrop}>*/}
                {/*        {({getRootProps, getInputProps}) => (*/}
                {/*            <div{...getRootProps({className: "dropzone"})}>*/}
                {/*                <input {...getInputProps()}*/}
                {/*                       onChange={e => selectFile(e, "upload/all", uploadedDrag, setUploadedDrag)}*/}
                {/*                       style={{*/}
                {/*                           height: "200px",*/}
                {/*                           width: "100%",*/}
                {/*                           visibility: "hidden",*/}
                {/*                           value: "value0,"*/}
                {/*                       }}/>*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    </Dropzone>*/}

                {/*</Card>*/}
                <List className={classes.dragUpload} subheader={<li/>}>
                    <li className={classes.listSection}>
                        <ul className={classes.ul}>
                            {uploadedDrag.map((item) => (
                                <ListItem>
                                    <ListItemText primary={`${item}`}/>
                                </ListItem>
                            ))}
                        </ul>
                    </li>
                </List>
                {currentFile && (
                    <div className="progress">
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
                <Col xs={6}>
                    <Toast show={showA} onClose={toggleShowA}
                           className="toastCard">
                        <ToastHeader>


                            <strong className="mr-auto">Bootstrap</strong>
                            <small>11 mins ago</small>
                        </ToastHeader>
                        <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
                    </Toast>
                </Col>
                <Col xs={6}>
                    <button onClick={toggleShowA}>
                        Toggle Toast <strong>with</strong> Animation
                    </button>
                </Col>
            </div>
        );
    else return (<Redirect
        to={{
            pathname: "/login",
        }}/>)
}

export default withRouter(UploadFiles);