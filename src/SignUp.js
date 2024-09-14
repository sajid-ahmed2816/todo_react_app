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
import { signUp } from './firebase';
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

function SignUp() {
  const [loading, setLoading] = useState(false);
  const { register, formState: { errors }, handleSubmit, watch } = useForm();
  const navigate = useNavigate();
  const { userLogin } = useAuth();
  const [visible, setVisible] = useState(false);
  const [cnfVisible, setCnfVisible] = useState(false);

  const userSignUp = async (formData) => {
    setLoading(true);
    const obj = {
      email: formData.email,
      password: formData.password
    };
    try {
      const result = await signUp(obj);
      if (result.user.uid) {
        userLogin(result.user);
        navigate("/");
        toast.success("Sign Up Successful");
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
            onSubmit={handleSubmit(userSignUp)}
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
                  Sign Up
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
              <TextField
                fullWidth
                {...register("cnfpassword", {
                  required: "Confirm Password"
                })}
                variant="outlined"
                label="Confirm Password"
                type={cnfVisible ? "type" : "password"}
                error={errors?.cnfpassword && true}
                helperText={errors?.cnfpassword?.message}
                InputProps={{
                  endAdornment: <IconButton onClick={() => setCnfVisible(!cnfVisible)}>
                    {!cnfVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                }}
              />
            </Grid>
            <Grid item md={12}>
              <Link href='/login'>
                Already have an account?
              </Link>
            </Grid>
            <Grid item md={12}>
              <Button
                disabled={
                  !watch("password") || // if password is empty
                  !watch("cnfpassword") || // if confirm password is empty
                  watch("password") !== watch("cnfpassword") // if passwords don't match
                }
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                {loading ? <CircularProgress sx={{ color: "white", width: "25px !important", height: "25px !important" }} /> : "Create Account"}
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

export default SignUp