import React, {useState} from "react";
import {Card, CardText, Col, Row} from "reactstrap";
import UploadService from "../../services/UploaderService";
import Dropzone from "react-dropzone";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {useStyles} from "../css/styles";
import {withRouter} from "react-router-dom";


function UploadFiles(props) {

    const formData = new FormData;
    const classes = useStyles();

    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadedFolder, setUploadedFolder] = useState([]);
    const [uploadedDrag, setUploadedDrag] = useState([]);
    const [fileInfos, setFileInfos] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const handleDrop = acceptedFiles =>
        setFileNames(acceptedFiles.map(file => file.name));


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

        UploadService.upload(currentFile, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
            .then(function (response) {
                console.log("RESPONSE", response)
                setUploadedFiles(response.data);
                setUploadedFolder(response.data);
                setUploadedDrag(response.data);
                setProgress(0)
            })
            .catch(function (error) {
                console.log(error.response.status)
                if (error.response.status === 401) {
                    redirectToLogin()

                }
            });
    };

    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login')
    }

    return (
        <div>
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
            <Row>
                <Col sm="6">
                    <Card body>
                        <CardText>Для завантаження файлів</CardText>
                        <input type="file" multiple onChange={selectFile}/>
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
                        <CardText>Для завантаження папок</CardText>
                        <input type="file" onChange={selectFile} directory="" webkitdirectory="" mozdirectory=""
                               multiple/>
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
                            <input {...getInputProps()} onChange={selectFile} style={{
                                height: "200px",
                                width: "100%",
                                visibility: "hidden",
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

        </div>
    );
};

export default withRouter(UploadFiles);