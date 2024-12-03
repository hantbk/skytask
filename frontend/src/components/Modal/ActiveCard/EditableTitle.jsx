import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';

const EditableTitle = ({ title, onUpdateTitle }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && newTitle.trim() !== '') {
            try {
                await onUpdateTitle(newTitle);
                setIsEditing(false);
            } catch (error) {
                console.error('Failed to update title:', error);
            }
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    return (
        <Box>
            {isEditing ? (
                <TextField
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onBlur={handleBlur}
                    autoFocus
                    size="small"
                    variant="outlined"
                    sx={{
                        '& input': {
                            color: (theme) => theme.palette.primary.main,
                        },
                    }}
                />
            ) : (
                <Typography
                    variant="h6"
                    sx={{ flex: 1, fontWeight: 'bold', marginLeft: 1, cursor: 'pointer' }}
                    onClick={() => setIsEditing(true)}
                >
                    {title}
                </Typography>
            )}
        </Box>
    );
};

export default EditableTitle;
