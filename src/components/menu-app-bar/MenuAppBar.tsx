import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import {AccountCircle, Home} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {useNavigate} from "react-router-dom";

export default function MenuAppBar() {
    const navigate = useNavigate();
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
                    Library
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
