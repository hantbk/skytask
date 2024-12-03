import React, { useState } from 'react';
import { Box, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { useTheme } from '@mui/material/styles';
import { deleteAttachmentAPI, updateAttachmentNameAPI, updateAttachmentLinkAPI } from '~/apis'; // Import the delete function
import AddAttachmentModal from './AddAttachmentModal';
import TextField from '@mui/material/TextField';

const CardAttachmentSection = ({ cardId, cardAttachmentProp, handleUpdateCardAttachments }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const theme = useTheme(); // Get access to the theme
    const [newName, setNewName] = useState('');
    const [newLink, setNewLink] = useState('');
    const [attachments, setAttachments] = useState(cardAttachmentProp || []); // Store attachments in state
    const [currentAttachment, setCurrentAttachment] = useState(null);

    // Open modal when hovering over the link
    const openModal = (link) => {
        setModalContent(link);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    // Handle the edit action - Open Modal with current attachment details
    const onEdit = (attachment) => {
        setCurrentAttachment(attachment);
        setNewName(attachment.name);
        setNewLink(attachment.link);
        setIsEditModalOpen(true);
    };

    // Handle attachment update (Name and Link)
    const onUpdateAttachment = async () => {
        try {
            let response
            if (newName !== currentAttachment.name) {
                const res = await updateAttachmentNameAPI(cardId, currentAttachment._id, newName);

                // console.log('res debug ---->', res)
                response = res
            }
            if (newLink !== currentAttachment.link) {
                const res = await updateAttachmentLinkAPI(cardId, currentAttachment._id, newLink);

                response = res
            }

            // Update the state with the new values
            setAttachments((prev) =>
                prev.map((attachment) =>
                    attachment._id === currentAttachment._id
                        ? { ...attachment, name: newName, link: newLink }
                        : attachment
                )
            );

            // console.log('response debug', response)

            handleUpdateCardAttachments(response);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update attachment:', error);
        }
    };


    // Handle the delete action
    const onDelete = async (attachmentId) => {
        try {
            // Call the delete API
            const res = await deleteAttachmentAPI(cardId, attachmentId);

            // Update the state by removing the deleted attachment
            const updatedAttachments = attachments.filter((attachment) => attachment._id !== attachmentId);

            setAttachments(updatedAttachments);

            // Optionally call handleUpdateCardAttachments
            handleUpdateCardAttachments(res);
        } catch (error) {
            console.error('Failed to delete attachment:', error);
        }
    };

    // Handle attachment creation callback from modal
    const onAddAttachmentCreated = (newAttachment) => {

        setAttachments(newAttachment.attachments);
        handleUpdateCardAttachments(newAttachment);
        closeModal();
    };

    return (
        <Box sx={{ mt: 2 }}>
            {/* Title and Add Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AttachmentIcon />
                <Typography
                    variant="span"
                    sx={{ fontWeight: '600', fontSize: '20px' }}
                >
                    Attachments
                </Typography>

                {/* Flex container to align the modal trigger button on the right */}
                <Box sx={{ ml: 'auto' }}>
                    <AddAttachmentModal
                        cardId={cardId}
                        attachments={cardId?.attachments || []}
                        onAddAttachmentCreated={onAddAttachmentCreated}
                    />
                </Box>
            </Box>

            {/* Display Links if attachments exist */}
            {attachments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Links</Typography>
                    <List>
                        {attachments.map((attachment) => (
                            <Box key={attachment._id} sx={{ mb: 2 }}>
                                {/* Attachment Name with Border */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {/* Attachment Name with Theme-based Styling */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            backgroundColor: theme.palette.background.paper, // Dynamically change background color based on theme
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            border: `1px solid ${theme.palette.divider}`, // Use theme's divider color for border
                                            width: '100%',
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        {/* Favicon from the attachment link */}
                                        <img
                                            src={`https://www.google.com/s2/favicons?sz=64&domain_url=${attachment.link}`}  // Get the favicon from the link
                                            alt="Attachment Logo"
                                            style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                        />
                                        {/* Attachment Name */}
                                        <a
                                            href={attachment.link}
                                            target="_blank"
                                            rel="noopener noreferrer" // Prevent opening the link with security risks
                                            style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        sx={{
                                                            color: theme.palette.primary.main, // Dynamically change the text color based on the theme
                                                            '&:hover': {
                                                                textDecoration: 'underline', // Underline on hover
                                                            },
                                                        }}
                                                    >
                                                        {attachment.name}
                                                    </Typography>
                                                }
                                            />
                                        </a>
                                        {/* Edit Button */}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => onEdit(attachment)}
                                            sx={{
                                                marginLeft: 'auto', // Push the button to the right
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </Box>

                                    <Box sx={{ ml: 'auto' }}>
                                        {/* Delete Button */}
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => onDelete(attachment._id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </List>
                </Box>
            )}



            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <DialogTitle>Edit Attachment</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Attachment Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        fullWidth
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        label="Attachment Link"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditModalOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={onUpdateAttachment} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CardAttachmentSection;
