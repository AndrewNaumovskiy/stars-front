import dayjs from "dayjs";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { GroupInDayModel } from "../../pages/ClassesPage/ClassesPage";

interface ClassGroupComponentProps {
    group: GroupInDayModel;
    isToday: boolean;
}

const roman: { [key: number]: string } = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
};

const ToRoman = (num: number): string => {
    return roman[num];
}

const ClassGroupComponent: FC<ClassGroupComponentProps> = ({ group, isToday }) => {
    const navigate = useNavigate();

    function HandleClick() {
        navigate("/group/" + group.id);
    }

    function GetLessonStatus(): any {
        if (!isToday)
            return null;

        var currDateHour = dayjs().hour();
        var currDateMinute = dayjs().minute();

        var array = group.startTime.split(":");
        var groupStartHour = parseInt(array[0]);
        var groupStartMinute = parseInt(array[1]);

        array = group.endTime.split(":");
        var groupEndHour = parseInt(array[0]);
        var groupEndMinute = parseInt(array[1]);

        if (currDateHour > groupEndHour || (currDateHour === groupEndHour && currDateMinute > groupEndMinute)) {
            return <CheckCircleOutlineIcon htmlColor="green" />;
        }

        if (currDateHour < groupStartHour || (currDateHour === groupStartHour && currDateMinute < groupStartMinute)) {
            return null;
        }

        return <AccessTimeIcon htmlColor="blue" />;
    }

    return (
        <Card>
            <CardActionArea onClick={HandleClick}>
                <CardContent>
                    <Stack
                        direction={"row"}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                        }}>
                        <h2 className={"meow"}>{ToRoman(group.lessonNumber)}</h2>

                        <Stack sx={{ mt: "15px" }}>
                            <p style={{ margin: "0px", fontSize: "16px" }}>{group.startTime}</p>
                            <p style={{ margin: "0px", fontSize: "16px" }}>{group.endTime}</p>
                        </Stack>

                        {GetLessonStatus()}
                    </Stack>

                    <Stack
                        direction={"row"}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                        <Typography sx={{ color: 'text.secondary' }}>
                            {group.name} group
                        </Typography>

                        <Typography sx={{ color: 'text.secondary' }}>
                            <b>{group.classes}</b>
                        </Typography>

                        <Typography sx={{ color: 'text.secondary' }}>
                            {group.cabinet}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ClassGroupComponent;