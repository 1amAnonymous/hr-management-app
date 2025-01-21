import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@emotion/react';

const Footer = () => {
  const {theme} = useSelector((state) => state.theme);
  return (
    <ThemeProvider theme={theme}>
    <Box
      component="footer"
      sx={{
        backgroundColor: '#292929',
        color: 'text.primary',
        paddingY: 1, // Reduced padding to make it thinner
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
        © {new Date().getFullYear()} Hr.helper. All rights reserved.
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', marginTop: 0.5 }}>
        <Link href="#" color="inherit" sx={{ marginRight: 2 }}>
          Privacy Policy
        </Link>
        <Link href="#" color="inherit">
          Terms of Service
        </Link>
      </Typography>
    </Box>
    </ThemeProvider>
  );
};

export default Footer;

