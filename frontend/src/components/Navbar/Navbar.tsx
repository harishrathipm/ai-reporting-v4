import MenuIcon from '@mui/icons-material/Menu';
import BrainIcon from '@mui/icons-material/Psychology';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { useRole } from '../../state/RoleContext';

const Navbar: React.FC = () => {
  const { selectedRole, availableRoles, setSelectedRole, isLoading } = useRole();

  const handleRoleChange = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <BrainIcon sx={{ mr: 1 }} />

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dynamic Reporting AI
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Queries</Button>
          <Button color="inherit">Settings</Button>

          {/* Role selector dropdown - Minimal styling */}
          <FormControl size="small" sx={{ ml: 2, minWidth: 120 }}>
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Select
                value={selectedRole}
                onChange={handleRoleChange}
                displayEmpty
                variant="outlined"
                color="primary"
              >
                {availableRoles.map(role => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
