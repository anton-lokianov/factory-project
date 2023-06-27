import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fetchLogin } from "../utils/fatchData";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IconButton, InputAdornment } from "@mui/material";
import { Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { store } from "../redux/Store";
import { setLoginAction } from "../redux/UserReducer";
import { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/anton-lokianov">
        Anton Lokianov
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSubmit = async (data: any) => {
    const { userName, password } = data;
    const loginData = { userName, password };
    try {
      const response = await fetchLogin(loginData);
      if (!response) return;
      if (response) {
        store.dispatch(setLoginAction(response.user, response.token));
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ backgroundColor: "#1976b2" }}>
          <Typography
            component="h1"
            variant="h2"
            sx={{
              display: "flex",
              justifyContent: "center",
              borderBottom: "1px solid black",
              p: 2,
            }}>
            Anton Factory
          </Typography>
        </Box>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 13,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h4">
              Please Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}>
              <TextField
                type="text"
                margin="normal"
                fullWidth
                id="userName"
                label="User Name"
                autoComplete="userName"
                placeholder="enter user name..."
                autoFocus
                {...register("userName", { required: true })}
                error={errors.userName ? true : false}
                helperText={errors.userName && "User name is required"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                placeholder="enter password..."
                {...register("password", { required: true })}
                error={errors.password ? true : false}
                helperText={errors.password && "Password is required"}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: isFocused && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                        tabIndex={-1}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>
                Login
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item></Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
