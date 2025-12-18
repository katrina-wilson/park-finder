import { Box, CardActionArea, CardActions, CardContent, CardMedia, Divider, Rating, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import Chip from '@mui/material/Chip';
import { Park } from '../types';
import StarIcon from '@mui/icons-material/Star';


interface ParkCardProps {
  park: Park;
  handleCardClick?: (park: Park) => void;
};


function ParkCard({ park, handleCardClick }: ParkCardProps) {

    return (
        <>
            <Card 
                variant="outlined" 
                  className='tw:rounded-2xl tw:shadow'
            >
                <CardActionArea
                    onClick={() => handleCardClick?.(park)}
                >
                    <Box sx={{ position: "relative" }}>
                        <Box sx={{ position: "relative" }}>
                            <CardMedia
                                sx={{ height: 140 }}
                                image={park.coverImage ? `data:image/jpeg;base64,${park.coverImage}` : "/static/images/cards/contemplative-reptile.jpg"}
                                title={park?.name}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
                                    borderRadius: "inherit",
                                }}
                            />
                        </Box>

                        {park?.visitedAt && (
                            <Tooltip title="Personal Rating">
                                <Chip 
                                    label={`Visited ${park?.rating ? (" | ★  ") + park?.rating : "–"}`}
                                    color="success" 
                                    size="small"
                                    className="tw:ml-auto tw:self-center tw:rounded tw:text-xs tw:absolute tw:top-3 tw:right-3"
                                />
                            </Tooltip>
                        )}
                    </Box>

                    <Divider/>
                    
                    <CardContent className="tw:p-2">
                        <div className="tw:flex tw:w-full tw:items-center">
                            <div className="tw:text-xl tw:font-bold tw:w-full tw:truncate tw:pr-2">
                                {park?.name}
                            </div>  
                            <div className="tw:text-sm tw:flex tw:items-center">
                                <StarIcon fontSize="small" color="secondary"/>
                                4.5
                            </div>
                        </div>
                        <div className="tw:flex tw:w-full tw:text-xs tw:pb-3">
                            {park?.type}
                        </div>

                        {park?.amenities && park.amenities.length > 0 && (
                            <div className="tw:flex tw:flex-wrap tw:gap-1 tw:mb-2 tw:w-full">
                                {park.amenities.slice(0, 2).map((amenity) => (
                                    <Chip 
                                        key={amenity}
                                        label={amenity.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                                        size="small"
                                        className="tw-rounded tw-text-xs"
                                    />
                                ))}
                                {park.amenities.length > 2 && (
                                    <div className="tw:text-xs">
                                        +{park.amenities.length - 2}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
};

export default ParkCard;