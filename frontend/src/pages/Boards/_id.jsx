
import Container from '@mui/material/Container';
import ModeSelect from '../../components/ModeSelect';
import AppBar from '../../components/AppBar';
import BoardBar from './BoardBar';
import BoardContent from './BoardContent';

function Boards() {
    return (
        <Container disableGutters maxWidth={false} sx={{ height: '100vh', backgroundColor: 'primary.main' }}>
          <AppBar />
          <BoardBar />
          <BoardContent />
        </Container>
      )
}

export default Boards
