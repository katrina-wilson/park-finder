import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
  Typography,
  Box,
  Slide
} from '@mui/material';
import type { Park } from '../../types';
import { TransitionProps } from '@mui/material/transitions';

interface RatingModalProps {
    open: boolean;
    handleClose: () => void;
    park: Park | null;
    onSubmit?: (data: { rating?: number; review?: string; visitedDate?: string; }) => void;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function RatingModal({ open, park, handleClose, onSubmit }: RatingModalProps) {
    const [rating, setRating] = React.useState<number | null>(null);
    const [review, setReview] = React.useState('');
    const [visitedDate, setVisitedDate] = React.useState<string>('');

    const handleSubmit = () => {
        if (!rating) return;
        onSubmit?.({ 
            rating, 
            review: review?.trim() || undefined, 
            visitedDate: visitedDate || undefined,
        });
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 4,
                        border: "2px solid #000",
                        width: "100%",
                        padding: 2,
                        boxShadow: 8,
                    }
                }
            }}
            slots={{
                transition: Transition,
            }}
        >
            <DialogTitle className="tw:font-bold">
                Rate {park?.name}
            </DialogTitle>

            <DialogContent className="tw:flex tw:flex-col tw:gap-4">
                <Box>
                    <Typography component="legend" className="tw:font-medium">
                        Overall Rating
                    </Typography>
                    <Rating
                        value={rating}
                        onChange={(_, newValue) => setRating(newValue)}
                        sx={{
                            fontSize: '36px'
                        }}
                    />
                </Box>

                <Box>
                    <Typography component="legend" className="tw:font-medium">
                        Leave a Review to Help Others
                    </Typography>
                    <TextField
                        placeholder="What did you like? What should others know?"
                        multiline
                        minRows={3}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        inputProps={{ maxLength: 500 }}
                        helperText={`${review.length}/500`}
                        fullWidth
                    />
                </Box>

                <Box>
                    <Typography component="legend" className="tw:font-medium tw:pb-2">
                        Date Visited (Optional)
                    </Typography>
                    <TextField
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={visitedDate}
                        onChange={(e) => setVisitedDate(e.target.value)}
                        fullWidth
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!rating}
                >
                    Submit Review
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RatingModal;
