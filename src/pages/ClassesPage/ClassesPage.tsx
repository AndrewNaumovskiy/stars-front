import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, IError, uuidv4 } from "../../utils";

import ClassGroupComponent from "../../components/ClassGroupComponent";

import { Fab, ImageList, Stack } from "@mui/material";

import EventNoteIcon from '@mui/icons-material/EventNote';

import "./ClassesPage.css";

interface GetGroupsResponseModel {
    data: GetGroupsResponseData;
    error: IError;
}
interface GetGroupsResponseData {
    groups: GroupModel[];
}

interface GroupModel {
    dayOfWeek: string;
    date: string;
    dateReschedule: string;
    isToday: boolean;
    groups: GroupInDayModel[];
}

export interface GroupInDayModel {
    id: number;
    name: string;
    lessonNumber: number;
    status: number;
    startTime: string;
    endTime: string;
    classes: number;
    cabinet: string;
}

function ClassesPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [groups, setGroups] = useState<GroupModel[]>([]);

    useEffect(() => {
        InitFromLocalStorage();
        GetGroups();
    }, []);

    function InitFromLocalStorage() {
        if (localStorage.getItem("groups") == null)
            return;

        const groups: GroupModel[] = JSON.parse(localStorage.getItem("groups") as string);
        setGroups(groups);
    }

    const GetGroups = async () => {
        try {
            const response: GetGroupsResponseModel = await api.get("api/groups").json();

            if (response.error == null) {
                setGroups(response.data.groups);

                localStorage.setItem("groups", JSON.stringify(response.data.groups));
            }
            else {
                enqueueSnackbar(response.error.description, { variant: "error" });
            }
        }
        catch (error) {
            enqueueSnackbar((error as Error).message, { variant: "error" });
        }
    }

    function HandleRescheduleClick() {
        navigate("/schedule");
    }

    return (
        <>
            {groups.map((group: GroupModel) => (
                <div key={uuidv4()}>
                    <h2 className="meow">{group.dayOfWeek}</h2>
                    {group.isToday ? <h2 className="meow">(Today)</h2> : null}

                    <Stack
                        direction={"row"}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                        <span>Date: <b>{group.date}</b></span>
                        <span>Rescheduled to: <b>{group.dateReschedule}</b></span>

                    </Stack>

                    <ImageList
                        cols={2}
                        gap={4}
                        sx={{ overflowY: "unset", marginTop: "0px" }}>
                        {group.groups.map((groupInDay: GroupInDayModel) =>
                            <ClassGroupComponent
                                key={uuidv4()}
                                group={groupInDay} />
                        )}
                    </ImageList>
                </div>
            ))}
            <Fab
                onClick={HandleRescheduleClick}
                sx={
                    {
                        position: "fixed",
                        bottom: "5px",
                        left: "80%"
                    }}>
                <EventNoteIcon />
            </Fab>
        </>
    )
}

export default ClassesPage;