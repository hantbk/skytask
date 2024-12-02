import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Typography, IconButton, LinearProgress, Divider, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { deleteChecklistAPI, addChecklistItemAPI } from '~/apis'; // Make sure the path to API is correct
import { toast } from 'react-toastify';

// Component to render each checklist item
const ChecklistItem = ({ checklist, handleUpdate, handleDelete }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Checkbox
                checked={checklist.completed}
                onChange={() => handleUpdate(checklist._id)}
            />
            <Typography variant="body2" sx={{ flex: 1 }}>
                {checklist.title}
            </Typography>
            <IconButton onClick={() => handleDelete(checklist._id)} size="small">
                <DeleteIcon />
            </IconButton>
        </Box>
    );
};

// Calculate the completion percentage for each checklist
const getCompletionPercentage = (items) => {
    if (!items || items.length === 0) return 0;
    const completedItems = items.filter(item => item.completed).length;
    return (completedItems / items.length) * 100;
};

// Main component for displaying the checklist section
const CardChecklistSection = ({ cardId, cardChecklistProp, handleUpdateCardChecklist }) => {

    // State to store the new item title
    const [newItemText, setNewItemText] = useState('');

    // Update checklist item completion status
    const onUpdate = (checklistId, itemId) => {
        const updatedChecklists = cardChecklistProp.map((checklist) =>
            checklist._id === checklistId
                ? {
                    ...checklist,
                    items: checklist.items.map((item) =>
                        item._id === itemId ? { ...item, completed: !item.completed } : item
                    ),
                }
                : checklist
        );
        handleUpdateCardChecklist(updatedChecklists);
    };

    // Delete checklist
    const onDelete = async (checklistId) => {
        try {
            // Call API to delete the checklist
            const response = await deleteChecklistAPI(cardId, checklistId);

            console.log(response);

            if (response) {
                // Remove the checklist from the UI after successful deletion
                const updatedChecklists = cardChecklistProp.filter(
                    (checklist) => checklist._id !== checklistId
                );
                handleUpdateCardChecklist(updatedChecklists);
                // Optionally show a success message
                toast.success('Checklist deleted successfully');
            }
        } catch (error) {
            toast.error('Failed to delete checklist');
        }
    };

    const onAddItem = async (checklistId) => {

        console.log('Adding item:', newItemText);
        console.log('Checklist ID:', checklistId);
        console.log('Card ID:', cardId);

        if (newItemText.trim() === '') {
            toast.error('Item title cannot be empty');
            return;
        }

        try {
            // Prepare the data to be sent to the API
            const newChecklistItemData = { text: newItemText };

            // Call the API to add the new checklist item
            const response = await addChecklistItemAPI(cardId, checklistId, newChecklistItemData);

            console.log('Response:', response);

            if (response) {
                // Add the new item to the respective checklist in the UI
                const updatedChecklists = cardChecklistProp.map((checklist) =>
                    checklist._id === checklistId
                        ? { ...checklist, items: [...checklist.items, response] }
                        : checklist
                );
                handleUpdateCardChecklist(updatedChecklists);

                // Clear the input field and show a success message
                setNewItemTitle('');
                toast.success('Item added successfully');
            }
        } catch (error) {
            toast.error('Failed to add item');
        }
    };


    return (
        <Box sx={{ mt: 2 }}>
            {cardChecklistProp?.map((checklist) => (
                <Box key={checklist._id} sx={{ mb: 3 }}>
                    {/* Display checklist title with ChecklistIcon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ChecklistIcon />
                        <Typography variant="h6" sx={{ flex: 1, fontWeight: 'bold' }}>
                            {checklist.title}
                        </Typography>
                        {/* Delete button for the checklist */}
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => onDelete(checklist._id)}
                            sx={{ ml: 'auto' }}
                        >
                            Delete
                        </Button>
                    </Box>

                    {/* Progress bar with completion percentage */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Percentage Text */}
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: '600', width: 'auto', flexShrink: 0 }} // Make sure the percentage text doesn't shrink
                        >
                            {`${getCompletionPercentage(checklist.items).toFixed(0)}%`}
                        </Typography>

                        {/* Progress Bar */}
                        <LinearProgress
                            variant="determinate"
                            value={getCompletionPercentage(checklist.items)}
                            sx={{
                                width: '100%',  // Reduced width to give more space to percentage
                                height: 6,
                                borderRadius: 5,
                                marginBottom: 1,
                            }}
                        />
                    </Box>

                    {/* Render checklist items */}
                    {checklist.items?.map((item) => (
                        <ChecklistItem
                            key={item._id}
                            checklist={item}
                            handleUpdate={() => onUpdate(checklist._id, item._id)}
                            handleDelete={() => onDelete(item._id)}
                        />
                    ))}

                    {/* Add Item Input Field */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            placeholder="Add new item"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onAddItem(checklist._id)}
                        >
                            Add
                        </Button>
                    </Box>

                    {/* Divider between checklists */}
                    <Divider sx={{ my: 2 }} />
                </Box>
            ))}
        </Box>
    );
};

export default CardChecklistSection;
