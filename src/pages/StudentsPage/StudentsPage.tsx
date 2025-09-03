import { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowBackIos, Search, Info, Telegram, AccountBox } from "@mui/icons-material";
import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogContent, IconButton, Stack, TextField } from "@mui/material";

import { api, IError, uuidv4 } from "../../utils";
import StudentItemComponent from "../../components/StudentItemComponent";

interface GetStudentsResponseModel {
    data: GetStudentsResponseData;
    error: IError;
}

interface GetStudentsResponseData {
    students: StudentModel[];
    groupInfo: GroupInfoModel;
}

export interface StudentModel {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    groupFk: number;

    studentType: number;
    impression: string;

    mark: MarkDbModel | null;
}

interface GroupInfoModel {
    groupName: string;
    telegramLink: string;
    head: StudentModel;
}

export interface MarkDbModel {
    id: number;
    markType: number;
    dateSet: Dayjs;
}

export interface StatusResponseModel {
    data: StatusResponseData;
    error: IError;
}

export interface StatusResponseData {
    status: string;
}

export interface SetMarkResponseModel {
    data: SetMarkResponseData;
    error: IError;
}

export interface SetMarkResponseData {
    mark: MarkDbModel;
}

function StudentsPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { id } = useParams<string>();

    const [search, setSearch] = useState<string>("");

    const [students, setStudents] = useState<StudentModel[]>([]);
    const studentCopy = useRef<StudentModel[]>([]);

    const [groupInfo, setGroupInfo] = useState<GroupInfoModel | null>(null);

    const [showInfo, setShowInfo] = useState<boolean>(false);

    function ReturnToClasses() {
        navigate("/");
    }

    useEffect(() => {
        GetStudents();
    }, []);

    const GetStudents = async () => {
        try {
            const response: GetStudentsResponseModel = await api.get(`api/students/group/${id}`).json();

            if (response.error == null) {
                setStudents(response.data.students);
                studentCopy.current = response.data.students;

                setGroupInfo(response.data.groupInfo);
            }
            else {
                enqueueSnackbar(response.error.description, { variant: "error" });
            }
        }
        catch (error) {
            enqueueSnackbar((error as Error).message, { variant: "error" });
        }
    }

    const HandleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        setSearch(value);

        if (value === "") {
            setStudents(studentCopy.current);
            return;
        }

        const temp = studentCopy.current.filter(s =>
            s.firstName.toLowerCase().includes(value.toLowerCase()) ||
            s.lastName.toLowerCase().includes(value.toLowerCase()) ||
            s.middleName.toLowerCase().includes(value.toLowerCase())
        );

        setStudents(temp);
    }

    const HandleStudentClick = (student: StudentModel) => {
        navigate("/student/" + student.id);
    }

    const SetMark = async (student: StudentModel, markType: number) => {
        try {
            const response: SetMarkResponseModel = await api.post(`api/students/${student.id}/setMark/${markType}`).json();

            if (response.error == null) {
                setStudents(prevStudents =>
                    prevStudents.map(s =>
                        s.id === student.id ? { ...s, mark: response.data.mark } : s
                    )
                );
                enqueueSnackbar("Ok!", { variant: "success" });
            }
            else {
                enqueueSnackbar(response.error.description, { variant: "error" });
            }
        }
        catch (error) {
            enqueueSnackbar((error as Error).message, { variant: "error" });
        }
    }

    const DeleteMark = async (student: StudentModel) => {
        try {
            const response: StatusResponseModel = await api.post(`api/students/${student.id}/deleteMark/${student.mark!.id}`).json();

            if (response.error == null) {
                setStudents(prevStudents =>
                    prevStudents.map(s =>
                        s.id === student.id ? { ...s, mark: null } : s
                    )
                );
            }
            else {
                enqueueSnackbar(response.error.description, { variant: "error" });
            }
        }
        catch (error) {
            enqueueSnackbar((error as Error).message, { variant: "error" });
        }
    }

    const UpdateMark = async (student: StudentModel, markType: number) => {
        try {
            const response: SetMarkResponseModel = await api.post(`api/students/${student.id}/updateMark/${student.mark!.id}/${markType}`).json();

            if (response.error == null) {
                setStudents(prevStudents =>
                    prevStudents.map(s =>
                        s.id === student.id ? { ...s, mark: response.data.mark } : s
                    )
                );
                enqueueSnackbar("Ok!", { variant: "success" });
            }
            else {
                enqueueSnackbar(response.error.description, { variant: "error" });
            }
        }
        catch (error) {
            enqueueSnackbar((error as Error).message, { variant: "error" });
        }
    }

    const HandleMark = async (student: StudentModel, markType: number) => {
        if (student.mark === null) {
            await SetMark(student, markType);
            return;
        }

        if (student.mark.markType === markType) {
            await DeleteMark(student);
        }
        else {
            await UpdateMark(student, markType);
        }
    }

    const HandleInfo = () => {
        if (groupInfo !== null)
            setShowInfo(true);
    }

    const HandleGroupHead = () => {
        navigate("/student/" + groupInfo!.head.id);
    }

    const HandleTelegramGroup = () => {
        window.open(`tg://resolve?domain=${groupInfo!.telegramLink}`, "_blank");
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
                    onClick={ReturnToClasses}>
                    Classes
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', height: "35px", width: "200px" }}>
                    <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    <TextField
                        value={search}
                        onChange={HandleSearch}
                        label="Search"
                        variant="standard"
                        size="small" />
                </Box>

                <IconButton
                    color="primary"
                    onClick={HandleInfo}>
                    <Info sx={{ width: "35px", height: "35px", margin: "-10px -5px 0 0" }} />
                </IconButton>
            </Stack>

            {students.map((student: StudentModel) =>
                <StudentItemComponent
                    key={uuidv4()}
                    student={student}
                    HandleMark={HandleMark}
                    HandleStudentClick={HandleStudentClick} />
            )}

            {groupInfo !== null &&
                <Dialog
                    open={showInfo}
                    onClose={() => { setShowInfo(false) }}>

                    <h2 style={{ margin: "0", padding: "25px 0 0 30px" }}>{groupInfo!.groupName}</h2>

                    <DialogContent>
                        <Card sx={{ mt: "1px", mb: "1px" }}>
                            <CardActionArea onClick={HandleGroupHead}>
                                <CardContent>
                                    <Stack
                                        direction={"row"}
                                        sx={{
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                        }}>
                                        <AccountBox htmlColor="#0096FF" />
                                        <p style={{ margin: "0 0 0 10px", fontSize: "20px" }}>Староста</p>
                                    </Stack>
                                    <h2 style={{ margin: "0" }}>{groupInfo!.head.lastName} {groupInfo!.head.firstName}</h2>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        <Card sx={{ mt: "1px", mb: "1px" }}>
                            <CardActionArea onClick={HandleTelegramGroup}>
                                <CardContent>
                                    <Stack
                                        direction={"row"}
                                        sx={{
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                        }}>
                                        <Telegram htmlColor="#0096FF" />
                                        <p style={{ margin: "0 0 0 10px", fontSize: "20px" }}>Telegram група</p>
                                    </Stack>
                                    <h2 style={{ margin: "0" }}>@{groupInfo!.telegramLink}</h2>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </DialogContent>
                </Dialog>
            }
        </Stack>
    )
}

export default StudentsPage;