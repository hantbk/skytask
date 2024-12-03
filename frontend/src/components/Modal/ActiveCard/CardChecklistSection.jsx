import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Typography, IconButton, LinearProgress, Divider, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChecklistIcon from '@mui/icons-material/Checklist';
import {
    deleteChecklistAPI,
    addChecklistItemAPI,
    setChecklistItemCompletedAPI,
    setChecklistItemTextAPI,
    deleteChecklistItemAPI,
    updateChecklistAPI
} from '~/apis';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import EditableTitle from './EditableTitle';

const ChecklistItem = ({ item, handleUpdateText, handleUpdate, handleDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(item.text);

    // Handle the save action for updating the item text
    const handleSave = async () => {
        try {

            await handleUpdateText(newText); // Call the parent component function to update the text
            setIsEditing(false); // Exit edit mode
        } catch (error) {
            console.error('Failed to update text:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Checkbox checked={item.completed} onChange={handleUpdate} />
            <Typography
                variant="body2"
                sx={{
                    flex: 1,
                    textDecoration: item.completed ? 'line-through' : 'none',
                }}
            >
                {isEditing ? (
                    <TextField
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        size="small"
                        variant="outlined"
                        autoFocus
                        sx={{
                            '& label': { color: 'text.primary' },
                            '& input': {
                                color: (theme) => theme.palette.primary.main,
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'dark' ? '#333643' : 'white',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: (theme) => theme.palette.primary.main,
                                },
                            },
                        }}
                    />
                ) : (
                    item.text
                )}
            </Typography>
            {isEditing ? (
                <Button
                    size="small"
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                >
                    Save
                </Button>
            ) : (
                <IconButton onClick={() => setIsEditing(true)} size="small">
                    <Typography variant="body2" sx={{ color: 'primary.main' }}>
                        Edit
                    </Typography>
                </IconButton>
            )}
            <IconButton onClick={handleDelete} size="small">
                <DeleteIcon />
            </IconButton>
        </Box>
    );
};

// Calculate the completion percentage for each checklist
const getCompletionPercentage = (items) => {
    if (!items || items.length === 0) return 0;
    const completedItems = items.filter(item => item.completed !== undefined ? item.completed : false).length;
    return (completedItems / items.length) * 100;
};

const CardChecklistSection = ({ cardId, cardChecklistProp, handleUpdateCardChecklist }) => {

    const [loading, setLoading] = useState({}); // Track loading state for each checklist
    const [openChecklistForm, setOpenChecklistForm] = useState({});
    const [newItemText, setNewItemText] = useState({});

    // Update checklist item completion status
    const onSetChecklistItemCompleted = async (checklistId, itemId) => {
        try {
            // Toggle the completion status
            const updatedCompletionStatus = !cardChecklistProp
                .find(checklist => checklist._id === checklistId)
                .items.find(item => item._id === itemId).completed;

            // Call the API to update the completion status
            const response = await setChecklistItemCompletedAPI(cardId, checklistId, itemId, updatedCompletionStatus);

            // Call the handleUpdateCardChecklist to update the parent component with the new checklists
            handleUpdateCardChecklist(response);
            toast.success('Checklist item updated successfully');
        } catch (error) {
            toast.error('Failed to update checklist item');
        }
    };

    const onSetChecklistItemText = async (checklistId, itemId, newText) => {
        try {
            // Update the text of the checklist item
            const updatedText = newText;
            const response = await setChecklistItemTextAPI(cardId, checklistId, itemId, updatedText);
            // Call the handleUpdateCardChecklist to update the parent component with the new checklists
            handleUpdateCardChecklist(response);
            toast.success('Checklist item updated successfully');
        } catch (error) {
            toast.error('Failed to update checklist item');
        }
    }


    // Delete checklist
    const onDelete = async (checklistId) => {
        try {
            const response = await deleteChecklistAPI(cardId, checklistId);
            if (response) {
                const updatedChecklists = cardChecklistProp.filter((checklist) => checklist._id !== checklistId);
                handleUpdateCardChecklist(response);
                toast.success('Checklist deleted successfully');
            }
        } catch (error) {
            toast.error('Failed to delete checklist');
        }
    };

    // Delete checklist item
    const onDeleteChecklistItem = async (itemId, checklistId) => {
        try {
            // Call the API to delete the checklist item
            const response = await deleteChecklistItemAPI(cardId, checklistId, itemId);

            if (response._id) {
                // Update the checklist items by removing the deleted item
                const updatedChecklists = cardChecklistProp.map((checklist) =>
                    checklist._id === checklistId
                        ? {
                            ...checklist,
                            items: checklist.items.filter(item => item._id !== itemId)
                        }
                        : checklist
                );

                // console.log('updatedChecklists', updatedChecklists);

                handleUpdateCardChecklist(response);
                toast.success('Checklist item deleted successfully');
            }
        } catch (error) {
            toast.error('Failed to delete checklist item');
        }
    };


    // Add item to checklist
    const onAddItem = async (checklistId, text) => {
        if (text.trim() === '') {
            toast.error('Item title cannot be empty');
            return;
        }

        setLoading((prev) => ({ ...prev, [checklistId]: true }));

        try {
            const newChecklistItemData = { text: text };
            const response = await addChecklistItemAPI(cardId, checklistId, newChecklistItemData);

            if (response._id) {
                const updatedChecklists = cardChecklistProp.map((checklist) =>
                    checklist._id === checklistId
                        ? { ...checklist, items: [...checklist.items, response.data] }
                        : checklist
                );

                handleUpdateCardChecklist(response);
                toast.success('Item added successfully');

                // Close the form and reset the input field
                toggleOpenChecklistForm(checklistId);

                setNewItemText((prev) => ({ ...prev, [checklistId]: '' }));
            }
        } catch (error) {
            toast.error('Failed to add item');
        } finally {
            setLoading((prev) => ({ ...prev, [checklistId]: false }));
        }
    };

    const toggleOpenChecklistForm = (id) => setOpenChecklistForm((prev) => ({
        ...prev,
        [id]: !prev[id],
    }));

    // Hàm để cập nhật tiêu đề checklist
    const onUpdateChecklistTitle = async (checklistId, newTitle) => {
        try {
            const response = await updateChecklistAPI(cardId, checklistId, { title: newTitle });

            // Tìm và cập nhật checklist trong danh sách
            const updatedChecklists = cardChecklistProp.map((checklist) =>
                checklist._id === checklistId
                    ? { ...checklist, title: newTitle } // Cập nhật tiêu đề checklist
                    : checklist
            );

            // Cập nhật lại danh sách checklist trong component cha
            handleUpdateCardChecklist({ ...response, checklists: updatedChecklists });
            // Cập nhật danh sách checklist trong parent component
            // handleUpdateCardChecklist(response);
            toast.success('Checklist title updated successfully');
        } catch (error) {
            toast.error('Failed to update checklist title');
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            {cardChecklistProp?.map((checklist) => (
                <Box key={checklist._id} sx={{ mb: 3 }}>
                    {/* Display checklist title with ChecklistIcon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ChecklistIcon />
                        <EditableTitle
                            title={checklist.title}
                            onUpdateTitle={(newTitle) => onUpdateChecklistTitle(checklist._id, newTitle)}
                        />
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
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: '600', width: 'auto', flexShrink: 0 }}
                        >
                            {`${getCompletionPercentage(checklist.items).toFixed(0)}%`}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={getCompletionPercentage(checklist.items)}
                            sx={{
                                width: '100%',
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
                            item={item}
                            handleUpdateText={(text) => onSetChecklistItemText(checklist._id, item._id, text)}
                            handleUpdate={() => onSetChecklistItemCompleted(checklist._id, item._id)}
                            handleDelete={() => onDeleteChecklistItem(item._id, checklist._id)}
                        />
                    ))}

                    {/* Add Item Input Field */}
                    <Box sx={{ mt: 2 }}>
                        {!openChecklistForm[checklist._id] ? (
                            <Box
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={() => toggleOpenChecklistForm(checklist._id)}
                                >
                                    Add an item
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <TextField
                                    label="Add an item..."
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    autoFocus
                                    value={newItemText[checklist._id] || ''}
                                    onChange={(e) =>
                                        setNewItemText((prev) => ({
                                            ...prev,
                                            [checklist._id]: e.target.value,
                                        }))
                                    }
                                    sx={{
                                        '& label': { color: 'text.primary' },
                                        '& input': {
                                            color: (theme) => theme.palette.primary.main,
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark' ? '#333643' : 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: (theme) => theme.palette.primary.main,
                                            },
                                        },
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Button
                                        onClick={() => onAddItem(checklist._id, newItemText[checklist._id])}
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        disabled={loading[checklist._id]}
                                        sx={{
                                            boxShadow: 'none',
                                            border: '0.5px solid',
                                            borderColor: (theme) => theme.palette.success.main,
                                            '&:hover': {
                                                bgcolor: (theme) => theme.palette.success.main,
                                            },
                                        }}
                                    >
                                        {loading[checklist._id] ? 'Adding...' : 'Add'}
                                    </Button>
                                    <Button
                                        onClick={() => toggleOpenChecklistForm(checklist._id)}
                                        color="error"
                                        size="small"
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    <Divider sx={{ my: 2 }} />
                </Box>
            ))}
        </Box>
    );
};

export default CardChecklistSection;
