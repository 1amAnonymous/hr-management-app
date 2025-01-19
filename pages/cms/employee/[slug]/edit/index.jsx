import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import useReadFiles from "@/hooks/globalhooks/useReadFiles";
import toast from "react-hot-toast";
import {
  getSingleEmployeeData,
  updateEmployee,
} from "@/utils/actions/employee";
import { useRouter } from "next/router";
import NoDataFound from "@/ui/NotFountComponet";
import { getResp } from "@/utils/helper/aiREsponse";
import { PacmanLoader } from "react-spinners";

const EmployeeEditForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const [formLoading, setFormLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [dataLoading, setDataloading] = useState(true);
  const [cv, setCv] = useState();
  const router = useRouter();
  const { slug } = router.query;
  // Access theme from redux store
  const { theme } = useSelector((state) => state.theme);

  const { extractedText, extractTextFromDOCX, extractTextFromPDF } =
    useReadFiles();

  const onSubmit = async (data) => {
    setFormLoading(true);
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("role", data.role);
    formData.append("phone", data.phone);
    formData.append("department", data.department);
    formData.append("doj", data.dateOfJoining);
    formData.append("cv", cv);
    formData.append("employeeId", slug);
    if (extractedText) {
      await getResp(extractedText).then((response) => {
        console.log(response, "response");
        if (response.error) {
          toast.error(response.error.message);
        } else {
          formData.append("profileDetails", JSON.stringify(response));
        }
      });
      console.log("end");
    }
    await updateEmployee(formData).then((response) => {
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success("Employee updated successfully!");
      }
    });

    setFormLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCv(file);
    if (file) {
      if (file.type === "application/pdf") {
        extractTextFromPDF(file);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        extractTextFromDOCX(file);
      } else {
        toast.error("Please upload a PDF or DOCX file.");
        return;
      }
    }
  };

  useEffect(() => {
    if (slug) {
      setDataloading(true);
      getSingleEmployeeData(slug).then((res) => {
        if (res.error) {
          toast.error(res.error.message);
          setNoData(true);
        } else {
          if (res.data[0]) {
            res.data[0].profileDetails = JSON.parse(res.data[0].profileDetails);
            reset({ ...res.data[0], dateOfJoining: res.data[0].doj });
          } else {
            toast.error("No such employee found");
            setNoData(true);
          }
        }
        setDataloading(false);
      });
    }
  }, [slug]);

  if (noData) {
    return <NoDataFound />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        minWidth={"100vw"}
        minHeight={"100vh"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        bgcolor={theme.palette.background.default}
      >
        {dataLoading ? (
          <Box
            sx={{
              maxWidth: 600,
              width: "100%",
              margin: "auto",
              padding: 3,
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: "bold" }}
              color="text.primary"
              gutterBottom
            >
              Update Employee Details
            </Typography>

            {/* Skeleton for Name field */}
            <Skeleton variant="text" width="100%" height={56} sx={{ mb: 2 }} />

            {/* Skeleton for Role field */}
            <Skeleton variant="text" width="100%" height={56} sx={{ mb: 2 }} />

            {/* Skeleton for Email field */}
            <Skeleton variant="text" width="100%" height={56} sx={{ mb: 2 }} />

            {/* Skeleton for Department field */}
            <Skeleton variant="text" width="100%" height={56} sx={{ mb: 2 }} />

            {/* Skeleton for Phone Number field */}
            <Skeleton variant="text" width="100%" height={56} sx={{ mb: 2 }} />

            {/* Skeleton for Date of Joining field */}
            <Skeleton variant="text" width="100%" height={56} sx={{ mb: 2 }} />

            {/* Skeleton for CV Upload */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              sx={{ mb: 2 }}
            />

            {/* Skeleton for Submit Button */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              sx={{ mb: 2 }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              maxWidth: 600,
              width: "100%",
              margin: "auto",
              padding: 3,
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: "bold" }}
              color="text.primary"
              gutterBottom
            >
              Update Employee Details
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Name field */}
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name must be at most 50 characters",
                  },
                })}
                sx={{ mb: 2 }}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={formLoading}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              {/* Role field */}
              <TextField
                label="Role"
                variant="outlined"
                fullWidth
                {...register("role", {
                  required: "Role is required",
                  minLength: {
                    value: 3,
                    message: "Role must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Role must be at most 50 characters",
                  },
                })}
                sx={{ mb: 2 }}
                error={!!errors.role}
                helperText={errors.role?.message}
                disabled={formLoading}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              {/* Email field */}
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                sx={{ mb: 2 }}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={formLoading}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              {/* Department field */}
              <TextField
                label="Department"
                variant="outlined"
                fullWidth
                {...register("department", {
                  required: "Department is required",
                  minLength: {
                    value: 3,
                    message: "Department must be at least 3 characters",
                  },
                })}
                sx={{ mb: 2 }}
                error={!!errors.department}
                helperText={errors.department?.message}
                disabled={formLoading}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              {/* Phone number field */}
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                {...register("phone", {
                  required: "Phone number is required",
                  minLength: {
                    value: 10,
                    message: "Phone number must be at least 10 digits",
                  },
                  maxLength: {
                    value: 10,
                    message: "Phone number must be at most 10 digits",
                  },
                })}
                sx={{ mb: 2 }}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                disabled={formLoading}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              {/* Date of Joining field */}
              <TextField
                label="Date of Joining"
                variant="outlined"
                fullWidth
                type="date"
                {...register("dateOfJoining", {
                  required: "Date of joining is required",
                })}
                sx={{ mb: 2 }}
                error={!!errors.dateOfJoining}
                helperText={errors.dateOfJoining?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                disabled={formLoading}
              />

              {/* CV Upload field (optional) */}
              <input
                type="file"
                {...register("cv")}
                accept=".pdf, .doc, .docx"
                style={{
                  marginBottom: "16px",
                  width: "100%",
                  color: theme.palette.text.primary,
                }}
                onChange={handleFileChange}
                disabled={formLoading}
              />
              {errors.cv && (
                <div style={{ color: "red", fontSize: "0.875rem" }}>
                  {errors.cv.message}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                disabled={formLoading}
              >
                {formLoading ? (
                  <PacmanLoader color="#fff" size={12} />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeEditForm;
