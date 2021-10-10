import { Container } from '@mui/material';
import useAxios from 'axios-hooks';
import React from 'react';
import SolutionForm from '../component/solutionForm';

interface TaskResponse {
    tasks: {
        id: number,
        name: string,
        description: string
    }[]
}

const SolvePage = () => {
    const [{ data, loading, error }, refetch] = useAxios<TaskResponse>('https://localhost:44345/Task');

    return (
        <div>
            <Container fixed>
                <SolutionForm tasks={data?.tasks ?? []}/>
            </Container>
        </div>);
}

export default SolvePage;