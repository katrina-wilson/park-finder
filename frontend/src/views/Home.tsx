import * as React from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllParks } from "../stores/parksSlice";
import Map from '../components/Map';
import { CircularProgress } from '@mui/material';
import ParkColumn from "../components/ParkColumn";

function Home() {

    const dispatch = useDispatch();
    const { parks, status, error } = useSelector((state) => state.parks);

    const [searchValue, setSearchValue] = React.useState('');
    const [searchFilterParks, setSearchFilterParks] = React.useState(parks);
    const [selectedPark, setSelectedPark] = React.useState(null);

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllParks());
        }
    }, [status, dispatch]);

    React.useEffect(() => {
        setSearchFilterParks(parks);
    }, [parks]);

    React.useEffect(() => {
        const filtered = parks.filter((p) =>
            p.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setSearchFilterParks(filtered);
    }, [searchValue, parks]);


    return (
        <div className='tw:flex tw:md:flex-row tw:flex-col tw:p-6 tw:w-full tw:h-full tw:bg-background tw:space-x-6'>

            <div className='tw:w-fit tw:min-w-[65%] tw:h-full'>
                <Map
                    allParks={parks}
                    searchFilterParks={searchFilterParks}
                    selectedPark={selectedPark}
                    setSelectedPark={setSelectedPark}
                />
            </div>

            <div className="tw:flex tw:flex-col tw:w-full tw:h-full">
                {status === 'loading' && (
                    <CircularProgress/>
                )}
                {status === 'failed' && (
                    <p>Error: {error}</p>
                )}
                {status === 'succeeded' && (
                    <ParkColumn
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        searchFilterParks={searchFilterParks}
                        selectedPark={selectedPark}
                        setSelectedPark={setSelectedPark}
                    />
                )}
            </div>

        </div>
        
    )
};

export default Home;