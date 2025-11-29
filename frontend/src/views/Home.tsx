import * as React from 'react'; 
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllParks } from "../stores/parksSlice";
import ParkCard from '../components/ParkCard';
import Map from '../components/Map';
import { CircularProgress, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';


function Home() {

    const dispatch = useDispatch();
    const { parks, status, error } = useSelector((state) => state.parks);

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllParks());
        }
    }, [status, dispatch]);

    return (
        <div className='tw:flex tw:p-6 tw:w-full tw:h-full'>

            <div className="tw:flex tw:flex-col tw:p-6 tw:w-full tw:h-full">
                {status === 'loading' && (
                    <CircularProgress/>
                )}
                {status === 'failed' && (
                    <p>Error: {error}</p>
                )}
                {status === 'succeeded' && (
                    <div className='tw:flex tw:flex-col tw:items-center tw:px-4'>
                        
                        <TextField 
                            variant='outlined' 
                            label="Search Parks"
                            className='tw:w-full tw:pb-6'
                            slotProps={{
                                input: {
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                    ),
                                },
                            }}  
                        />

                        <div className='tw:space-y-3 tw:h-full tw:overflow-y-auto'>
                            {parks.map((p) => (
                                <>
                                    <ParkCard park={p} />
                                </>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Map/>

        </div>
        
    )
};

export default Home;