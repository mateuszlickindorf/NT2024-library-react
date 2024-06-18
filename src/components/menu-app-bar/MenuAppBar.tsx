import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import {AccountCircle, Home} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";


export default function MenuAppBar() {
    const navigate = useNavigate();
    //const {t} = useTranslation();      {t('library')}

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => navigate("/home")}
                    sx={{ mr: 2 }}
                >
                    <Home />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Bilbioteka
                </Typography>
                <Box>
                    <IconButton
                        size="large"
                        color="inherit"
                        aria-label="account"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={() => navigate("/home")}
                        sx={{ mr: 2 }}
                    >
                        <AccountCircle />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
