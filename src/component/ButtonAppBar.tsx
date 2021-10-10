import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import { Leaderboard as LeaderboardIcon } from '@mui/icons-material';

export default function ButtonAppBar() {
  const history = useHistory();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cognizant Code Challenge
          </Typography>
          <Button color="inherit" onClick={() => history.push('/solve')}>Solve</Button>
          <Button color="inherit" onClick={() => history.push('/top')}><LeaderboardIcon />Top</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
