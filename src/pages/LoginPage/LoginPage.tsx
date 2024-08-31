import { useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import { Button, Stack, TextField } from "@mui/material";

import { api, IError } from "../../utils";

interface LoginRequestModel {
    Login: string;
    Password: string;
}

interface LoginResponseModel {
    data: LoginResponseData;
    error: IError;
}
interface LoginResponseData {
    licence: string;
}

function LoginPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const enterKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === "Enter")
            PerformLogin()
    }

    const PerformLogin = async () => {
        if (login === "" || password === "") {
            enqueueSnackbar("You are missing Login or Password", { variant: "error" });
            return;
        }

        try {
            const reqData: LoginRequestModel = {
                Login: login,
                Password: password
            }
            const response: LoginResponseModel = await api.post("api/auth/login", {
                json: reqData
            }).json();

            if (response.error == null) {
                localStorage.setItem("token", response.data.licence);

                navigate("/");
            }
            else {
                enqueueSnackbar(response.error.description, { variant: "error" });
            }
        }
        catch (error) {
            enqueueSnackbar((error as Error).message, { variant: "error" });
        }
    }

    return (
        <Stack
            direction="column"
            sx={{
                justifyContent: "center",
                alignItems: "center",
                height: "60vh"
            }}>

            <p>Username</p>

            <TextField
                sx={{ minWidth: 350 }}
                value={login}
                onKeyDown={enterKeyDownHandler}
                onChange={(param: any) => { setLogin(param.target.value); }} />

            <p>Password</p>
            <TextField
                sx={{ minWidth: 350 }}
                value={password}
                type="password"
                onKeyDown={enterKeyDownHandler}
                onChange={(param: any) => { setPassword(param.target.value); }} />

            <Button
                variant="outlined"
                sx={{ marginTop: '20px' }}
                size="large"
                onClick={PerformLogin}>
                Login
            </Button>
        </Stack>
    )
}

export default LoginPage;