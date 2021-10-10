import Editor from "@monaco-editor/react";
import { FormControl, Select, MenuItem, TextField, Button, FormGroup, Box } from "@mui/material"
import axios from "axios";
import { debounce } from 'lodash'
import { useRef, useState } from "react";

interface Props {
    tasks: {
        id: number,
        name: string,
        description: string
    }[]
}

const SolutionForm = ({ tasks }: Props) => {

    const nameInputEl = useRef<any>(null);
    const [name, setName] = useState("")
    const submitName = () => {
        setName(nameInputEl.current.value)
    }

    const [taskId, setTaskId] = useState(0);

    const [code, setCode] = useState(`def solution(n):
   
    # Check if input is 0 then it will
    if n == 0:
        return 0
 
    # Check if n is 1,2
    # it will return 1
    elif n == 1 or n == 2:
        return 1
 
    else:
        return solution(n-1) + solution(n-2)`);
    const onCodeChange = debounce((value) => setCode(value), 1500)

    const [lastTry, setLastTry] = useState(0);
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <Box
                component="form"
                onSubmit={(e: any) => { e.preventDefault(); submitName(); }}
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
            >
                <TextField
                    inputRef={nameInputEl}
                    placeholder={'Enter your name...'}
                />
                <Button type="button" onClick={submitName}>Confirm</Button>
            </Box>
            <Box
                component="form"
                onSubmit={(e: any) => { e.preventDefault(); submitName(); }}
                style={
                    {width: '100ch', alignItems: 'center', display: 'inline-grid' }
                }
            >
                {name ?
                    <FormControl fullWidth>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="Task"
                            onChange={(event) => setTaskId(event.target.value as number)}
                        >
                            {tasks.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    : <div />}
                {name && taskId ? <p>{tasks.find(t => t.id === taskId)?.description}</p> : <div />}
                {name && taskId ? <Editor
                    width={800}
                    height={300}
                    onChange={(event) => event ? onCodeChange(event) : setCode('')}
                    language='python'
                    defaultValue={code}
                    theme='vs-dark'
                /> : <div />}
                {name && taskId && code ?
                    <Button onClick={async () => {
                        setLoading(true)
                        axios.post<AddSolution, AddSolutionResponse>(`https://localhost:44345/Participant/${4}/solution`, {
                            taskId: taskId,
                            code: code,
                            languageName: 'python3'
                        }).then(data => {
                            setLastTry(data.status);
                        }).catch((error) => {
                            console.log(error)
                        }).finally(() => setLoading(false));
                    }}>Try<Button> : <div />}
            </Box>
        </div>

    )
}

interface AddSolution {
    taskId: number,
    code: string,
    languageName: string,
}

interface AddSolutionResponse {
    status: number
}


export default SolutionForm;