import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchParkById } from "../stores/parksSlice";
import Map from "../components/Map";
import { Box, Button, Chip, CircularProgress, IconButton, Rating, Tooltip } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import ParkDetails from "../components/ParkDetails";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InfoIcon from '@mui/icons-material/Info';
import SlideGroup from "../components/SlideGroup";
import { fetchSimilarParksApi } from "../api/parksApi";
import { updateVisitedPark } from "../api/visitedParksApi";
import ParkCard from "../components/ParkCard";
import InfoModal from "../components/Modals/InfoModal";
import RatingModal from "../components/Modals/RatingModal";

const similarParksText = `These parks are picked because they share a lot in common with the one you’re checking out. Cosine similarity helps spot parks with similar types, amenities, locations, and ratings. \nClick any park card to dive into details, see photos, mark it as visited, and even leave a review!`;

function ParkDetailsView() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { parkId } = useParams();

    const { selectedPark, status, error } = useSelector((state) => state.parks);
    const { currentUser, currentUserStatus } = useSelector((state) => state.auth ?? { currentUser: null, currentUserStatus: "idle" });
    const token = useSelector((state) => state.auth.token);

    const [similarParks, setSimilarParks] = React.useState([]);
    const [infoOpen, setInfoOpen] = React.useState(false);
    const [ratingOpen, setRatingOpen] = React.useState(false);

    React.useEffect(() => {
        if (parkId) {
            dispatch(fetchParkById(parkId));
        }
    }, [dispatch, parkId]);


    React.useEffect(() => {
        
        const fetchSimilarParks = async () => {
            if (selectedPark) {
                try {
                    const r = await fetchSimilarParksApi(selectedPark.id, 5);
                    setSimilarParks(r);
                } catch (e) {
                    console.error(e, "Failed to fetch similar parks.");
                }
            }
        }

        fetchSimilarParks();

    }, [selectedPark]);

    const handleBackToParks = () => {
        navigate(`/home`);
    };

    const handleCardClick = (park) => {
        navigate(`/home/parks/${park.id}`);
    };

    const handleSubmitRating = async (data) => {
        if (!selectedPark) return;

        try {
            console.log("token in ParkDetailsView:", token);
            if (token) {
                await updateVisitedPark(selectedPark.id, data, token);
                dispatch(fetchParkById(selectedPark.id));
            }
        } catch (e) {
            console.error("Failed to submit review", e);
        }
    }

    if (status === "loading" || status === "idle") {
        return <CircularProgress />;
    }

    if (status === "failed") {
        return <p>Error: {error}</p>;
    }

    if (!selectedPark) {
        return <p>No park found.</p>;
    }

    return (
        <div className="tw:flex tw:flex-col tw:w-full tw:h-full tw:bg-background">

            <InfoModal 
                open={infoOpen} 
                handleClose={() => setInfoOpen(false)} 
                title="How Recommendations Work"
                text={similarParksText}
            />

            <RatingModal 
                open={ratingOpen} 
                park={selectedPark}
                handleClose={() => setRatingOpen(false)} 
                onSubmit={(data) => handleSubmitRating(data)}
            />
        
            <div className='tw:flex tw:items-center tw:p-4 tw:border-b tw:border-border'>
                <div className='tw:pr-2'>
                    <Tooltip title="Back to all parks">
                        <IconButton
                            aria-label='Back to all parks'
                            onClick={() => handleBackToParks()}
                        >
                            <ChevronLeftIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
                <div className='tw:text-2xl tw:font-bold tw:w-full'>
                    {selectedPark?.name}
                </div>
                {selectedPark?.visitedAt ? (
                    <Tooltip title="Personal Rating">
                        <Chip 
                            label={`Visited ${selectedPark?.rating ? (" | ★  ") + selectedPark?.rating : "–"}`}
                            color="success" 
                            size="small"
                            className="tw:min-w-fit tw:self-center tw:rounded tw:text-sm"
                        />
                    </Tooltip>
                ) : (
                    <div className='tw:min-w-fit'>
                        <Button
                            variant='contained'
                            disabled={currentUserStatus === "loading" || !currentUser}
                            onClick={() => setRatingOpen(true)}
                        >
                            {currentUser ? 'Mark as Visited' : 'Login to Mark as Visited'}
                        </Button>
                    </div>
                )}
            </div>


            <div className="tw:flex tw:flex-row tw:pt-3 tw:w-full tw:flex-1 tw:overflow-hidden tw:space-x-6 tw:p-4">
                <div className="tw:w-full tw:h-full">
                    <Map
                        allParks={[selectedPark]}
                        searchFilterParks={[selectedPark]}
                        selectedPark={selectedPark}
                        setSelectedPark={() => {}}
                    />
                </div>

                <div className="tw:flex tw:flex-col tw:min-w-[60%] tw:h-full">
                    <ParkDetails
                        selectedPark={selectedPark}
                        setSelectedPark={() => {}}
                    />
                </div>
            </div>

            <div className="tw:w-full tw:h-[300px] tw:shrink-0 tw:p-4 tw:border-t tw:border-border">
                <div className='tw:flex tw:items-center tw:text-lg tw:font-bold tw:pb-1'>
                    Parks you may also like:
                    
                    <div className='tw:w-fit tw:-mt-2.5'>
                        <Tooltip title="Click to learn more">
                            <IconButton size='small' onClick={() => setInfoOpen(true)}>
                                <InfoIcon fontSize='small'/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <SlideGroup
                    items={similarParks}
                    renderItem={(park) => (
                        <Box sx={{ width: '300px' }}>
                            <ParkCard
                                park={park}
                                handleCardClick={(p) => handleCardClick(p)}
                            />
                        </Box>
                    )}
                />
            </div>

        </div>
    );
}

export default ParkDetailsView;
