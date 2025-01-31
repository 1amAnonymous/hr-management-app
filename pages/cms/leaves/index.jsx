import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Skeleton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { set, useForm } from "react-hook-form";
import { ThemeProvider } from "@emotion/react";
import { useSelector } from "react-redux";
import { createLeave, deleteLeave, getLeaves } from "@/utils/actions/leaves";
import toast from "react-hot-toast";
import { PacmanLoader } from "react-spinners";
import Swal from "sweetalert2";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { SlCalender } from "react-icons/sl";
import { FaTableList } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

const LeavePage = () => {
  const [open, setOpen] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [tableMode, setTableMode] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();
  const { theme } = useSelector((state) => state.theme);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    // setLeaves([...leaves, data]);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("from", data.from);
    formData.append("to", data.to);
    setFormLoading(true);
    await createLeave(formData).then((response) => {
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success("Leave added successfully!");
        setDataLoading(true);
        setFormLoading(false);
        getLeaves().then((response) => {
          if (response.error) {
            toast.error(response.error.message);
          } else {
            setLeaves(response.data);
          }
          setDataLoading(false);
        });
      }
    });
    handleClose();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait while we delete this item.",
          icon: "info",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
        });
        await deleteLeave(id).then((response) => {
          if (response.error) {
            Swal.fire({
              title: "Error!",
              text: "There was an issue with deleting your data.",
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            setDataLoading(true);
            getLeaves().then((response) => {
              if (response.error) {
                toast.error(response.error.message);
              } else {
                setLeaves(response.data);
              }
              setDataLoading(false);
            });
          }
        });
      }
    });
  };
  useEffect(() => {
    getLeaves().then((response) => {
      if (response.error) {
        toast.error(response.error.message);
      } else {
        setLeaves(response.data);
      }
      setDataLoading(false);
    });
  }, []);
  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <span>{eventInfo.event.title}</span>
        {/* Add buttons inside the event */}
        <IconButton>
          <FaTrashAlt
            size={20}
            color="red"
            onClick={() => handleDelete(eventInfo.event.id)}
          />
        </IconButton>
      </div>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        padding={4}
        bgcolor={"background.default"}
        minHeight={"100vh"}
        minWidth={"100vw"}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Leave
          </Button>

          {tableMode ? (
            <IconButton onClick={() => setTableMode(!tableMode)}>
              <SlCalender size={20} color="#fff" />
            </IconButton>
          ) : (
            <IconButton onClick={() => setTableMode(!tableMode)}>
              <FaTableList size={20} color="#fff" />
            </IconButton>
          )}
        </Box>

        {tableMode && (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Employee Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>From</strong>
                  </TableCell>
                  <TableCell>
                    <strong>To</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataLoading
                  ? // Show Skeletons while loading
                    [1, 2, 3, 4].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton variant="text" width="80%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="60%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="60%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="circle" width={40} height={40} />
                        </TableCell>
                      </TableRow>
                    ))
                  : // Display actual data once loaded
                    Array.isArray(leaves) &&
                    leaves.length > 0 &&
                    leaves.map((leave, index) => (
                      <TableRow key={index}>
                        <TableCell>{leave?.name}</TableCell>
                        <TableCell>{leave?.from}</TableCell>
                        <TableCell>{leave?.to}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleDelete(leave?.id)}>
                            <Delete color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            {!dataLoading && leaves.length === 0 && (
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
          </TableContainer>
        )}

        {/* Modal Form for Adding Leave */}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              padding: 2,
              borderRadius: 2,
              width: 400,
            }}
          >
            <Typography variant="h5" gutterBottom color="text.primary">
              Add Leave
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Name"
                fullWidth
                {...register("name", { required: "Name is required" })}
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={formLoading}
              />
              <TextField
                label="From"
                type="date"
                fullWidth
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                {...register("from", { required: "From date is required" })}
                margin="normal"
                error={!!errors.from}
                helperText={errors.from?.message}
                disabled={formLoading}
              />
              <TextField
                label="To"
                type="date"
                fullWidth
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                {...register("to", {
                  required: "To date is required",
                  validate: (value) => {
                    const fromDate = new Date(watch("from")); // Get the 'from' date from form state
                    const toDate = new Date(value); // The 'to' date from the field value

                    if (fromDate && toDate && fromDate >= toDate) {
                      return "To date must be greater than From date"; // Error message if 'to' is not later than 'from'
                    }
                    return true; // No error if validation passes
                  },
                })}
                margin="normal"
                error={!!errors.to}
                helperText={errors.to?.message}
                disabled={formLoading}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{ marginTop: 2 }}
                disabled={formLoading}
              >
                {formLoading ? (
                  <PacmanLoader color="#fff" size={12} />
                ) : (
                  "Add Leave"
                )}
              </Button>
            </form>
          </Box>
        </Modal>

        {!tableMode && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              mt: 2,
              // justifyContent: 'center',
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#121212", // Dark background for the entire container
              minHeight: "100vh", // Ensure full height for dark mode to fill
              // padding: 2, // Add some padding for better spacing
            }}
          >
            {dataLoading ? (
              <Skeleton variant="rectangular" width="100%" height={500} />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={leaves.map((item) => {
                    return {
                      title: item?.name,
                      start: item?.from,
                      end: item?.to,
                      id: item?.id,
                    };
                  })}
                  headerToolbar={{
                    left: "prev,next",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek",
                  }}
                  eventContent={renderEventContent}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default LeavePage;
