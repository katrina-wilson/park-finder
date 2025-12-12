import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Link,
  Divider
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from "react-redux";
import { loginUser, createNewUser } from "../stores/authSlice";


interface LoginProps {
    isLanding?: boolean,
    handleGoBack: () => void;
    handleLogin: () => void;
};


function Login({ isLanding = true, handleGoBack, handleLogin }: LoginProps) {

    const dispatch = useDispatch();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleCreateNewUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const user = { name, email, password };
            const result = await dispatch(createNewUser(user));
            if (createNewUser.fulfilled.match(result)) {
                setError(null);
                handleLogin();
            } else {
                setError(result.payload?.detail || "Login failed");
            }
        } catch (e) {
            setError(e.response?.data?.detail || "Failed to create account.");
            console.error("Failed to create account.");
        }
    };

    const handleLoginAttempt = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const user = { email, password };
            const result = await dispatch(loginUser(user));
            if (loginUser.fulfilled.match(result)) {
                console.log("in fulfilled")
                setError(null);
                handleLogin();
            } else {
                setError(result.payload?.detail || "Login failed");
            }
        } catch (e) {
            setError(e.response?.data?.detail || "Incorrect email or password.");
            console.error("Incorrect email or password.");
        }
    }

    return (
        <div className="tw:max-w-xl tw:p-4">

            <div
                className={!isLanding ? 'tw:w-full tw:flex tw:justify-end' : ''}
            >
                <Button
                    startIcon={isLanding && <ArrowBackIcon/>}
                    onClick={handleGoBack}
                    
                >
                    {isLanding ? 'Go Back' : 'Cancel'}
                </Button>
            </div>


            <div className="tw:p-10">
                <div className="tw:text-center tw:text-3xl tw:font-bold tw:pb-6 tw:uppercase">
                    {mode === "login" ? "Login" : "Create Account"}
                </div>

                {mode === "login" && (
                    <Box 
                        component="form" 
                        noValidate 
                        autoComplete="off" 
                        onSubmit={handleLoginAttempt}
                        className="tw-flex tw-flex-col tw-space-y-4"
                    >
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <div className="tw:text-red-800">{error}</div>}
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            className='tw:h-12 tw:mt-4'
                        >
                            Login
                        </Button>

                        <Divider sx={{ my: 3 }} />

                        <div className="tw:text-sm tw:flex tw:items-center tw:justify-center">
                            Don’t have an account?
                            <Link
                                component="button"
                                underline="hover"
                                className="tw:pl-2 tw:font-bold"
                                onClick={() => setMode("signup")}
                            >
                                Create an Account
                            </Link>
                        </div>
                    </Box>
                )}

                {mode === "signup" && (
                    <Box
                        component='form'
                        onSubmit={handleCreateNewUser}
                        noValidate
                        autoComplete="off"
                        className="tw-flex tw-flex-col tw-space-y-4"
                    >

                        <TextField
                            fullWidth
                            required
                            label="Full Name"
                            variant="outlined"
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            required
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            required
                            label="Password"
                            variant="outlined"
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            required
                            label="Confirm Password"
                            variant="outlined"
                            margin="normal"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {error && <div className="tw:text-red-800">{error}</div>}
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            className='tw:h-12 tw:mt-4'
                        >
                            Create Account
                        </Button>

                        <Divider sx={{ my: 3 }} />

                        <div className="tw:text-sm tw:flex tw:items-center tw:justify-center">
                            Already have an account?{" "}
                            <Link
                                component="button"
                                underline="hover"
                                className="tw:pl-2 tw:font-bold"
                                onClick={() => setMode("login")}
                            >
                                Login
                            </Link>
                        </div>
                    </Box>
                )}
            </div>
        </div>
    );
}

export default Login;