import React from 'react';
import clsx from 'clsx';
import {useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {useStyles} from "../../styles/styles";
import "./Header.css"
import LanguageSelect from "../LanguageSelectComponent/LanguageSelect";
import {withRouter} from "react-router-dom";
import {Link} from "react-router-dom";


function Header(props) {
    const classes = useStyles()
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const token = localStorage.getItem("token")

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token")
        props.history.push("/login")
    }

    function SideBar(props) {
        if ((token)) {
            return <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
            >
                <MenuIcon/>
                <button onClick={logout}>LogOUT</button>
            </IconButton>

        } else return <div/>
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const redirectToUpload = () => {
        props.updateTitle('Upload')
        props.history.push('/upload');
    }

    return (
        <div className={classes.root} id="root">
            <CssBaseline/>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <SideBar/>
                    <div className="angelholmName">
                        <Typography variant="h5" noWrap>
                            Angelholm
                        </Typography>
                    </div>
                    <div className="language">
                        <LanguageSelect/>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    <ListItem button component={Link} to="/questionnaire">
                        <ListItemText primary="Questionnaire"/>
                    </ListItem>
                    <ListItem button component={Link} to="/upload">
                        <ListItemText primary="Upload"/>
                    </ListItem>
                </List>
                <Divider/>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
            </main>
        </div>
    );
}

export default withRouter(Header);