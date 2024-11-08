import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Avatar, Button, Card, CardActionArea, CardContent, IconButton, Paper, Stack } from "@mui/material";
import { ArrowBackIos, Edit, StarBorder, Star, HelpOutline, Telegram, Call } from "@mui/icons-material";

import { api, IError } from "../../utils";
import { MarkDbModel, StatusResponseModel } from "../StudentsPage/StudentsPage";

import "./StudentInfoPage.css"

interface GetStudentResponseModel {
    data: GetStudentResponseData;
    error: IError;
}

interface GetStudentResponseData {
    student: StudentDbModel;
}

interface StudentDbModel {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;

    groupFk: number;
    isFavorite: number;

    impression: string;
    telegram: string;
    phone: string;

    marks: MarkDbModel[];
}

function stringToColor(string: string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to HSL
    const hue = (hash & 0xFFFF) % 360; // Use lower 16 bits for hue
    const saturation = 70; // Fixed saturation for better contrast
    const lightness = 50; // Fixed lightness for better contrast

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function stringAvatar(student: StudentDbModel) {
    return {
        sx: {
            bgcolor: stringToColor(`${student.firstName}${student.lastName}`),
            width: "85px", height: "85px"
        },
        children: `${student.lastName[0]}${student.firstName[0]}`,
    };
}

function StudentInfoPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { id } = useParams<string>();

    const [student, setStudent] = useState<StudentDbModel | null>(null);

    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    useEffect(() => {
        GetStudent();
    }, []);

    const GetStudent = async () => {
        try {
            const response: GetStudentResponseModel = await api.get(`api/students/${id}`).json();
            if (response.error == null) {
                setStudent(response.data.student);
                setIsFavorite(response.data.student.isFavorite === 1);
            }
            else {
                enqueueSnackbar(response.error.description, { variant: "error" });
            }
        }
        catch (error) {
            enqueueSnackbar((error as Error).message, { variant: "error" });
        }
    }

    function ReturnToGroups() {
        if (student === null)
            navigate("/");
        else
            navigate("/group/" + student.groupFk);
    }

    const HandleFavourite = async () => {
        try {
            const response: StatusResponseModel = await api.put(`api/students/favourite/${id}`).json();
            if (response.error == null) {
                setIsFavorite(!isFavorite);
            }
            else {
                enqueueSnackbar(response.error.description, { variant: "error" });
            }
        }
        catch (error) {
            enqueueSnackbar((error as Error).message, { variant: "error" });
        }
    }

    function HandleTelegram() {
        window.open(`tg://resolve?domain=${student!.telegram}`, "_blank");
    }

    function HandleTelephone() {
        window.open(`tel:${student!.phone}`, "_blank");
    }

    return (
        <Stack>
            <Stack direction="row"
                spacing={2}
                sx={{
                    mt: "5px",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                <Button
                    startIcon={<ArrowBackIos />}
                    onClick={ReturnToGroups}>
                    Groups
                </Button>

                <Stack
                    direction={"row"}
                    spacing={2}>
                    <IconButton
                        onClick={HandleFavourite}>
                        {isFavorite ? <Star htmlColor="orange" /> : <StarBorder color="primary" />}
                    </IconButton>

                    <IconButton
                        onClick={() => { }}>
                        <Edit htmlColor="gray" />
                    </IconButton>
                </Stack>

            </Stack>

            {student !== null
                ?
                <Stack>
                    <Stack
                        direction={"row"}
                        sx={{
                            justifyContent: "flex-start",
                            alignItems: "stretch",
                            ml: "10px",
                            mt: "10px",
                            mb: "10px"
                        }}>
                        <Stack sx={{
                            width: "30%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Avatar
                                {...stringAvatar(student)}
                                variant="rounded" />
                        </Stack>
                        <Stack sx={{ marginLeft: "10px" }}>
                            <h2>{student.lastName} {student.firstName} {student.middleName}</h2>
                        </Stack>
                    </Stack>

                    <Paper elevation={3}>
                        <Stack sx={{ margin: "10px" }}>
                            <Stack direction={"row"}
                                sx={{
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }}>
                                <HelpOutline htmlColor="#0096FF" sx={{ marginLeft: "6px" }} />
                                <h3 style={{ margin: "0 0 0 10px" }}>(GENERIC IMPRESSION)</h3>
                            </Stack>
                            <p style={{ marginBottom: "5px", marginLeft: "8px" }}>{student.impression}</p>
                        </Stack>
                    </Paper>

                    <Card sx={{ mt: "1px", mb: "1px" }}>
                        <CardActionArea onClick={HandleTelegram}>
                            <CardContent>
                                <Stack
                                    direction={"row"}
                                    sx={{
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                    }}>
                                    <Telegram htmlColor="#0096FF" />
                                    <h3 style={{ margin: "0 0 0 10px" }}>@{student.telegram}</h3>
                                </Stack>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    <Card sx={{ mt: "1px", mb: "1px" }}>
                        <CardActionArea onClick={HandleTelephone}>
                            <CardContent>
                                <Stack
                                    direction={"row"}
                                    sx={{
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                    }}>
                                    <Call htmlColor="#0096FF" />
                                    <h3 style={{ margin: "0 0 0 10px" }}>+{student.phone}</h3>
                                </Stack>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    <p>Good: {student.marks.filter(x => x.markType === 2).length}</p>
                    <p>Bad: {student.marks.filter(x => x.markType === 1).length}</p>
                    <p>Missing: {student.marks.filter(x => x.markType === 0).length}</p>
                </Stack>
                :
                <h2>Loading...</h2>
            }


        </Stack>
    )
}

export default StudentInfoPage;