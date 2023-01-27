import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import { FormGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { useEffect } from 'react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {
  const [open, setOpen] = React.useState(false);
  const [newTaskName, setNewTaskName] = React.useState('');
  const [isNewTaskImportant, setIsNewTaskImportant] = React.useState(false);
  const [newTaskListId, setNewTaskListId] = React.useState(props.newTaskListId);

  useEffect(() => {
    if (props.setOpen === true) setOpen(true);
  }, [props.setOpen]);
  useEffect(() => {
    if(props.newTaskListid) setNewTaskListId(props.newTaskListId);
  }, [props.newTaskListId])
  const handleClose = () => {
    props.activePrompt('');
    props.newTaskName(newTaskName);
    props.isNewTaskImportant(isNewTaskImportant);
    props.taskListId(newTaskListId)
    props.taskAdding(true);
    setOpen(false);
  };

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle className="w-[600px]" id="customized-dialog-title" onClose={handleClose}>
          Add {props.listName} task
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '50ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField onChange={(e) => setNewTaskName(e.target.value)} className="" id="standard-multiline-flexible" label="Enter task name" multiline maxRows={6} variant="standard" />
            </div>
          </Box>
          <div>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    {...label}
                    onChange={(e) => {
                      e.target.checked ? setIsNewTaskImportant(true) : setIsNewTaskImportant(false);
                    }}
                    sx={{
                      color: '#DC2638',
                      '&.Mui-checked': {
                        color: '#DC2638',
                      },
                    }}
                  />
                }
                label="Important Task"
              />
            </FormGroup>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => {
            props.newTaskSubmitted(true);
            handleClose()}}>
            ADD
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
