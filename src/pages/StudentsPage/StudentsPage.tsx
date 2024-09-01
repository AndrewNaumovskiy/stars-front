import { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
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

    isFavorite: boolean;
    impression: string;

    mark: MarkDbModel;
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

function StudentsPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { id } = useParams<string>();

    const [search, setSearch] = useState<string>("");
    const [debouncedSearch] = useDebounce(search, 500);

    const [students, setStudents] = useState<StudentModel[]>([]);
    const [groupInfo, setGroupInfo] = useState<GroupInfoModel | null>(null);

    const [showInfo, setShowInfo] = useState<boolean>(false);

    function ReturnToClasses() {
        navigate("/");
    }

    useEffect(() => {
        GetStudents(debouncedSearch);
    }, [debouncedSearch]);

    const GetStudents = async (search: string = "") => {
        try {
            const response: GetStudentsResponseModel = await api.get(`api/students/group/${id}?search=${search}`).json();

            if (response.error == null) {
                setStudents(response.data.students);
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
    }

    const HandleStudentClick = (student: StudentModel) => {
        navigate("/student/" + student.id);
    }

    const HandleMark = async (student: StudentModel, markType: number) => {
        var url: string = `api/students/${student.id}/setMark/${markType}`;

        if (student.mark !== null)
            url = `api/students/${student.id}/updateMark/${student.mark.id}/${markType}`;

        try {
            const response: StatusResponseModel = await api.post(url).json();

            if (response.error == null) {
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