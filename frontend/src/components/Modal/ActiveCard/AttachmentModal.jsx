import React, { useState } from 'react';
import {
    Button,
    Modal,
    Box,
    TextField,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@mui/material';
import { createAttachmentAPI } from '~/apis';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

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

const AttachmentModal = ({ cardId, attachments, onAttachmentCreated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [link, setLink] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    // Mở Modal
    const handleOpen = () => setIsModalOpen(true);

    // Đóng Modal
    const handleClose = () => {
        setIsModalOpen(false);
        setLink('');
        setName('');
    };

    // Xử lý tạo tệp đính kèm
    const handleCreateAttachment = async () => {
        if (!link.trim()) {
            toast.error('Link is required!');
            return;
        }

        setLoading(true);

        try {
            const newAttachment = {
                link: link.trim(),
                name: name.trim() || link.trim().split('/').pop(),
            };

            const response = await createAttachmentAPI(cardId, newAttachment);

            onAttachmentCreated(response);
            toast.success('Attachment created successfully!');
            handleClose();
        } catch (error) {
            toast.error('Failed to create attachment!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SidebarItem onClick={handleOpen} className="active">
                <AttachFileOutlinedIcon fontSize="small" />
                Attachment
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
                    <Typography id="modal-title" variant="h6" component="h2" mb={2}>
                        Add Attachment
                    </Typography>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Search or paste a link"
                        variant="outlined"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        required
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Display text (optional)"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                            onClick={handleCreateAttachment}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create'}
                        </Button>
                    </Box>

                    <Typography variant="subtitle1" mt={3}>
                        Existing Attachments
                    </Typography>

                    <List
                        sx={{
                            maxHeight: 200, // Chiều cao tối đa của danh sách
                            overflowY: 'auto', // Bật thanh cuộn dọc
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mt: 2,
                            p: 1,
                            bgcolor: 'background.paper',
                        }}
                    >
                        {attachments.map((attachment) => (
                            <ListItem
                                key={attachment._id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={attachment.name}
                                    secondary={attachment.link}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Modal>
        </>
    );
};

export default AttachmentModal;
