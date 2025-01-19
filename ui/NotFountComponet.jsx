import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material'; 
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@emotion/react';

const NoDataFound = ({ message = "No data found", onRetry }) => {
  const { theme } = useSelector((state) => state.theme);

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          bgcolor: 'background.paper',
          p: 3,
          boxShadow: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 6, // Slight shadow effect on hover
          },
        }}
      >
        <SentimentDissatisfied 
          sx={{
            fontSize: 60,
            color: 'text.secondary',
            mb: 2,
            animation: 'bounce 1s infinite', // Bounce effect for the icon
          }} 
        />
        
        <Typography 
          variant="h6" 
          sx={{ mb: 2 }} 
          color="text.primary" 
          fontWeight="bold"
        >
          {message}
        </Typography>
        
        {onRetry && (
          <Button 
            variant="contained" 
            color="primary" 
            sx={{
              mt: 2,
              py: 1.5,
              px: 3,
              borderRadius: 1.5,
              textTransform: 'none',
              transition: '0.3s',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff4081, #1e88e5)',
                transform: 'scale(1.05)',
              },
            }}
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default NoDataFound;
