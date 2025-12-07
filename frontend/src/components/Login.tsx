import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Divider
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createNewUserApi } from '../api/authApi';


interface LoginProps {
    handleGoBack: () => void;
    handleLogin: (token: string) => void;
};


function Login({ handleGoBack, handleLogin }: LoginProps) {
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
            const result = await createNewUserApi(user);
            localStorage.setItem("token", result.token);
            setError(null);
            handleLogin(result.token);
        } catch (e) {
            setError(e.response?.data?.detail || "Failed to create account.");
            console.error("Failed to create account.");
        }
    };

    return (
        <div className="tw:max-w-xl tw:p-6">

            <Button
                startIcon={<ArrowBackIcon/>}
                onClick={handleGoBack}
            >
                Go Back
            </Button>

            <div className="tw:p-10">
                <div className="tw:text-center tw:text-3xl tw:font-bold tw:pb-6 tw:uppercase playfair-font" style={{ fontFamily: 'Playfair Display SC'}}>
                    {mode === "login" ? "Login" : "Create Account"}
                </div>

                {mode === "login" && (
                    <Box component="form" noValidate autoComplete="off">
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            type="email"
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            margin="normal"
                            type="password"
                        />

                        <Button
                            fullWidth
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
                    <form onSubmit={handleCreateNewUser} className="tw-flex tw-flex-col tw-space-y-4 tw-w-80">

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

                        {error && <div className="tw-text-red-500">{error}</div>}
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
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;