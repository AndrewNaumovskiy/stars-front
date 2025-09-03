import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";

import { Button, Slider, Stack } from "@mui/material";
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

const scheduleFor9: Dayjs[] = [
    now.set('hour', 9).set('minute', 0),
    now.set('hour', 10).set('minute', 10),

    now.set('hour', 10).set('minute', 20),
    now.set('hour', 11).set('minute', 30),

    now.set('hour', 11).set('minute', 50),
    now.set('hour', 13).set('minute', 0),

    now.set('hour', 13).set('minute', 10),
    now.set('hour', 14).set('minute', 20)
];

const scheduleFor10: Dayjs[] = [
    now.set('hour', 10).set('minute', 0),
    now.set('hour', 11).set('minute', 0),

    now.set('hour', 11).set('minute', 5),
    now.set('hour', 12).set('minute', 5),

    now.set('hour', 12).set('minute', 25),
    now.set('hour', 13).set('minute', 25),

    now.set('hour', 13).set('minute', 30),
    now.set('hour', 14).set('minute', 30)
];

const scheduleFor11: Dayjs[] = [
    now.set('hour', 11).set('minute', 0),
    now.set('hour', 12).set('minute', 0),

    now.set('hour', 12).set('minute', 5),
    now.set('hour', 13).set('minute', 5),

    now.set('hour', 13).set('minute', 20),
    now.set('hour', 14).set('minute', 20),

    now.set('hour', 14).set('minute', 25),
    now.set('hour', 15).set('minute', 25)
];

const scheduleFor12: Dayjs[] = [
    now.set('hour', 12).set('minute', 0),
    now.set('hour', 12).set('minute', 50),

    now.set('hour', 12).set('minute', 55),
    now.set('hour', 13).set('minute', 45),

    now.set('hour', 14).set('minute', 0),
    now.set('hour', 14).set('minute', 50),

    now.set('hour', 14).set('minute', 55),
    now.set('hour', 15).set('minute', 45)
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
}

interface GetScheduleResponseModel {
    data: GetScheduleDataModel;
    error: IError;
}
interface GetScheduleDataModel {
    schedule: ScheduleModel;
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

    const [scheduleType, setScheduleType] = useState<number>(8);

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
        var utcOffset = dayjs().utcOffset();

        const schedule: ScheduleModel = {
            firstStart: firstStart.add(utcOffset, 'minute'),
            firstEnd: firstEnd.add(utcOffset, 'minute'),

            secondStart: secondStart.add(utcOffset, 'minute'),
            secondEnd: secondEnd.add(utcOffset, 'minute'),

            thirdStart: thirdStart.add(utcOffset, 'minute'),
            thirdEnd: thirdEnd.add(utcOffset, 'minute'),

            fourthStart: fourthStart.add(utcOffset, 'minute'),
            fourthEnd: fourthEnd.add(utcOffset, 'minute')
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

    function handleScheduleTypeChange(_event: Event, value: number | number[]) {
        var tempValue: number = value as number;
        setScheduleType(tempValue);

        var temp = getScheduleType(tempValue);

        setFirstStart(temp[0]);
        setFirstEnd(temp[1]);

        setSecondStart(temp[2]);
        setSecondEnd(temp[3]);

        setThirdStart(temp[4]);
        setThirdEnd(temp[5]);

        setFourthStart(temp[6]);
        setFourthEnd(temp[7]);
    }

    function getScheduleType(value: number): Dayjs[] {
        switch (value) {
            case 8:
                return defaultSchedule;
            case 9:
                return scheduleFor9;
            case 10:
                return scheduleFor10;
            case 11:
                return scheduleFor11;
            case 12:
                return scheduleFor12;
            default:
                return defaultSchedule;
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

            <Slider
                defaultValue={8}
                step={1}
                marks
                min={8}
                max={12}
                valueLabelDisplay="auto"
                value={scheduleType}
                onChange={handleScheduleTypeChange}
                sx={{ width: window.innerWidth - 100, marginLeft: "20px" }}
            />

            <Button
                variant="outlined"
                onClick={HandleSaveClick}>Save</Button>
        </>
    );
}

export default ReschedulePage;