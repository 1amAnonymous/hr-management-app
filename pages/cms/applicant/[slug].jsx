import NoDataFound from "@/ui/NotFountComponet";
import { getApplicants } from "@/utils/actions/applicant";
import { getEmployeeDetails } from "@/utils/actions/employee";
import { ThemeProvider } from "@emotion/react";
import {
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  Box,
  Button,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const EmployeeDetails = () => {
  const [employee, setEmployee] = useState({});
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const {theme} = useSelector((state) => state.theme);
  const [error,setError] = useState(false);

  useEffect(() => {
    if (slug) {
        getApplicants(slug).then((res) => {
        if (res.data) {
         if(res.data[0]){
            res.data[0].profileDetails = JSON.parse(res?.data[0]?.profileDetails);
         }
          setEmployee(res.data[0]);
        } else {
          toast.error(res.error.message);
          setError(true);
        }
        setIsLoading(false);
      });
    }
  }, [slug]);

  if(!isLoading && !employee){
    return (
        <NoDataFound /> 
    )
  }

  if(error){
    return(
        <NoDataFound message="Something went wrong" />
    )
  }

  return (
    <ThemeProvider theme={theme}>
    <Box display={"flex"} justifyContent={"center"} bgcolor={theme.palette.background.default} minHeight={"100vh"}>
      <Card
        sx={{
          maxWidth: 900,
          borderRadius: 2,
          boxShadow: 3,
          my: 2,
          mx: 2,
          width: "100%",
        }}
      >
        {/* Skeleton CardContent */}
        {isLoading && (
          <CardContent>
            {/* Profile Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Skeleton
                variant="circular"
                width={100}
                height={100}
                sx={{ mr: 2 }}
              />
              <Box display={"flex"} flexDirection={"column"} width={"100%"}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={40}
                  sx={{ mb: 1 }}
                />
                <Skeleton variant="text" width="40%" height={30} />
              </Box>
            </Box>

            {/* Contact and HR Details */}
            <Box mb={2}>
              <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={30} sx={{ mb: 1 }} />
            </Box>

            {/* Profile Summary */}
            <Skeleton variant="text" width="80%" height={30} sx={{ mb: 2 }} />

            <Divider sx={{ my: 3 }} />

            {/* Skills Section */}
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <Skeleton
                variant="rectangular"
                width={100}
                height={30}
                sx={{ margin: 0.5 }}
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={30}
                sx={{ margin: 0.5 }}
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={30}
                sx={{ margin: 0.5 }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Qualifications Section */}
            <List>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={40}
                sx={{ marginBottom: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={40}
                sx={{ marginBottom: 1 }}
              />
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Projects Section */}
            <List>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={40}
                sx={{ marginBottom: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={40}
                sx={{ marginBottom: 1 }}
              />
            </List>

            {/* Experience Section (if any) */}

            <Divider sx={{ my: 3 }} />
            <List>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={40}
                sx={{ marginBottom: 1 }}
              />
            </List>
          </CardContent>
        )}

        {/* Data CardContent */}
        {!isLoading && (
          <CardContent>
            {/* Profile Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                alt={employee?.name}
                src="https://via.placeholder.com/150" // Replace with actual employee's profile image URL
                sx={{ width: 100, height: 100, mr: 2 }}
              />
              <Box>
                <Typography variant="h4" component="h2" gutterBottom>
                  {employee?.name}
                </Typography>
              </Box>
            </Box>

            {/* Contact and HR Details */}
            <Box mb={2}>
              <Typography variant="body1">
                <strong>Email:</strong> {employee?.email}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {employee?.phone}
              </Typography>
            </Box>

            {/* Profile Summary */}
            {employee?.profileDetails?.description && (
              <>
                <Typography variant="h6" gutterBottom>
                  Profile Summary
                </Typography>
                <Typography variant="body1">
                  {employee?.profileDetails?.description}
                </Typography>
              </>
            )}

            {/* Skills Section */}
            {employee?.profileDetails?.skills?.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {employee?.profileDetails?.skills?.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill.name}
                      sx={{
                        margin: 0.5,
                        borderRadius: 2,
                        backgroundColor: "primary.main",
                        "&:hover": { backgroundColor: "primary.main" },
                      }}
                    />
                  ))}
                </Box>
              </>
            )}

            {/* Qualifications Section */}
            {employee?.profileDetails?.qualifications?.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Qualifications
                </Typography>
                <List>
                  {employee?.profileDetails?.qualifications?.map(
                    (qualification, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={qualification.degree}
                          secondary={`${qualification?.institution}, ${
                            qualification.date && qualification.date + ","
                          }score- ${
                            qualification?.cgpa || qualification.marks
                          }`}
                        />
                      </ListItem>
                    )
                  )}
                </List>
              </>
            )}

            {employee?.profileDetails?.certifications?.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Cirtifications
                </Typography>
                <List>
                  {employee?.profileDetails?.certifications?.map(
                    (certification, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={certification.name}
                        />
                      </ListItem>
                    )
                  )}
                </List>
              </>
            )}

            {/* Projects Section */}
            {employee?.profileDetails?.projects?.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Projects
                </Typography>
                <List>
                  {employee?.profileDetails?.projects?.map((project, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={project.projectName} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {/* Experience Section (if any) */}
            {employee?.profileDetails?.experience?.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Experience
                </Typography>
                <List>
                  {employee?.profileDetails?.experience?.map((exp, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={exp.role}
                        secondary={`${exp?.company ? exp?.company : ""} ${
                          exp?.duration ? "-" + exp?.duration : ""
                        }`}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </Box>
    </ThemeProvider>
  );
};

export default EmployeeDetails;
