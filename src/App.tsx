import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import './App.scss';
import PackageList from './components/package-list/PackageList';
import PackageDetail from './components/package-detail/PackageDetail';
import Sidebar from './components/sidebar/Sidebar';
import MenuIcon from './assets/menu.png';
import { CustomIconButton } from './shared/CustomIconButton';
import { DrawerHeader } from './shared/DrawerHeader';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  background: '#011627',
  boxShadow: 'none',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),

  '& .MuiToolbar-root': {
    borderBottom: '1px solid #1E2D3D',
    fontFamily: `'Fira Code', monospace`,
  },

  '& .MuiTypography-root': {
    fontFamily: `'Fira Code', monospace`,
  },
}));

function App() {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen((prev: boolean) => !prev);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <CustomIconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <img src={MenuIcon} alt="Menu" width="20" />
          </CustomIconButton>
          <Typography variant="h6" noWrap component="div">
            poetry.lock parser
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <Main open={true}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element={<PackageList />} />
          <Route path="/:name" element={<PackageDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Main>
    </Box>
  );
}

export default App;
