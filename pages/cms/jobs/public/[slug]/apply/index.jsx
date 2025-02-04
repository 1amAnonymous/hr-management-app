import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
  InputAdornment,
  Grid2,
  Skeleton,
} from "@mui/material";
import { FaRegHandshake } from "react-icons/fa"; // Icon for Apply Jobs
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import useReadFiles from "@/hooks/globalhooks/useReadFiles";
import { useRouter } from "next/router";
import { getSinglePublicJob, publicApplyJobs } from "@/utils/actions/jobs";
import toast from "react-hot-toast";
import NoDataFound from "@/ui/NotFountComponet";
import { PacmanLoader } from "react-spinners";

const ApplyJobPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { extractTextFromDOCX, extractTextFromPDF, extractedText } =
    useReadFiles();
  const [jobData, setJobData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const { theme } = useSelector((state) => state.theme);
  const [file, setFile] = useState(null);
  const onSubmit = async (data) => {
    console.log(data);
    if (file) {
      const formData = new FormData();
      formData.append("cv", file);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("jobid", slug);
      formData.append("hrId", jobData?.hrid);
      if (extractedText) {
        formData.append("profileDetails", extractedText);
      }
      setFormLoading(true);
      await publicApplyJobs(formData).then((response) => {
        if (response.error) {
          toast.error(response.error.message);
          setError(true);
        } else {
          toast.success("Application submitted successfully!");
          router.push("/cms/jobs/public/success");
        }
        setFormLoading(false);
      });
    }
  };

  const onFileChange = (event) => {
    const resume = event.target.files[0];
    console.log(resume);
    if (resume) {
      setFile(resume);
      if (resume.type === "application/pdf") {
        extractTextFromPDF(resume);
      } else if (
        resume.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        extractTextFromDOCX(resume);
      }
    }
  };

  useEffect(() => {
    if (slug) {
      getSinglePublicJob(slug).then((response) => {
        if (response.error) {
          toast.error(response.error.message);
          setError(true);
        } else {
          console.log(response);
          setJobData(response.data[0]);
        }
        setDataLoading(false);
      });
    }
  }, [slug]);

  if (error) {
    return <NoDataFound message="Something went wrong" />;
  }

  if (!dataLoading && !jobData) {
    return <NoDataFound message="no data found" />;
  }

  return (
    <ThemeProvider theme={theme}>
      {dataLoading ? (
        <Box
          sx={{
            padding: 4,
            backgroundColor: "background.default",
            minHeight: "100vh",
            minWidth: "100vw",
          }}
        >
          {/* Job Info Section */}
          <Paper sx={{ padding: 4, marginBottom: 4, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom color="primary">
              <Skeleton width="60%" />
            </Typography>

            <Typography variant="h6" color="textSecondary">
              <Skeleton width="40%" />
            </Typography>
            <Typography variant="h6" color="textSecondary">
              <Skeleton width="40%" />
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <Skeleton count={3} />
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <Skeleton width="30%" />
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <Skeleton width="20%" />
            </Typography>
          </Paper>

          {/* Apply Form Section */}
          <Paper sx={{ padding: 4, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              <Skeleton width="40%" />
            </Typography>

            <form>
              <Grid container spacing={3}>
                {/* Name Field */}
                <Grid item xs={12} sm={6}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>

                {/* Email Field */}
                <Grid item xs={12} sm={6}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>

                {/* Phone Field */}
                <Grid item xs={12} sm={6}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>

                {/* CV Upload Field */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                >
                  <Skeleton variant="rectangular" height={56} />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      ) : (
        <Box
          sx={{
            padding: 4,
            backgroundColor: "background.default",
            minHeight: "100vh",
            minWidth: "100vw",
          }}
        >
          {/* Job Info Section */}
          <Paper sx={{ padding: 4, marginBottom: 4, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Apply For {jobData?.role}
            </Typography>

            <Typography variant="h6" color="textSecondary">
              Company: <strong>{jobData?.company}</strong>
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Role: <strong>{jobData?.role}</strong>
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <strong>Responsibilities:</strong>
              <br />
              {jobData?.responsibilities}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <strong>Location:</strong> {jobData?.location}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <strong>Salary:</strong> {jobData?.salary}
            </Typography>
          </Paper>

          {/* Apply Form Section */}
          <Paper sx={{ padding: 4, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Apply Now
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid2 container spacing={3}>
                {/* Name Field */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    {...register("name", { required: "Name is required" })}
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
                    disabled={formLoading}
                  />
                </Grid2>

                {/* Email Field */}
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    {...register("email", { required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                    disabled={formLoading}
                  />
                </Grid2>

                {/* Phone Field */}
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    {...register("phone", {
                      required: "Phone number is required",
                      maxLength:{
                        value: 10,
                        message: "The number should be at max 10 digits long"
                      },
                      minLength: {
                        value: 10,
                        message: "The number should be at least 10 digits long"
                      },
                      pattern:{
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number"
                      }
                    })}
                    error={!!errors.phone}
                    helperText={errors.phone ? errors.phone.message : ""}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">+91</InputAdornment>
                        ),
                      },
                    }}
                    disabled={formLoading}
                  />
                </Grid2>

                {/* CV Upload Field */}
                <Grid2
                  item
                  size={{ xs: 12, sm: 6 }}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                >
                  <TextField
                    type="file"
                    {...register("cv", {
                      required: "CV is required",
                      validate: (file) => {
                        if (
                          file[0] &&
                          file[0].type !== "application/pdf" &&
                          file[0].type !==
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ) {
                          console.log(file[0].type);
                          return "Please upload a PDF or DOCX file.";
                        }
                        return true;
                      },
                    })}
                    accept=".pdf, .doc, .docx" // Allowing common document formats
                    style={{ marginBottom: "16px" }}
                    onChange={onFileChange}
                    disabled={formLoading}
                  />
                  {errors.cv && (
                    <div style={{ color: "red" }}>{errors.cv.message}</div>
                  )}
                </Grid2>

                {/* Submit Button */}
                <Grid2 item size={{ xs: 12 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={!formLoading && <FaRegHandshake />}
                    fullWidth
                    size="large"
                    sx={{
                      padding: "12px",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#4caf50", // Darker green on hover
                      },
                    }}
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <PacmanLoader size={12} color="white" />
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                </Grid2>
              </Grid2>
            </form>
          </Paper>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default ApplyJobPage;
