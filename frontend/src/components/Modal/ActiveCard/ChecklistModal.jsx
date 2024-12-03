import React, { useState } from 'react';
import {
    Button,
    Modal,
    Box,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';
import { createChecklistAPI } from '~/apis';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'


const SidebarItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
    backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
    padding: '10px',
    borderRadius: '4px',
    '&:hover': {
        backgroundColor:
            theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
        '&.active': {
            color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
            backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
        }
    }
}))

const ChecklistModal = ({ cardId, onChecklistCreated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const [checklists, setChecklists] = useState([]);

    // Hàm callback để cập nhật danh sách checklist
    const handleChecklistCreated = (newChecklist) => {
        setChecklists((prev) => [...prev, newChecklist]);
    };

    // Hàm mở modal
    const handleOpen = () => setIsModalOpen(true);

    // Hàm đóng modal
    const handleClose = () => {
        setIsModalOpen(false);
        setTitle('');
    };

    // Hàm xử lý khi nhấn nút Tạo Checklist
    const handleCreateChecklist = async () => {
        if (!title.trim()) {
            toast.error('Title is required!');
            return;
        }

        setLoading(true);

        try {
            const response = await createChecklistAPI(cardId, { title });

            onChecklistCreated(response);
            toast.success('Checklist created successfully!');
            handleClose();
        } catch (error) {
            toast.error('Failed to create checklist!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SidebarItem onClick={handleOpen} className="active">
                <TaskAltOutlinedIcon fontSize="small" />
                Checklist
            </SidebarItem>

            <Modal
                open={isModalOpen}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        Create Checklist
                    </Typography>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={!title.trim() && title !== ''} // Báo lỗi trực tiếp
                        helperText={!title.trim() && title !== '' ? 'Title không được để trống!' : ''}
                    />

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                    >
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateChecklist}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ChecklistModal;
