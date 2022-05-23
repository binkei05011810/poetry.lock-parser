import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Divider, Drawer, List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { RootState } from '../../redux/store';
import './Sidebar.scss';
import PackageIcon from '../../assets/package.png';
import PackagesIcon from '../../assets/packages.png';
import LeftArrowIcon from '../../assets/left-arrow.png';
import { CustomIconButton } from '../../shared/CustomIconButton';
import { DrawerHeader } from '../../shared/DrawerHeader';

const drawerWidth = 240;

const CustomDrawer = styled(Drawer)(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    background: '#011627',
    borderRight: '1px solid #1E2D3D',
    fontFamily: `'Fira Code', monospace`,
    color: 'white',
  },

  '& .MuiListItem-root': {
    padding: '8px 16px',

    '&:hover': {
      opacity: '0.7',
    },
  },

  '& .nav-link': {
    color: '#607B96',
    textDecoration: 'none',
    marginLeft: '8px',

    '&.selected': {
      color: '#FFFFFF',
    },
  },

  '& .warning-message': {
    fontFamily: `'Fira Code', monospace`,
    color: 'white',
    padding: '8px 16px',
  },

  ...(!open && { display: 'none' }),
}));

interface SidebarProps {
  open: boolean;
  toggleDrawer: () => void;
}

function Sidebar(props: SidebarProps) {
  const { open, toggleDrawer } = props;
  let location = useLocation();
  const packageList = useSelector((state: RootState) => state.packageManager.packageList);

  useEffect(() => {
    const activeNavLink = document.querySelector('.selected');
    activeNavLink && activeNavLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [location]);
  return (
    <CustomDrawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader style={{ borderBottom: '1px solid #1E2D3D' }}>
        <CustomIconButton onClick={toggleDrawer}>
          <img src={LeftArrowIcon} alt="Close sidebar" width="20" />
        </CustomIconButton>
      </DrawerHeader>
      <Divider />
      {packageList.length > 0 ? (
        <List>
          <ListItem key="all" disablePadding>
            <img src={PackagesIcon} alt="Packages" width="20" />
            <NavLink to={'/'} className={({ isActive }) => 'nav-link' + (isActive ? ' selected' : '')}>
              All packages
            </NavLink>
          </ListItem>
          {packageList.map((packageName: string) => (
            <ListItem key={packageName} disablePadding>
              <img src={PackageIcon} alt="Package" width="20" />
              <NavLink to={`/${packageName}`} className={({ isActive }) => 'nav-link' + (isActive ? ' selected' : '')}>
                {packageName}
              </NavLink>
            </ListItem>
          ))}
        </List>
      ) : (
        <div className="warning-message">No package</div>
      )}
    </CustomDrawer>
  );
}

export default Sidebar;
