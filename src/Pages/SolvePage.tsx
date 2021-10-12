import { Container } from '@mui/material';
import useAxios from 'axios-hooks';
import React from 'react';
import SolutionForm from '../component/solutionForm';
import { Resources } from '../configuration/Resources';

interface TaskResponse {
    tasks: {
        id: number,
        name: string,
        description: string
    }[]
}

const SolvePage = () => {
    const [{ data, loading, error }, refetch] = useAxios<TaskResponse>(`${Resources.api}/Task`);

    return (
        <div>
            <Container fixed>
                <SolutionForm tasks={data?.tasks ?? []}/>
            </Container>
        </div>);
}

export default SolvePage;