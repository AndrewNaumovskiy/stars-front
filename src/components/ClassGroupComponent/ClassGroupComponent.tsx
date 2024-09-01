import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { GroupInDayModel } from "../../pages/ClassesPage/ClassesPage";

interface ClassGroupComponentProps {
    group: GroupInDayModel;
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

const ClassGroupComponent: FC<ClassGroupComponentProps> = ({ group }) => {
    const navigate = useNavigate();

    function HandleClick() {
        navigate("/group/" + group.id);
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

                        {group.status === 1 ? <AccessTimeIcon htmlColor="blue" /> : null}
                        {group.status === 2 ? <CheckCircleOutlineIcon htmlColor="green" /> : null}
                    </Stack>

                    <Typography sx={{ color: 'text.secondary' }}>
                        {group.name} group
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ClassGroupComponent;