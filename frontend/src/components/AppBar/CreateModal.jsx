import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AbcIcon from '@mui/icons-material/Abc';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Controller } from 'react-hook-form';
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import { toast } from 'react-toastify';
import { singleFileValidator } from '~/utils/validators';  // Assuming this function exists for file validation

// Define BOARD_TYPES constant
const BOARD_TYPES = {
    PUBLIC: 'public',
    PRIVATE: 'private'
};

const CreateModal = ({
    isOpen,
    handleCloseModal,
    control,
    register,
    handleSubmit,
    reset,
    errors,
    submitCreateNewBoard,
    setBackgroundImageFile
}) => {
    const [backgroundPreview, setBackgroundPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target?.files[0];

        // Validate file
        const error = singleFileValidator(file);
        if (error) {
            toast.error(error);
            return;
        }

        // Set the image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setBackgroundPreview(reader.result); // Set the file as preview
        };
        if (file) {
            reader.readAsDataURL(file);
            // Pass the file back to the parent component
            setBackgroundImageFile(file);
        }
    };

    const handleCloseModalInternal = () => {
        // Reset the background preview and file when modal is closed
        setBackgroundPreview(null);
        setBackgroundImageFile(null);

        // Close the modal
        handleCloseModal();
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleCloseModalInternal}  // Reset the states here
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'white',
                boxShadow: 24,
                borderRadius: '8px',
                padding: '20px 30px',
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white'
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    cursor: 'pointer'
                }}>
                    <CancelIcon
                        color="error"
                        sx={{ '&:hover': { color: 'error.light' } }}
                        onClick={handleCloseModalInternal}  // Call the internal close handler
                    />
                </Box>
                <Box id="modal-modal-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LibraryAddIcon />
                    <Typography variant="h6" component="h2"> Create a new board</Typography>
                </Box>
                <Box id="modal-modal-description" sx={{ my: 2 }}>
                    <form onSubmit={handleSubmit(submitCreateNewBoard)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Title Input */}
                            <Box>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    type="text"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AbcIcon fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                    {...register('title', {
                                        required: FIELD_REQUIRED_MESSAGE,
                                        minLength: { value: 3, message: 'Min Length is 3 characters' },
                                        maxLength: { value: 50, message: 'Max Length is 50 characters' }
                                    })}
                                    error={!!errors['title']}
                                />
                                <FieldErrorAlert errors={errors} fieldName={'title'} />
                            </Box>

                            {/* Description Input */}
                            <Box>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    type="text"
                                    variant="outlined"
                                    multiline
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DescriptionOutlinedIcon fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                    {...register('description', {
                                        required: FIELD_REQUIRED_MESSAGE,
                                        minLength: { value: 3, message: 'Min Length is 3 characters' },
                                        maxLength: { value: 255, message: 'Max Length is 255 characters' }
                                    })}
                                    error={!!errors['description']}
                                />
                                <FieldErrorAlert errors={errors} fieldName={'description'} />
                            </Box>

                            {/* Background Image Upload */}
                            <Box>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<LibraryAddIcon />}
                                >
                                    Choose Background
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {backgroundPreview && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            height: '300px',
                                            backgroundImage: `url(${backgroundPreview})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderRadius: '8px',
                                            boxShadow: 2
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Type Selection */}
                            <Controller
                                name="type"
                                defaultValue={BOARD_TYPES.PUBLIC}
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        {...field}
                                        row
                                        onChange={(event, value) => field.onChange(value)}
                                        value={field.value}
                                    >
                                        <FormControlLabel
                                            value={BOARD_TYPES.PUBLIC}
                                            control={<Radio size="small" />}
                                            label="Public"
                                            labelPlacement="start"
                                        />
                                        <FormControlLabel
                                            value={BOARD_TYPES.PRIVATE}
                                            control={<Radio size="small" />}
                                            label="Private"
                                            labelPlacement="start"
                                        />
                                    </RadioGroup>
                                )}
                            />

                            <Box sx={{ alignSelf: 'flex-end' }}>
                                <Button
                                    className="interceptor-loading"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Create
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateModal;
