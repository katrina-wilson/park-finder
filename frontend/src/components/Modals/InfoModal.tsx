import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface InfoModalProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    text: string;   
};

function InfoModal({ open, handleClose, title, text }: InfoModalProps) {


  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                    {line}
                    <br />
                    <br />
                    </React.Fragment>
                ))}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} autoFocus>Close</Button>
        </DialogActions>
    </Dialog>
  );
};

export default InfoModal;