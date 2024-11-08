import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";

import { Button, Stack, TextField } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";

import { StatusResponseModel } from "../StudentsPage/StudentsPage";

import { api, IError } from "../../utils";

import "./ReschedulePage.css";

const now: Dayjs = dayjs();

const defaultSchedule: Dayjs[] = [
    now.set('hour', 8).set('minute', 0),
    now.set('hour', 9).set('minute', 20),

    now.set('hour', 9).set('minute', 35),
    now.set('hour', 10).set('minute', 55),

    now.set('hour', 11).set('minute', 25),
    now.set('hour', 12).set('minute', 45),

    now.set('hour', 12).set('minute', 55),
    now.set('hour', 14).set('minute', 15)
];

interface ScheduleModel {
    firstStart: Dayjs;
    firstEnd: Dayjs;

    secondStart: Dayjs;
    secondEnd: Dayjs;

    thirdStart: Dayjs;
    thirdEnd: Dayjs;

    fourthStart: Dayjs;
    fourthEnd: Dayjs;

    hourOffset: number;
}

interface GetScheduleResponseModel {
    data: GetScheduleDataModel;
    error: IError;
}
interface GetScheduleDataModel {
    schedule: ScheduleModel;
    hourOffset: number;
}

function ReschedulePage() {
    const { enqueueSnackbar } = useSnackbar();

    const [firstStart, setFirstStart] = useState<Dayjs>(defaultSchedule[0]);
    const [firstEnd, setFirstEnd] = useState<Dayjs>(defaultSchedule[1]);

    const [secondStart, setSecondStart] = useState<Dayjs>(defaultSchedule[2]);
    const [secondEnd, setSecondEnd] = useState<Dayjs>(defaultSchedule[3]);

    const [thirdStart, setThirdStart] = useState<Dayjs>(defaultSchedule[4]);
    const [thirdEnd, setThirdEnd] = useState<Dayjs>(defaultSchedule[5]);

    const [fourthStart, setFourthStart] = useState<Dayjs>(defaultSchedule[6]);
    const [fourthEnd, setFourthEnd] = useState<Dayjs>(defaultSchedule[7]);

    const [hourOffset, setHourOffset] = useState<number>(2);

    useEffect(() => {
        GetCurrentSchedule();
    }, []);

    const GetCurrentSchedule = async () => {
        try {
            const response: GetScheduleResponseModel = await api.get('api/groups/schedule').json();

            if (response.error == null) {
                const schedule: ScheduleModel = response.data.schedule;

                setFirstStart(dayjs(schedule.firstStart));
                setFirstEnd(dayjs(schedule.firstEnd));

                setSecondStart(dayjs(schedule.secondStart));
                setSecondEnd(dayjs(schedule.secondEnd));

                setThirdStart(dayjs(schedule.thirdStart));
                setThirdEnd(dayjs(schedule.thirdEnd));

                setFourthStart(dayjs(schedule.fourthStart));
                setFourthEnd(dayjs(schedule.fourthEnd));

                setHourOffset(response.data.hourOffset);
            }
            else {
                enqueueSnackbar(response.error.description, { variant: "error" });
            }
        }
        catch (error) {
            enqueueSnackbar((error as Error).message, { variant: "error" });
        }
    }

    const HandleSaveClick = async () => {
        const schedule: ScheduleModel = {
            firstStart: firstStart,
            firstEnd: firstEnd,

            secondStart: secondStart,
            secondEnd: secondEnd,

            thirdStart: thirdStart,
            thirdEnd: thirdEnd,

            fourthStart: fourthStart,
            fourthEnd: fourthEnd,

            hourOffset: hourOffset
        };

        try {
            const response: StatusResponseModel = await api.post('api/groups/updateSchedule', {
                json: schedule,
            }).json();

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
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction={"row"}
                    sx={{
                        alignItems: "center",
                    }}>
                    <h2>I</h2>
                    <MobileTimePicker
                        format="HH:mm"
                        value={firstStart}
                        onChange={(value) => { setFirstStart(value!) }} />
                    <MobileTimePicker
                        format="HH:mm"
                        value={firstEnd}
                        onChange={(value) => { setFirstEnd(value!) }} />
                </Stack>

                <Stack direction={"row"}
                    sx={{
                        alignItems: "center",
                    }}>
                    <h2>II</h2>
                    <MobileTimePicker
                        format="HH:mm"
                        value={secondStart}
                        onChange={(value) => { setSecondStart(value!) }} />
                    <MobileTimePicker
                        format="HH:mm"
                        value={secondEnd}
                        onChange={(value) => { setSecondEnd(value!) }} />
                </Stack>

                <Stack direction={"row"}
                    sx={{
                        alignItems: "center",
                    }}>
                    <h2>III</h2>
                    <MobileTimePicker
                        format="HH:mm"
                        value={thirdStart}
                        onChange={(value) => { setThirdStart(value!) }} />
                    <MobileTimePicker
                        format="HH:mm"
                        value={thirdEnd}
                        onChange={(value) => { setThirdEnd(value!) }} />
                </Stack>

                <Stack direction={"row"}
                    sx={{
                        alignItems: "center",
                    }}>
                    <h2>IV</h2>
                    <MobileTimePicker
                        format="HH:mm"
                        value={fourthStart}
                        onChange={(value) => { setFourthStart(value!) }} />
                    <MobileTimePicker
                        format="HH:mm"
                        value={fourthEnd}
                        onChange={(value) => { setFourthEnd(value!) }} />
                </Stack>
            </LocalizationProvider>

            <Stack direction={"row"}
                sx={{
                    alignItems: "center",
                }}>
                <span style={{ fontWeight: "600", fontSize: "25px" }}>Hour offset</span>
                <TextField
                    value={hourOffset}
                    onChange={(event) => { setHourOffset(parseInt(event.target.value)) }}
                    size="small"
                    sx={{ marginLeft: "8px", width: "100px" }} />
            </Stack>

            <Button
                variant="outlined"
                onClick={HandleSaveClick}>Save</Button>
        </>
    );
}

export default ReschedulePage;