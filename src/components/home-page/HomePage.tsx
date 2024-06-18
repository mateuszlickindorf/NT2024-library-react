import { Box, Button } from '@mui/material';
import MenuAppBar from '../menu-app-bar/MenuAppBar';
import { Link, Outlet } from "react-router-dom";
import {useApi} from "../../api/ApiProvider";

function HomePage() {
    const apiClient = useApi();
    apiClient.getBooks().then((response) =>
        console.log(response)
    )
    return (
        <Box sx={{ flexGrow: 1 }}>
            <MenuAppBar />
            <Box>
                <Button variant="contained" component={Link} to="books" sx={{ m: 1 }}>
                    Moje Książki
                </Button>
                <Button variant="contained" component={Link} to="loans" sx={{ m: 1 }}>
                    Moje wypożyczenia
                </Button>
            </Box>
            <Outlet />
        </Box>
    );
}

export default HomePage;