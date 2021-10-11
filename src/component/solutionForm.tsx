import Editor from "@monaco-editor/react";
import { FormControl, Select, MenuItem, TextField, Button, Box, CircularProgress } from "@mui/material"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorSharpIcon from '@mui/icons-material/ErrorSharp';
import axios, { AxiosResponse } from "axios";
import { debounce } from 'lodash'
import { useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { Python3Template } from "../codeTemplates";

interface Props {
    tasks: {
        id: number,
        name: string,
        description: string
    }[]
}

interface AddSolution {
    taskId: number,
    code: string,
    languageName: string,
}

interface AddSolutionResponse {
    status: number
}

interface Solution {
    taskId: number,
    code: string,
    status: number
}

const SolutionForm = ({ tasks }: Props) => {
    const { enqueueSnackbar } = useSnackbar();

    const nameInputEl = useRef<any>(null);
    const [userLoading, setUserLoading] = useState<boolean>(false);
    const [user, setUser] = useState<{ id: number, name: string }>();
    const [solutions, setSolutions] = useState<Solution[]>()
    const submitName = () => {
        setUserLoading(true);
        axios.post<{ name: string }, AxiosResponse<number>>('https://localhost:44345/Participant/', {
            name: nameInputEl.current.value
        }).then((response: AxiosResponse<number>) => {
            setUser({ id: response.data, name: nameInputEl.current.value });
            return response.data
        }).then((id) =>
            axios.get<never, AxiosResponse<{ solutions: Solution[] }>>(`https://localhost:44345/Participant/${id}/solution`)
        ).then((response) => {
            setSolutions(response.data.solutions)
        }).catch(() => {
            enqueueSnackbar('Error, try again later', { variant: 'error' });
        }).finally(() => setUserLoading(false));
    }

    const [taskId, setTaskId] = useState(0);

    const [code, setCode] = useState(Python3Template);
    const onCodeChange = debounce((value) => setCode(value), 500)

    const [loading, setLoading] = useState(false);

    return (
        <div>
            <Box
                component="form"
                onSubmit={(e: any) => { e.preventDefault(); submitName(); }}
                sx={{
                    '&': { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                    '& > :not(style)': { m: '5px', width: '200px' }
                }}
            >
                <TextField
                    inputRef={nameInputEl}
                    placeholder={'Enter your name...'}
                />
                <Button variant='contained' type="button" onClick={submitName}>
                    {userLoading ? <CircularProgress variant='indeterminate' color='info' size={24} /> : 'Confirm'}
                </Button>
            </Box>
            <Box
                component="form"
                onSubmit={(e: any) => { e.preventDefault(); submitName(); }}
                style={
                    { width: '100ch', alignItems: 'center', display: 'inline-grid' }
                }
            >
                {user && solutions ?
                    <FormControl fullWidth>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="Task"
                            onChange={(event) => {
                                const taskId = event.target.value as number;
                                setTaskId(taskId);
                                const taskSolution = solutions.find(s => s.taskId === taskId);
                                if (taskSolution?.code)
                                    setCode(taskSolution.code);
                                else
                                    setCode(Python3Template);
                            }}
                        >
                            {tasks.map(t =>
                                <MenuItem key={t.id} value={t.id}>
                                    {t.name}
                                    {!solutions.find(s => s.taskId === t.id) ? <div /> : solutions.find(s => s.taskId === t.id)?.status === 3 ? <CheckCircleOutlineIcon /> : <ErrorSharpIcon />}
                                </MenuItem>)}
                        </Select>
                    </FormControl>
                    : <div />}
                {user && taskId ? <p>{tasks.find(t => t.id === taskId)?.description}</p> : <div />}
                {user && taskId ? <Editor
                    width={860}
                    height={400}
                    onChange={(event) => event ? onCodeChange(event) : setCode('')}
                    language='python'
                    value={code}
                    theme='vs-dark'
                /> : <div />}
                {user && taskId && code ?
                    <Button
                        variant='contained'
                        onClick={async () => {
                            setLoading(true)
                            axios.post<AddSolution, AxiosResponse<AddSolutionResponse>>(`https://localhost:44345/Participant/${user.id}/solution`, {
                                taskId: taskId,
                                code: code,
                                languageName: 'python3'
                            }).then(response => {
                                if (response.data.status === 3) {
                                    enqueueSnackbar(`Task \'${tasks.find(t => t.id === taskId)?.name}\' solved!`, { variant: 'success' });
                                }
                                if (response.data.status === 2 || response.data.status === 1) {
                                    enqueueSnackbar(`Task \'${tasks.find(t => t.id === taskId)?.name}\' failed!`, { variant: 'error' });
                                }
                            }).then(() =>
                                axios.get<never, AxiosResponse<{ solutions: Solution[] }>>(`https://localhost:44345/Participant/${user.id}/solution`)
                            ).then((response) => {
                                setSolutions(response.data.solutions)
                            }).catch(() => {
                                enqueueSnackbar('Error, try again later', { variant: 'error' });
                            }).finally(() => setLoading(false));
                        }}
                    >
                        {loading ? <CircularProgress variant='indeterminate' color='info' size={24} /> : 'Try'}
                    </Button> : <div />}
            </Box>
        </div>

    )
}

export default SolutionForm;