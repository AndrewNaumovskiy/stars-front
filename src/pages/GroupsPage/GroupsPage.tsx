import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

import ClassGroupComponent from "../../components/ClassGroupComponent";

import { api, IError, uuidv4 } from "../../utils";
import { ImageList } from "@mui/material";

import "./GroupsPage.css";

interface GetGroupsResponseModel {
    data: GetGroupsResponseData;
    error: IError;
}
interface GetGroupsResponseData {
    groups: GroupModel[];
}

interface GroupModel {
    day: string;
    groups: GroupInDayModel[];
}

export interface GroupInDayModel {
    id: number;
    name: string;
    lessonNumber: number;
    status: number;
}

function GroupsPage() {
    const { enqueueSnackbar } = useSnackbar();

    const [groups, setGroups] = useState<GroupModel[]>([]);

    useEffect(() => {
        GetGroups();
    }, []);

    const GetGroups = async () => {
        try {
            const response: GetGroupsResponseModel = await api.get("api/groups").json();

            if (response.error == null) {
                setGroups(response.data.groups);
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
        <>
            {groups.map((group: GroupModel) => (
                <div key={uuidv4()}>
                    <h2 className="meow">{group.day}</h2>
                    <ImageList
                        cols={2}
                        gap={4}>
                        {group.groups.map((groupInDay: GroupInDayModel) =>
                            <ClassGroupComponent
                                key={uuidv4()}
                                group={groupInDay} />
                        )}
                    </ImageList>
                </div>
            ))}
        </>
    )
}

export default GroupsPage;