import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BrainIcon from '@mui/icons-material/Psychology';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <BrainIcon sx={{ mr: 1 }} />
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dynamic Reporting AI
        </Typography>
        
        <Box>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Queries</Button>
          <Button color="inherit">Settings</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;