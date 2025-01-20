import NoDataFound from "@/ui/NotFountComponet";
import { getSingleJob, updateJob } from "@/utils/actions/jobs";
import { ThemeProvider } from "@emotion/react";
import {
  Button,
  TextField,
  Box,
  Typography,
  DialogActions,
  Container,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { PacmanLoader } from "react-spinners";

const EditJobPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [formLoading, setFormLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(false);
  const [jobData, setJobData] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const { theme } = useSelector((state) => state.theme);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("role", data.role);
    formData.append("company", data.company);
    formData.append("location", data.location);
    formData.append("responsibilities", data.responsibilities);
    formData.append("salary", data.salary);
    formData.append("jobId", slug);
    setFormLoading(true);
    await updateJob(formData).then((response) => {
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success("Job updated successfully!");
        router.push("/cms/jobs/admin");
      }
      setFormLoading(false);
    });
  };

  useEffect(() => {
    if (slug) {
      console.log(slug);
      getSingleJob(slug).then((response) => {
        if (response.error) {
          toast.error(response.error.message);
          setError(true);
        } else {
          console.log(response.data[0]);
          reset(response.data[0]);
          setJobData(response.data[0]);
        }
        setDataLoading(false);
      });
    }
  }, [slug]);

  if (error) {
    return <NoDataFound message="something went wrong" />;
  }

  if (!dataLoading && !jobData) {
    return <NoDataFound message="Job not found" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          padding: 2,
          bgcolor: theme.palette.background.default,
          minHeight: "100vh",
          minWidth: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {dataLoading ? (
          <Container maxWidth="sm">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                padding: 4,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ marginBottom: 3 }}
                color="text.primary"
              >
                Edit Job Details
              </Typography>

              <form>
                {/* Skeleton for Company Name Field */}
                <Skeleton
                  variant="text"
                  width="100%"
                  height={50}
                  sx={{ marginBottom: 2 }}
                />

                {/* Skeleton for Job Role Field */}
                <Skeleton
                  variant="text"
                  width="100%"
                  height={50}
                  sx={{ marginBottom: 2 }}
                />

                {/* Skeleton for Job Description Field */}
                <Skeleton
                  variant="text"
                  width="100%"
                  height={150}
                  sx={{ marginBottom: 2 }}
                />

                {/* Skeleton for Location Field */}
                <Skeleton
                  variant="text"
                  width="100%"
                  height={50}
                  sx={{ marginBottom: 2 }}
                />

                {/* Skeleton for Salary Field */}
                <Skeleton
                  variant="text"
                  width="100%"
                  height={50}
                  sx={{ marginBottom: 2 }}
                />

                <DialogActions sx={{ justifyContent: "center" }}>
                  {/* Skeleton for Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      width: "10rem",
                      padding: "12px 24px", // Larger button size for better user experience
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#bbb", // Grey color on hover for skeleton
                      },
                    }}
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <PacmanLoader color="#fff" size={12} />
                    ) : (
                      <Skeleton variant="text" width={120} height={24} />
                    )}
                  </Button>
                </DialogActions>
              </form>
            </Box>
          </Container>
        ) : (
          <Container maxWidth="sm">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                padding: 4,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ marginBottom: 3 }}
                color="text.primary"
              >
                Edit Job Details
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  label="Company Name"
                  variant="outlined"
                  fullWidth
                  placeholder="TechCorp"
                  sx={{ marginBottom: 2 }}
                  {...register("company", {
                    required: "Company Name is required",
                  })}
                  error={!!errors.company}
                  helperText={errors.company ? errors.company.message : ""}
                  disabled={formLoading}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <TextField
                  label="Job Role"
                  variant="outlined"
                  placeholder="Software Engineer"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  {...register("role", { required: "Job Role is required" })}
                  error={!!errors.role}
                  helperText={errors.role ? errors.role.message : ""}
                  disabled={formLoading}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <TextField
                  label="Job Description"
                  variant="outlined"
                  placeholder="Design and develop user interfaces for web and mobile applications."
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ marginBottom: 2 }}
                  {...register("responsibilities", {
                    required: "Job Description is required",
                    maxLength: {
                      value: 100,
                      message:
                        "Job Description must be at most 100 characters long",
                    },
                  })}
                  error={!!errors.responsibilities}
                  helperText={
                    errors.responsibilities
                      ? errors.responsibilities.message
                      : ""
                  }
                  disabled={formLoading}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <TextField
                  label="Location"
                  variant="outlined"
                  placeholder="City, State, Country"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  {...register("location", {
                    required: "Location is required",
                  })}
                  error={!!errors.location}
                  helperText={errors.location ? errors.location.message : ""}
                  disabled={formLoading}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <TextField
                  label="Salary"
                  variant="outlined"
                  placeholder="$10,000 - $15,000"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  {...register("salary", { required: "Salary is required" })}
                  error={!!errors.salary}
                  helperText={errors.salary ? errors.salary.message : ""}
                  disabled={formLoading}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <DialogActions sx={{ justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      width: "10rem",
                      padding: "12px 24px", // Larger button size for better user experience
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <PacmanLoader color="#fff" size={12} />
                    ) : (
                      "Update Job"
                    )}
                  </Button>
                </DialogActions>
              </form>
            </Box>
          </Container>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default EditJobPage;
