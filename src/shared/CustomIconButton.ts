import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

export const CustomIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'background 0.7s',
  '&:hover': {
    background: '#3D5A80',
  },
}));
