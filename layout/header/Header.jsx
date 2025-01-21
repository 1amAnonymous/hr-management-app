import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  IconButton,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { setUser } from "@/toolkit/slice/authSlice";
import { getProfileUrl, logout } from "@/utils/actions/auth";
import toast from "react-hot-toast";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { pathname } = router;

  // Example user data (replace with actual user data from redux or context)
  // const user = {
  //   name: 'John Doe',
  //   avatarUrl: '/path/to/avatar.jpg', // Replace with actual avatar URL
  // };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    await logout();
    dispatch(setUser(null));
    toast.success("Logged out successfully!");
    router.push("/");
  };

  useEffect(() => {
    supabase.auth.getSession().then((response) => {
      if (response.data.session) {
        const data = response.data.session.user;
        const profile = getProfileUrl(data.id);
        if (profile.data && profile.data.publicUrl) {
          data.profilePic = profile.data.publicUrl;
        }
        dispatch(setUser(response.data.session.user));
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <AppBar position="sticky" sx={{ boxShadow: 3 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Hr.helper
            </Typography>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, mr: 2 }}>
              {user !== null && (
                <>
                  <Link href="/cms/dashboard">
                    <Button
                      color="inherit"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/cms/jobs/admin">
                    <Button
                      color="inherit"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      Post Jobs
                    </Button>
                  </Link>
                  <Link href="/cms/leaves">
                    <Button
                      color="inherit"
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      Leaves
                    </Button>
                  </Link>
                </>
              )}
              <Link href="/cms/jobs/public">
                <Button
                  color="inherit"
                  sx={{
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  Career
                </Button>
              </Link>
              {pathname !== "/" && user === null && (
                <Link href="/">
                  <Button
                    color="inherit"
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Link>
              )}
            </Box>

            {/* Avatar and Logout Box for Logged-In Users */}
            {user && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  alt={user.email}
                  src={user.profilePic || "/default-avatar.png"}
                />
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <ExitToAppIcon />
                </IconButton>
              </Box>
            )}

            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Drawer for Mobile View */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            "& .MuiDrawer-paper": {
              width: 250,
              paddingTop: 2,
              paddingLeft: 2,
              backgroundColor: theme.palette.background.paper,
              boxShadow: 3,
            },
          }}
        >
          <Box
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            {user && <><Link href="/cms/dashboard" passHref>
              <Button fullWidth sx={{ textAlign: "left", paddingY: 1 }}>
                Dashboard
              </Button>
            </Link>
            <Link href="/cms/jobs/admin" passHref>
              <Button fullWidth sx={{ textAlign: "left", paddingY: 1 }}>
                Post Jobs
              </Button>
            </Link>
            <Link href="/cms/leaves" passHref>
              <Button fullWidth sx={{ textAlign: "left", paddingY: 1 }}>
                Leaves
              </Button>
            </Link></>}
            <Link href="/cms/jobs/public" passHref>
              <Button fullWidth sx={{ textAlign: "left", paddingY: 1 }}>
                Career
              </Button>
            </Link>

            <Divider sx={{ marginY: 2 }} />

            {/* Add Login button (if needed) */}
            {pathname !== "/" && user === null && (
              <Link href="/" passHref>
                <Button
                  fullWidth
                  sx={{ textAlign: "left", paddingY: 1 }}
                  startIcon={<FaArrowRight />}
                >
                  Login
                </Button>
              </Link>
            )}
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default Header;
