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
import Redirect from "react-router-dom/es/Redirect";


function UploadFiles(props) {
    const classes = useStyles();
    const formData = new FormData;
    const token = localStorage.getItem("token")

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

    const selectFile = (event) => {
        let currentFile = event.target.files;
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

        UploadService.upload(currentFile, event.target.name, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
            .then(function (response) {
                setUploadedFiles(response.data);
                setUploadedFolder(response.data);
                setUploadedDrag(response.data);
                console.log(response)
                setProgress(0)
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    redirectToLogin(props) 
                }
            });
    };

    if (ifLogged() === true)
        return (
            <div>
                <Row>
                    <Col sm="6">
                        <Card body>
                            <CardText>{translate(('fileReason'))}</CardText>
                            <input className="buttonStyle" name="upload/files" type="file" multiple
                                   onChange={selectFile}/>
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
                            <CardText>{translate(('folderReason'))}</CardText>
                            <input className="buttonStyle" url="upload/dicom" type="file" onChange={selectFile}
                                   directory="" webkitdirectory=""
                                   mozdirectory=""
                                   multiple
                            />
                            <List className={classes.root} subheader={<li/>}>
                                <li className={classes.listSection}>
                                    <ul className={classes.ul}>
                                        {uploadedFolder.map((item) => (
                                            <ListItem>
                                                <ListItemText primary={`${item}`}/>
                                            </ListItem>
                                        ))}
                                    </ul>
                                </li>
                            </List>
                        </Card>
                    </Col>
                </Row>

                <Card className={classes.cardStyle}>
                    <Dropzone onDrop={handleDrop}>
                        {({getRootProps, getInputProps}) => (
                            <div{...getRootProps({className: "dropzone"})}>
                                <input {...getInputProps()} name="upload/all" onChange={selectFile.u} style={{
                                    height: "200px",
                                    width: "100%",
                                    visibility: "hidden",
                                    value: "value0,"
                                }}/>
                            </div>
                        )}
                    </Dropzone>

                </Card>
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
            </div>
        );
    else return (<Redirect
        to={{
            pathname: "/login",
        }}/>)
}

export default withRouter(UploadFiles);