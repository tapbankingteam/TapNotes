import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect
} from 'react';
import {
  Dialog,
  Slide,
  Grid,
  DialogContent,
  Typography,
  Card,
  CardContent,
  IconButton
} from '@material-ui/core';
import db from '../../firebaseConfig';
import { DialogNav } from '../Navigation/DialogNav';
import { Close } from '@material-ui/icons';

export const Transition = props => {
  return <Slide direction='up' {...props} />;
};

export const Notes = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(props.activeIndex);
  const [data, setData] = useState([]);
  const user = props.user;
  const [categoryList, setCategoryList] = useState(props.categoryList);
  const docRef = db.collection('users').doc(user.uid);

  useImperativeHandle(ref, () => ({
    activeNotes(index) {
      setActiveIndex(index);
      setOpen(true);
    }
  }));

  useEffect(() => {
    setData(props.data);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await props.handleDelete(props.index);
    await handleClose();
  };

  const handleRemoveNote = async index => {
    await categoryList.categories[activeIndex].Notes.splice(index, 1);
    await docRef.update({
      categories: categoryList.categories
    });
    await handleClose();
  };

  return (
    <Grid container justify='center'>
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <DialogNav
          title={props.data.title}
          notes={true}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
        <DialogContent>
          {props.data.Notes &&
            props.data.Notes.map((note, index) => (
              <Card style={{ marginTop: '10px' }} key={index}>
                <IconButton
                  onClick={() => handleRemoveNote(index)}
                  style={{ float: 'right' }}
                >
                  <Close />
                </IconButton>
                <CardContent>
                  <Typography>{note.title}</Typography>
                  <Typography variant='caption'>{note.description}</Typography>
                </CardContent>
              </Card>
            ))}
        </DialogContent>
      </Dialog>
    </Grid>
  );
});
