import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import { capitalizeFirstLetter } from '~/utils/formatters';
import BoardUserGroup from './BoardUserGroup';
import InviteBoardUser from './InviteBoardUser';
import ChangeBackgroundModal from '~/components/AppBar/ChangeBackgroundModal'; // Corrected import

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
};

function BoardBar({ board }) {
  const [openChangeBackground, setOpenChangeBackground] = useState(false);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);

  const openChangeBackgroundModal = () => {
    setOpenChangeBackground(true);
  };

  const closeChangeBackgroundModal = () => {
    setOpenChangeBackground(false);
    setBackgroundImageFile(null);
  };

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#40534C')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>

        <Chip
          sx={MENU_STYLES}
          icon={board?.type === 'private' ? <LockIcon /> : <PublicIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<WallpaperIcon />}
          label="Change Background"
          clickable
          onClick={openChangeBackgroundModal}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Handle inviting members */}
        <InviteBoardUser boardId={board._id} />

        {/* Handle displaying board members */}
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>

      {/* Modal to change the background image */}
      <ChangeBackgroundModal
        isOpen={openChangeBackground}  // Use state for modal visibility
        handleCloseModal={closeChangeBackgroundModal}  // Modal close handler
        board={board}  // Board object
      />
    </Box>
  );
}

export default BoardBar;
