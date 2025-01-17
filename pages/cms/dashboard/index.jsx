import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  DialogContentText,
  Skeleton,
} from "@mui/material";
import { set, useForm } from "react-hook-form";
import {
  addEmployee,
  downloadCV,
  getEmployeeData,
} from "@/utils/actions/employee";
import { supabase } from "@/lib/supabase";
import { PacmanLoader } from "react-spinners";
import toast from "react-hot-toast";

// Define the dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark", // Set the mode to 'dark'
    primary: {
      main: "#bb86fc", // Light purple as primary color
    },
    background: {
      default: "#121212", // Dark background color for the page
      paper: "#1e1e1e", // Darker background for the paper component
    },
    text: {
      primary: "#ffffff", // White text color
    },
  },
});

export default function DashBoard() {
  const [openModal, setOpenModal] = useState(false);
  const [cv, setCv] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Open and close modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    reset(); // Reset form after closing the modal
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCv(file);
  };
  // Handle form submission
  const onSubmit = async (data) => {
    setFormLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("role", data.role);
    formData.append("phone", data.phone);
    formData.append("department", data.department);
    formData.append("doj", data.dateOfJoining);
    formData.append("cv", cv);
    await addEmployee(formData).then((response) => {
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success("Employee added successfully!");
        getEmployeeList();
      }
    });
    setFormLoading(false);
    handleCloseModal();
  };
  const getEmployeeList = async () => {
    setDataLoading(true);
    const data = await getEmployeeData();
    setEmployeeList(data.data);
    setDataLoading(false);
  };
  const handleDownloadCV = async (employeeId) => {
    const data = await downloadCV(employeeId);

    if (data.error) {
      toast.error(data.error.message);
    } else {
      console.log(data)
      if (data.data.type === "application/pdf") {
        const url = URL.createObjectURL(data.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${employeeId}.pdf`;
        link.click();
      } else {
        const blob = new Blob([data.data], { type: data.type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${employeeId}.docx`;
        link.click();
      }
    }
  };
  useEffect(() => {
    getEmployeeList();
  }, []);
  useEffect(() => {
    console.log(employeeList);
  }, [employeeList]);
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          padding: 2,
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ color: "text.primary", textAlign: "center" }}
        >
          HR Management Dashboard
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          sx={{ marginBottom: 2 }}
        >
          Add New Employee
        </Button>

        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "background.paper" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>Employee Name</strong>
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>Role</strong>
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>Email</strong>
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>Department</strong>
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>Phone Number</strong>
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>Date of Joining</strong>
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>CV</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataLoading
                ? // Render Skeleton placeholders when loading
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton variant="text" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="100%" />
                        </TableCell>
                      </TableRow>
                    ))
                : // Render actual data when not loading
                  Array.isArray(employeeList) &&
                  employeeList.length > 0 &&
                  employeeList.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell sx={{ color: "text.primary" }}>
                        {employee?.name}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary" }}>
                        {employee?.role}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary" }}>
                        {employee?.email}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary" }}>
                        {employee?.department}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary" }}>
                        {employee?.phone}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary" }}>
                        {new Date(employee?.doj).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDownloadCV(employee.id)}
                        >
                          Download CV
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
    
      

        {/* Modal for adding new employee */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill in the details of the new employee.
            </DialogContentText>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                sx={{ marginBottom: 2 }}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={formLoading}
              />
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
                sx={{ marginBottom: 2 }}
                error={!!errors.role}
                helperText={errors.role?.message}
                disabled={formLoading}
              />
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
                sx={{ marginBottom: 2 }}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={formLoading}
              />
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
                sx={{ marginBottom: 2 }}
                error={!!errors.department}
                helperText={errors.department?.message}
                disabled={formLoading}
              />
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
                sx={{ marginBottom: 2 }}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                disabled={formLoading}
              />
              <TextField
                label="Date of Joining"
                variant="outlined"
                fullWidth
                type="date"
                {...register("dateOfJoining", {
                  required: "Date of joining is required",
                })}
                sx={{ marginBottom: 2 }}
                error={!!errors.dateOfJoining}
                helperText={errors.dateOfJoining?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                disabled={formLoading}
              />
              {/* CV Upload field */}
              <input
                type="file"
                {...register("cv", { required: "CV is required" })}
                accept=".pdf,.doc,.docx,.txt" // Allowing common document formats
                style={{ marginBottom: "16px" }}
                onChange={handleFileChange}
                disabled={formLoading}
              />
              {errors.cv && (
                <div style={{ color: "red" }}>{errors.cv.message}</div>
              )}
              <DialogActions>
                <Button onClick={handleCloseModal} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={formLoading}>
                  {formLoading ? (
                    <PacmanLoader color="#fff" size={12} />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

// Static employee data with additional fields
export const employees = [
  {
    id: 1,
    name: "John Doe",
    role: "Software Engineer",
    email: "john.doe@example.com",
    department: "Engineering",
    phone: "123-456-7890",
    dateOfJoining: "2020-01-15",
    cv: "/cvs/john-doe-cv.pdf", // Link to the CV file
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Product Manager",
    email: "jane.smith@example.com",
    department: "Product",
    phone: "234-567-8901",
    dateOfJoining: "2019-07-30",
    cv: "/cvs/jane-smith-cv.pdf",
  },
  {
    id: 3,
    name: "Alice Johnson",
    role: "UX/UI Designer",
    email: "alice.johnson@example.com",
    department: "Design",
    phone: "345-678-9012",
    dateOfJoining: "2021-03-10",
    cv: "/cvs/alice-johnson-cv.pdf",
  },
  {
    id: 4,
    name: "Bob Brown",
    role: "Marketing Specialist",
    email: "bob.brown@example.com",
    department: "Marketing",
    phone: "456-789-0123",
    dateOfJoining: "2018-06-25",
    cv: "/cvs/bob-brown-cv.pdf",
  },
];
