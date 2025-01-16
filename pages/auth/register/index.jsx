import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signup } from "@/utils/actions/auth"; // Assuming you have a signup function in utils/actions/auth
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Create a dark theme using createTheme
const darkTheme = createTheme({
  palette: {
    mode: "dark", // Set the mode to 'dark' for a dark theme
    primary: {
      main: "#bb86fc", // Light purple as primary color for dark theme
    },
    background: {
      default: "#121212", // Dark background color for the page
      paper: "#1e1e1e", // Darker paper background for the card
    },
    text: {
      primary: "#ffffff", // White text color
    },
  },
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [profilePic, setProfilePic] = useState(null);

  // Handle form submission
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("profilePic", profilePic); // Add profile picture to FormData

    signup(formData).then((response) => {
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success("Signup successful!");
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePic(file);
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  //this use effect is for test pupose
  useEffect(() => {
    const getSession = async()=>{
      const {data}  = await supabase.auth.getSession();
      console.log(data.session)
    }
    getSession()
  },[])

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "background.default", // Dark background for the page
        }}
      >
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: 5,
              backgroundColor: "background.paper", // Dark paper background
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "primary.main", // Primary color for the title
                marginBottom: 2,
              }}
            >
              Sign Up
            </Typography>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ width: "100%" }}
              noValidate
            >
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number",
                  },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />

              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 2 }}
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginBottom: 16 }}
              />
              {profilePic && (
                <Typography sx={{ color: "primary.main" }}>
                  Profile picture selected
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 2,
                  padding: 1.5,
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                Sign Up
              </Button>
            </form>
            <Box mt={2}>
                Already have an account? <Link href="/" style={{ textDecoration: "none",color:"#BB86FC" }}>Sign in</Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;
