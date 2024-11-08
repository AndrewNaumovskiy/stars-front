import { FC, useEffect, useState } from "react";

import { Card, CardActionArea, CardContent, CardHeader, IconButton, Stack } from "@mui/material";

import { ThumbUp, ThumbDownAlt, StarBorder, PersonOff } from "@mui/icons-material";

import { StudentModel } from "../../pages/StudentsPage/StudentsPage";

const MISSING_STUDENT: number = 0;
const BAD_MARK_STUDENT: number = 1;
const GOOD_MARK_STUDENT: number = 2;

interface StudentItemComponentProps {
    student: StudentModel;
    HandleStudentClick(student: StudentModel): void;
    HandleMark(student: StudentModel, markType: number): void;
}

const StudentItemComponent: FC<StudentItemComponentProps> = ({ student, HandleStudentClick, HandleMark }) => {

    const [missingMarkSet, setMissingMarkSet] = useState<boolean>(false);
    const [badMarkSet, setBadMarkSet] = useState<boolean>(false);
    const [goodMarkSet, setGoodMarkSet] = useState<boolean>(false);

    useEffect(() => {
        if (student.mark === null)
            return;

        if (student.mark.markType === BAD_MARK_STUDENT)
            setBadMarkSet(true);
        else if (student.mark.markType === MISSING_STUDENT)
            setMissingMarkSet(true);
        else if (student.mark.markType === GOOD_MARK_STUDENT)
            setGoodMarkSet(true);
    }, []);

    function ClickMark(markType: number) {
        if (markType === BAD_MARK_STUDENT) {
            setMissingMarkSet(false);
            setBadMarkSet(true);
            setGoodMarkSet(false);
        }
        else if (markType === MISSING_STUDENT) {
            setMissingMarkSet(true);
            setBadMarkSet(false);
            setGoodMarkSet(false);
        }
        else if (markType === GOOD_MARK_STUDENT) {
            setMissingMarkSet(false);
            setBadMarkSet(false);
            setGoodMarkSet(true);
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

                <Stack direction={"row"}>
                    <IconButton
                        onClick={() => ClickMark(MISSING_STUDENT)}
                        sx={{ backgroundColor: missingMarkSet ? "pink" : "transparent" }}>
                        <PersonOff htmlColor="red" />
                    </IconButton>
                    <IconButton
                        sx={{ backgroundColor: badMarkSet ? "pink" : "transparent" }}
                        onClick={() => ClickMark(BAD_MARK_STUDENT)}>
                        <ThumbDownAlt htmlColor="brown" />
                    </IconButton>
                    <IconButton
                        sx={{ backgroundColor: goodMarkSet ? "lightgreen" : "transparent" }}
                        onClick={() => ClickMark(GOOD_MARK_STUDENT)}>
                        <ThumbUp htmlColor="green" />
                    </IconButton>
                </Stack>
            </Stack>
        </Card>
    )
}

export default StudentItemComponent;

