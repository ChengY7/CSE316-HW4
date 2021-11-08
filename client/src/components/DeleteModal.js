import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { GlobalStoreContext } from '../store'
import { useContext } from 'react'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function DeleteModal() {
  const { store } = useContext(GlobalStoreContext);
  const [open, setOpen] = React.useState(false);
  //const handleOpen = () => setOpen(true);
  const handleClose = () => {
      store.unmarkListForDeletion();
  }
  const handleDelete = () => {
      store.deleteList(store.listMarkedForDeletion);
      store.unmarkListForDeletion();
  }
  let name = ""
  let open2 = false;
  if (store.listMarkedForDeletion !== null) {
    open2=true
    name=store.listMarkedForDeletion.name;
  }
  

  return (
    <div>
      <Modal
        open={open2}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Alert severity="info" style={style}>
            <AlertTitle>Info</AlertTitle>
            <strong style={{paddingRight: 100}}>Delete the { name } Top 5 List?</strong>
            <Button variant="text" onClick={handleDelete}>DELETE</Button>
            <Button variant="text" onClick={handleClose}>CANCEL</Button>
        </Alert>
      </Modal>
    </div>
  );
}