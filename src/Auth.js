import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CircularProgress,
  IconButton
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { signIn } from './firebase';
import { useNavigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import toast from 'react-hot-toast';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        To Do App
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const { register, formState: { errors }, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { userLogin } = useAuth();
  const [visible, setVisible] = useState(false);

  const login = async (formData) => {
    setLoading(true)
    const obj = {
      email: formData.email,
      password: formData.password
    };
    try {
      const result = await signIn(obj);
      if (result) {
        userLogin(result.user);
        navigate("/");
        toast.success("Login Successful");
      }
    } catch (err) {
      toast.error(err.code);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ height: "100vh" }}>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <CssBaseline />
        <div>
          <Grid
            container
            component={"form"}
            onSubmit={handleSubmit(login)}
            rowGap={3}
          >
            <Grid ite md={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <Avatar sx={{ background: "#1976d2" }}>
                  <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
              </Box>
            </Grid>
            <Grid item md={12}>
              <TextField
                fullWidth
                {...register("email", {
                  required: "Enter Email"
                })}
                variant="outlined"
                label="Email Address"
                type="email"
                error={errors?.email && true}
                helperText={errors?.email?.message}
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                fullWidth
                {...register("password", {
                  required: "Enter Password"
                })}
                variant="outlined"
                label="Password"
                type={visible ? "type" : "password"}
                error={errors?.password && true}
                helperText={errors?.password?.message}
                InputProps={{
                  endAdornment: <IconButton onClick={() => setVisible(!visible)}>
                    {!visible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                }}
              />
            </Grid>
            <Grid item md={12}>
              <Link href='/signup'>
                Don't have an account?
              </Link>
            </Grid>
            <Grid item md={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                {loading ? <CircularProgress sx={{ color: "white", width: "25px !important", height: "25px !important" }} /> : "Sign In"}
              </Button>
            </Grid>
          </Grid>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Box>
    </Container>
  );
}