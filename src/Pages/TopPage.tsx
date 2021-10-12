import Leaderboard from '../component/leaderboard';
import Container from '@mui/material/Container';
import useAxios from 'axios-hooks';
import { TopResponse } from './TopResponse';
import { Resources } from '../configuration/Resources';

const TopPage = () => {

    const [{ data, loading, error }, refetch] = useAxios<TopResponse>(`${Resources.api}/Participant?top=3`, {
        useCache: false
    });

    return (
        <Container fixed>
            <Leaderboard loading={loading} rows={data?.participants.map(p => ({ name: p.userName, tasks: p.tasks })) ?? []} />
        </Container>
    )
}

export default TopPage;