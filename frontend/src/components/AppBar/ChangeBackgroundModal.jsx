import React, { useState } from 'react';
import { Modal, Box, Typography, Button, IconButton, CircularProgress, Grid } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { updateBoardDetailsAPI, fetchBoardsAPI } from '~/apis'; // Ensure API is imported
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
};

const predefinedBackgrounds = [
    { id: 1, url: 'https://raw.githubusercontent.com/hantbk/taskflow/main/frontend/src/assets/background/demo1.jpg' },
    { id: 2, url: 'https://raw.githubusercontent.com/hantbk/taskflow/main/frontend/src/assets/background/demo2.jpg' },
    { id: 3, url: 'https://raw.githubusercontent.com/hantbk/taskflow/main/frontend/src/assets/background/demo3.jpg' },
    { id: 4, url: 'https://raw.githubusercontent.com/hantbk/taskflow/main/frontend/src/assets/background/demo4.jpg' },
];

function ChangeBackgroundModal({ isOpen, handleCloseModal, board }) {
    const [backgroundImageFile, setBackgroundImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setBackgroundImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePredefinedBackground = async (url) => {
        setLoading(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], `background_update_${Date.now()}.jpg`, { type: blob.type });
            setBackgroundImageFile(file);
            setImagePreview(url);
        } catch (error) {
            toast.error('Failed to load the selected background. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBackground = async () => {
        if (!backgroundImageFile) {
            toast.error('Please select a background to save.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('boardCover', backgroundImageFile);

        await updateBoardDetailsAPI(board._id, formData)
            .then((res) => {
                toast.success('Background updated successfully.');
                // window.location.reload();
                navigate(0);
            }).then(() => {
                handleCloseModal();
            })
            .catch((error) => {
                toast.error('Error occurred while updating the background.');
            });

        setLoading(false);

    };

    return (
        <Modal open={isOpen} onClose={handleCloseModal}>
            <Box
                sx={{
                    ...modalStyle,
                    width: 500,
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: 'background.paper',
                }}
            >
                {/* Modal Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        pb: 1,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Change Background
                    </Typography>
                    <IconButton onClick={handleCloseModal}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Predefined Backgrounds Section */}
                <Box>
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                        Choose a default background:
                    </Typography>
                    <Grid container spacing={2}>
                        {predefinedBackgrounds.map((background) => (
                            <Grid item xs={6} sm={6} key={background.id}>
                                <Box
                                    sx={{
                                        height: '100px',
                                        background: `url(${background.url}) center/cover`,
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        boxShadow: 2,
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': { transform: 'scale(1.05)' },
                                    }}
                                    onClick={() => handlePredefinedBackground(background.url)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>


                {/* File Upload Section */}
                <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                        Or, upload an image:
                    </Typography>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="background-image-upload"
                    />
                    <label htmlFor="background-image-upload">
                        <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            sx={{ textTransform: 'none', py: 1, px: 3 }}
                        >
                            Choose File
                        </Button>
                    </label>
                    {imagePreview && (
                        <Box
                            sx={{
                                mt: 2,
                                overflow: 'hidden',
                                borderRadius: 1,
                                boxShadow: 2,
                                maxHeight: 200,
                                width: '100%',
                            }}
                        >
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '8px',
                                    objectFit: 'contain',
                                }}
                            />
                        </Box>
                    )}

                </Box>

                {/* Modal Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button
                        onClick={handleCloseModal}
                        variant="outlined"
                        color="secondary"
                        sx={{
                            textTransform: 'none',
                            borderRadius: 1,
                            px: 3,
                            py: 1,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveBackground}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{
                            textTransform: 'none',
                            ml: 2,
                            borderRadius: 1,
                            px: 3,
                            py: 1,
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                    </Button>
                </Box>
            </Box>
        </Modal>

    );
}

export default ChangeBackgroundModal;
