import { useSnackbar } from "notistack";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowBackIos, Search } from "@mui/icons-material";
import { Box, Button, Stack, TextField } from "@mui/material";

import { api, IError, uuidv4 } from "../../utils";
import StudentItemComponent from "../../components/StudentItemComponent";

interface GetStudentsResponseModel {
    data: GetStudentsResponseData;
    error: IError;
}

interface GetStudentsResponseData {
    students: StudentModel[];
}

export interface StudentModel {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    groupFk: number;

    mark: MarkDbModel;
}

interface MarkDbModel {
    id: number;
    markType: number;
}

interface StatusResponseModel {
    data: StatusResponseData;
    error: IError;
}

interface StatusResponseData {
    status: string;
}

function StudentsPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { id } = useParams<string>();

    const [search, setSearch] = useState<string>("");
    const [debouncedSearch] = useDebounce(search, 500);

    const [students, setStudents] = useState<StudentModel[]>([]);

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

                <Box sx={{ display: 'flex', alignItems: 'flex-end', height: "35px" }}>
                    <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    <TextField
                        value={search}
                        onChange={HandleSearch}
                        label="Search"
                        variant="standard"
                        size="small" />
                </Box>
            </Stack>

            {students.map((student: StudentModel) =>
                <StudentItemComponent
                    key={uuidv4()}
                    student={student}
                    HandleMark={HandleMark}
                    HandleStudentClick={HandleStudentClick} />
            )}
        </Stack>
    )
}

export default StudentsPage;