import React from "react";
import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa"; // Success Icon
import { useSelector } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import Link from "next/link";

const ApplicationSuccessPage = () => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 2,
        }}
        bgcolor={"background.default"}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
            maxWidth: 500,
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <FaCheckCircle
            size={60}
            color="#388e3c"
            style={{ marginBottom: 20 }}
          />

          <Typography variant="h4" color="primary" sx={{ fontWeight: "bold",textAlign: "center" }}>
            Application Submitted Successfully!
          </Typography>

          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ marginTop: 2, textAlign: "center" }}
          >
            Thank you for applying! We have received your application, and our
            team will review it shortly.
          </Typography>
            
            <Link href={"/cms/jobs/public"}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{
                  padding: "12px",
                  fontWeight: "bold",
                  mt: 6,
                  "&:hover": {
                    backgroundColor: "#f1f8e9", // Light green background on hover
                  },
                }}
              >
                Browse More Jobs
              </Button>
            </Link>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ApplicationSuccessPage;
