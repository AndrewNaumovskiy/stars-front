import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Avatar, Button, Stack } from "@mui/material";
import { ArrowBackIos, Edit } from "@mui/icons-material";

import { api, IError } from "../../utils";

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
}

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(student: StudentDbModel) {
    return {
        sx: {
            bgcolor: stringToColor(`${student.firstName}${student.lastName}`),
        },
        children: `${student.lastName[0]}${student.firstName[0]}`,
    };
}

function StudentInfoPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { id } = useParams<string>();

    const [student, setStudent] = useState<StudentDbModel | null>(null);

    useEffect(() => {
        GetStudent();
    }, []);

    const GetStudent = async () => {
        try {
            const response: GetStudentResponseModel = await api.get(`api/students/${id}`).json();
            if (response.error == null) {
                setStudent(response.data.student);
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
        navigate("/group/" + id);
    }

    return (
        <Stack>
            <Stack direction="row"
                spacing={2}
                sx={{
                    mt: "5px",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}>
                <Button
                    startIcon={<ArrowBackIos />}
                    onClick={ReturnToGroups}>
                    Groups
                </Button>

                <Edit sx={{ color: 'action.active' }} />
            </Stack>

            {student !== null
                ?
                <Stack>
                    <Stack
                        direction={"row"}
                        sx={{
                            justifyContent: "flex-start",
                            alignItems: "stretch",
                            ml: "20px",
                            mt: "20px",
                        }}>
                        <Stack sx={{
                            width: "30%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Avatar
                                {...stringAvatar(student)}
                                variant="rounded"
                                sx={{ width: "75px", height: "75px" }} />
                        </Stack>
                        <Stack sx={{ marginLeft: "10px" }}>
                            <h2>{student.lastName} {student.firstName} {student.middleName}</h2>
                        </Stack>
                    </Stack>

                    <p>Більше інформації про студента</p>

                    <p>Telegram: <a href={"tg://resolve?domain=lachentyt"}>@MeowNess</a></p>

                    <p>Phone: <a href={"tel:380732019824"}>+380732019824</a></p>

                </Stack>
                :
                <h2>Loading...</h2>
            }


        </Stack>
    )
}

export default StudentInfoPage;