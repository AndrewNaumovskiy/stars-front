import { FC, useEffect, useState } from "react";

import { Card, CardActionArea, CardContent, CardHeader, IconButton, Stack } from "@mui/material";

import { ThumbUp, MacroOff, StarBorder } from "@mui/icons-material";

import { StudentModel } from "../../pages/StudentsPage/StudentsPage";

interface StudentItemComponentProps {
    student: StudentModel;
    HandleStudentClick(student: StudentModel): void;
    HandleMark(student: StudentModel, markType: number): void;
}

const StudentItemComponent: FC<StudentItemComponentProps> = ({ student, HandleStudentClick, HandleMark }) => {

    const [badMarkDisabled, setBadMarkDisabled] = useState<boolean>(false);
    const [goodMarkDisabled, setGoodMarkDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (student.mark === null)
            return;

        if (student.mark.markType === 0)
            setBadMarkDisabled(true);

        if (student.mark.markType === 1)
            setGoodMarkDisabled(true);
    }, []);

    function ClickMark(markType: number) {
        if (markType === 0) {
            setBadMarkDisabled(true);
            setGoodMarkDisabled(false);
        }
        else if (markType === 1) {
            setBadMarkDisabled(false);
            setGoodMarkDisabled(true);
        }

        HandleMark(student, markType);
    }

    return (
        <Card sx={{ marginTop: "1px" }}>
            <Stack
                direction={"row"}
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                <CardActionArea onClick={() => HandleStudentClick(student)}>
                    <Stack
                        direction={"row"}
                        sx={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                            padding: "7px"
                        }}>
                        {student.isFavorite ? <StarBorder htmlColor="orange" /> : null}
                        <CardHeader title={`${student.lastName} ${student.firstName}`} sx={{ padding: "0px", marginLeft: "7px" }} />
                    </Stack>

                    <CardContent sx={{ pb: "3px", pt: "2px" }} >
                        {student.impression}
                    </CardContent>
                </CardActionArea>

                <Stack direction={"row"}
                    sx={{ width: "90px" }}>
                    <IconButton
                        disabled={badMarkDisabled}
                        color="primary"
                        onClick={() => ClickMark(0)}>
                        <MacroOff />
                    </IconButton>
                    <IconButton
                        disabled={goodMarkDisabled}
                        color="primary"
                        onClick={() => ClickMark(1)}>
                        <ThumbUp />
                    </IconButton>
                </Stack>
            </Stack>
        </Card>
    )
}

export default StudentItemComponent;

