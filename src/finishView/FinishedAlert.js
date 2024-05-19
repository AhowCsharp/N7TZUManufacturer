import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function FinishedAlert({okOpen, handleOkClose,title,message}) {
  return (
    <div>
      <Dialog
        open={okOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleOkClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{ 
          zIndex: (theme) => theme.zIndex.modal + 1, // 设置更高的z-index
          '& .MuiDialog-paper': { minWidth: '200px' } // 设置对话框的最小宽度
        }} // 设置更高的z-index
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOkClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
