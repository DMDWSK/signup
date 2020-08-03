import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 150,
        minHeight:50,
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
    cardStyle:{
        borderStyle: 'dotted',
        borderWidth: 5,
        borderRadius: 6,
        height:"200px",
        width:"100%",
        cursor: "pointer"
    },
    cardInput:{
            height:"200px",
            width:"100%",
            visibility: "hidden"
    },
    dragUpload:{
        width: '100%',
        // maxWidth: 360,
        // backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 150,
        minHeight:50,

    }
}));