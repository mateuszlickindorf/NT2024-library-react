import { Box, Button } from '@mui/material';
import MenuAppBar from '../menu-app-bar/MenuAppBar';
import { Link, Outlet } from "react-router-dom";

function HomePage() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <MenuAppBar />
            <Box>
                <Button variant="contained" component={Link} to="books" sx={{ m: 1 }}>
                    My Books
                </Button>
                <Button variant="contained" component={Link} to="loans" sx={{ m: 1 }}>
                    My Loans
                </Button>
            </Box>
            <Outlet />
        </Box>
    );
}

export default HomePage;