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
  Skeleton,
  IconButton,
} from "@mui/material";
import {
  downloadCV,
} from "@/utils/actions/employee";
import toast from "react-hot-toast";
import {
  FaRegEye,
} from "react-icons/fa";
import Link from "next/link";
import { getAdminApplicants } from "@/utils/actions/applicant";
import { useRouter } from "next/router";


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

export default function ApplicationDashBoard() {
  const [employeeList, setEmployeeList] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();
  const { slug } = router.query;
  const getEmployeeList = async (slug) => {
    setDataLoading(true);
    const data = await getAdminApplicants(slug);
    setEmployeeList(data.data);
    setDataLoading(false);
  };
  const handleDownloadCV = async (employeeId) => {
    const data = await downloadCV(employeeId);

    if (data.error) {
      toast.error(data.error.message);
    } else {
      console.log(data);
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
    if (slug) {
      getEmployeeList(slug);
    }
  }, [slug]);
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
          variant="h4"
          gutterBottom
          sx={{ color: "text.primary", textAlign: "center" }}
        >
          Applications
        </Typography>


        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "background.paper" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>Applicant Name</strong>
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>Email</strong>
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>Phone Number</strong>
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>CV</strong>
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  <strong>Actions</strong>
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
                        {employee?.email}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary" }}>
                        {employee?.phone}
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
                      <TableCell sx={{ color: "text.primary" }}>
                        <Box display={"flex"} gap={2}>
                          <Link href={`/cms/applicant/${employee.id}`}>
                            <IconButton color="primary">
                              <FaRegEye size={27} color="#26c1ff" />
                            </IconButton>
                          </Link>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>

        {employeeList.length === 0 && !dataLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "35vh",
              width: "100%",
              mt: 2,
            }}
          >
            <iframe
              width="560"
              height="315"
              src="https://lottie.host/embed/b6dd50e9-14e7-44b1-8a67-e1c574f35945/XIqSggGkWI.lottie"
              title="YouTube video player"
              style={{ border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </Box>
        )}
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
