import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

export const CustomButton = styled(Button)(({ theme }) => ({
  background: '#1C2B3A',
  borderRadius: '8px',
  fontFamily: `'Fira Code', monospace`,
  textTransform: 'none',
  color: '#FFFFFF',

  '&:hover': {
    background: '#1C2B3A',
    opacity: 0.7,
  },
}));
