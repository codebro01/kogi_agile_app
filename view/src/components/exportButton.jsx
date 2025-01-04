import React from 'react';
import { Button } from '@mui/material';
import ExportIcon from '@mui/icons-material/ImportExport'; // Export Icon

export const ExportSubmitButton = ({ label = "Export" }) => {
    return (
        <Button
            variant="contained"
            type='submit'
            sx={{
                backgroundColor: '#196b57', // Primary color
                color: '#ffffff', // Text color
                textTransform: 'none', // Prevent uppercase transformation
                fontWeight: 'bold',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 1, // Space between icon and label
                '&:hover': {
                    backgroundColor: '#145943', // Slightly darker green on hover
                },
                '& .MuiButton-startIcon': {
                    margin: 0, // Remove default margin
                },
            }}
            startIcon={<ExportIcon />}
        >
            {label}
        </Button>
    );
};
