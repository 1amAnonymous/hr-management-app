import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  Skeleton,
} from "@mui/material";
import {
  FaPlusCircle,
  FaDollarSign,
  FaMapMarkerAlt,
  FaTrashAlt,
  FaEdit,
  FaRegHandshake,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { useForm } from "react-hook-form";
import { adminGetJobs, adminPostJobs, deleteJob, getPublicJobs } from "@/utils/actions/jobs";
import toast from "react-hot-toast";
import { PacmanLoader } from "react-spinners";
import Link from "next/link";
import Swal from "sweetalert2";

const JobListingPage = () => {
  const [openPostJobModal, setOpenPostJobModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [jobListings, setJobListings] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const { theme } = useSelector((state) => state.theme);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Open the modal
  const handleOpenPostJobModal = () => setOpenPostJobModal(true);

  // Close the modal
  const handleClosePostJobModal = () => setOpenPostJobModal(false);

  // Handle form submission
  const handlePostJob = async (data) => {
    console.log("Job Posted:", data);
    const formData = new FormData();
    formData.append("role", data.role);
    formData.append("company", data.company);
    formData.append("location", data.location);
    formData.append("responsibilities", data.responsibilities);
    formData.append("salary", data.salary);
    setFormLoading(true);
    await adminPostJobs(formData).then((response) => {
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success("Job posted successfully!");
        console.log(response.data);
      }
      setFormLoading(false);
    });
    reset(); // Reset the form after submission
    handleClosePostJobModal(); // Close the modal after posting
  };


  useEffect(() => {
    getPublicJobs().then((response) => {
      if (response.error) {
        toast.error(response.error.message);
      } else {
        setJobListings(response.data);
      }
      setDataLoading(false);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ padding: 4 }}
        bgcolor={theme.palette.background.default}
        minHeight={"100vh"}
        minWidth={"100%"}
      >
        {/* Title of the Job Listing Page */}
        <Typography variant="h4" sx={{ marginBottom: 3 }} color="text.primary">
          Available Jobs
        </Typography>

        {/* Job Listings (Using Flexbox layout) */}
        {dataLoading ? (
          // Show skeleton loaders if data is loading
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {Array.from(new Array(3)).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: "100%", sm: "48%", md: "30%" }, // Responsive card width
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Skeleton for Company Name */}
                    <Skeleton
                      variant="text"
                      width="80%"
                      sx={{ marginBottom: 1 }}
                    />
                    {/* Skeleton for Job Role */}
                    <Skeleton
                      variant="text"
                      width="60%"
                      sx={{ marginBottom: 1 }}
                    />
                    {/* Skeleton for Responsibilities */}
                    <Skeleton
                      variant="text"
                      width="90%"
                      sx={{ marginBottom: 1 }}
                    />
                  </CardContent>

                  <Divider sx={{ margin: "10px 0" }} />

                  <CardContent sx={{ paddingBottom: 0 }}>
                    {/* Skeleton for Location */}
                    <Skeleton
                      variant="text"
                      width="70%"
                      sx={{ marginBottom: 1 }}
                    />
                    {/* Skeleton for Salary */}
                    <Skeleton
                      variant="text"
                      width="50%"
                      sx={{ marginBottom: 1 }}
                    />
                  </CardContent>

                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    {/* Skeleton for Action Buttons */}
                    <Skeleton
                      variant="circular"
                      width={35}
                      height={35}
                      sx={{ marginRight: 1 }}
                    />
                    <Skeleton variant="circular" width={35} height={35} />
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          // Show actual job listings once data is loaded
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {Array.isArray(jobListings) &&
              jobListings.length > 0 &&
              !dataLoading &&
              jobListings.map((job, index) => (
                <Box
                  key={index}
                  sx={{
                    width: { xs: "100%", sm: "48%", md: "30%" }, // Responsive card width
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Display the company name */}
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {job.company}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", marginTop: 1 }}
                      >
                        {job.role}
                      </Typography>
                      <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        {job.responsibilities}
                      </Typography>
                    </CardContent>

                    <Divider sx={{ margin: "10px 0" }} />

                    {/* Location and Salary (Bottom of the card) */}
                    <CardContent sx={{ paddingBottom: 0 }}>
                      <Typography variant="body2" sx={{ marginTop: 2 }}>
                        <FaMapMarkerAlt
                          style={{ marginRight: "8px", color: "#808080" }}
                        />
                        <strong>Location:</strong> {job.location}
                      </Typography>
                      <Typography variant="body2" sx={{ marginTop: 1 }}>
                        <FaDollarSign
                          style={{ marginRight: "8px", color: "#808080" }}
                        />
                        <strong>Salary:</strong> {job.salary}
                      </Typography>
                    </CardContent>

                    {/* Action Buttons (Delete and Edit) */}
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Link href={`/cms/jobs/public/${job.id}/apply`}>
                      <Button
                        variant="contained" // Button style: filled
                        color="primary" // Primary color of the button
                        startIcon={<FaRegHandshake />} // Icon for the button
                        size="large" // Size of the button
                      >
                        Apply
                      </Button>
                      </Link>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            {
              // If there are no job listings, show a message
              jobListings.length === 0 && (
                <iframe
                  width="560"
                  height="315"
                  src="https://lottie.host/embed/b6dd50e9-14e7-44b1-8a67-e1c574f35945/XIqSggGkWI.lottie"
                  title="YouTube video player"
                  style={{ border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )
            }
          </Box>
        )}

        {/* Post Job Modal */}
        <Dialog open={openPostJobModal}>
          <DialogTitle>Post a New Job</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handlePostJob)}>
              <TextField
                label="Job Role"
                variant="outlined"
                placeholder="Software Engineer"
                fullWidth
                sx={{ marginBottom: 2, marginTop: 2 }}
                {...register("role", { required: "Job Role is required" })}
                error={!!errors.title}
                helperText={errors.title ? errors.title.message : ""}
                disabled={formLoading}
              />
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
                    value: 10,
                    message:
                      "Job Description must be at most 100 characters long",
                  },
                })}
                error={!!errors.responsibilities}
                helperText={
                  errors.responsibilities ? errors.responsibilities.message : ""
                }
                disabled={formLoading}
              />
              <TextField
                label="Location"
                variant="outlined"
                placeholder="City, State, Country"
                fullWidth
                {...register("location", { required: "Location is required" })}
                sx={{ marginBottom: 2 }}
                error={!!errors.location}
                helperText={errors.location ? errors.location.message : ""}
                disabled={formLoading}
              />
              <TextField
                label="Salary"
                variant="outlined"
                placeholder="$10,000 - $15,000"
                fullWidth
                {...register("salary", { required: "Salary is required" })}
                sx={{ marginBottom: 2 }}
                error={!!errors.salary}
                helperText={errors.salary ? errors.salary.message : ""}
                disabled={formLoading}
              />
              <DialogActions>
                <Button
                  onClick={handleClosePostJobModal}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={formLoading}
                  sx={{
                    width: "7rem",
                  }}
                >
                  {formLoading ? (
                    <PacmanLoader color="#fff" size={12} />
                  ) : (
                    "Post Job"
                  )}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default JobListingPage;
