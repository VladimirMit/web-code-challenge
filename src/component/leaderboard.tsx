import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from "@mui/material";

interface Props { 
    rows: {name : string, tasks: string[]}[],
    loading: boolean
}

const Leaderboard = ({ rows, loading } : Props) => {

    if (loading)
        return <CircularProgress />

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Success solutions</TableCell>
                        <TableCell align="right">Tasks</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.tasks.length}</TableCell>
                            <TableCell align="right">{row.tasks.join(', ')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Leaderboard;