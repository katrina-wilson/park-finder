import { CardActionArea, CardActions, CardContent, Rating } from "@mui/material";
import Card from "@mui/material/Card";
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Tooltip from '@mui/material/Tooltip';
import { Park } from '../types';
import { useSelector } from "react-redux";


interface ParkCardProps {
  park: Park;
  isSelected: boolean;
  handleCardClick?: (park: Park) => void;
};


function ParkCard({ park, handleCardClick }: ParkCardProps) {

    const currentUser = useSelector((state) => state.auth.currentUser);

    return (
        <>
            <Card 
                variant="outlined" 
                  className='tw:rounded-2xl tw:shadow'
            >
                <CardActionArea
                    onClick={() => handleCardClick?.(park)}
                >
                    <CardContent>
                        <div className="tw:flex tw:w-full tw:items-center">
                            <div className="tw:text-xl tw:w-full tw:font-bold">
                                {park?.name}
                            </div>
                            <Rating
                                name="simple-uncontrolled"
                                onChange={(event, newValue) => {
                                    console.log(newValue);
                                }}
                                defaultValue={0}
                                disabled={!currentUser}
                            />
                        </div>

                        <div className="tw:italic tw:text-gray-600 tw:pt-1">
                            {park.address}
                        </div>
                    </CardContent>

                    <CardActions>
                        { park?.type && <Chip label={park.type}/> }
                        <div className="tw:flex tw:w-full tw:justify-end">
                            <Tooltip title="Open website in new tab">
                                <IconButton 
                                    aria-label="Open website in new tab"
                                    onClick={() => window.open(park.website, '_blank')}
                                >
                                    <OpenInNewIcon />
                                </IconButton>
                            </Tooltip>
                        </div>

                    </CardActions>
                </CardActionArea>
            </Card>
        </>
    )
};

export default ParkCard;