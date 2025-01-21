import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, ThemeProvider, createTheme } from '@mui/material';
import { set, useForm } from 'react-hook-form';
import { getProfileUrl, login } from '@/utils/actions/auth';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { PacmanLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { setUser } from '@/toolkit/slice/authSlice';

// Create a dark theme using createTheme
const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Set the mode to 'dark' for a dark theme
    primary: {
      main: '#bb86fc', // Light purple as primary color for dark theme
    },
    background: {
      default: '#121212', // Dark background color for the page
      paper: '#1e1e1e', // Darker paper background for the card
    },
    text: {
      primary: '#ffffff', // White text color
    },
  },
});

const Login = () => {
  const {register, handleSubmit, formState: { errors },setValue,reset} = useForm();
  const [loading,setLoading] = useState(false);
  const {user} = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  // Handle form submission
  const onSubmit = async(data) => {
    setLoading(true);
    await login(data.email, data.password)
      .then((response) => {
        console.log(response)
        if (response.error) {
          toast.error(response.error.message);
        } else {
          toast.success('Login successful!');
          supabase.auth.getSession().then((response)=>{
            if(response.data.session){
              const data = response.data.session.user;
              const profile = getProfileUrl(data.id);
              if(profile.data&& profile.data.publicUrl){
                data.profilePic = profile.data.publicUrl
              }
              dispatch(setUser(response.data.session.user))
            }
          })
          router.push('/cms/dashboard');
          localStorage.setItem("sb-auth-token",response.data.session.access_token)
        }
      })
      setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then((response)=>{
      if(response.data.session){
        router.push('/cms/dashboard');
      }
    });

  },[])

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default', // Dark background for the page
        }}
      >
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 5,
              backgroundColor: 'background.paper', // Dark paper background
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main', // Primary color for the title
                marginBottom: 2,
              }}
            >
              Login
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }} noValidate>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoFocus
                color="primary" // Primary color for the input label and borders
                {
                  ...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })
                }
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                color="primary"
                {...register('password', { required: 'Password is required',
                 minLength: {
                   value: 8,
                   message: 'Password must be at least 8 characters long',
                 },
                //  pattern: {
                //    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                //    message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
                //  },
                 })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 2,
                  padding: 1.5,
                  backgroundColor: 'primary.main', // Primary button color
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {loading?<PacmanLoader color='#fff' size={12}/>:  "Login"}
              </Button>
            </form>
            <Box mt={2}>
              New here? <Link href="/auth/register" style={{
                color:"#BB86FC"
              }}>Sign Up</Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
