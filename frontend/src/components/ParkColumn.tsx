import * as React from 'react'; 
import { IconButton, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Tooltip from '@mui/material/Tooltip';
import ParkCard from '../components/ParkCard';
import { Park } from "../types";
import ParkDetails from './ParkDetails';
import ParkFilterDropdown from './ParkFilterDropdown';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router';


interface ParkColumnProps {
    searchValue: string;
    setSearchValue: (searchValue: string) => void;
    searchFilterParks: Park[];
    setSelectedPark: (park: Park | null) => void;
};


function ParkColumn({ searchValue, setSearchValue, searchFilterParks, setSelectedPark }: ParkColumnProps) {

    const navigate = useNavigate();

    const [filterAnchorEl, setFilterAnchorEl] = React.useState(null);

    const handleCardClicked = (park: Park) => {
        setSelectedPark(park);
        navigate(`/home/parks/${park.id}`);
    };

    return (
        <div className='tw:flex tw:flex-col tw:h-full tw:items-center'>
            <div className='tw:flex tw:flex-col tw:w-full tw:items-end tw:pb-3'>
                <div className='tw:flex tw:w-full tw:space-x-4'>
                    <TextField 
                        variant='outlined' 
                        label="Search Parks"
                        className='tw:w-full tw:bg-white'
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    searchValue && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="Clear"
                                                edge="end"
                                                onClick={() => setSearchValue("")}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                )
                            },
                        }}  
                    />

                    <Tooltip title="Filter Parks">
                        <IconButton 
                            aria-label="Filter Parks"
                            className='tw:w-[56px]'
                            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                        >
                            <FilterAltIcon/>
                        </IconButton>
                    </Tooltip>

                    <ParkFilterDropdown
                        anchorEl={filterAnchorEl}
                        open={!!filterAnchorEl}
                        handleClose={() => setFilterAnchorEl(null)}
                    />
                </div>

                <span className='tw:text-sm tw:min-w-fit tw:text-gray-600 tw:pt-3 tw:italic'>
                    { searchFilterParks?.length } Results
                </span>
            </div>

            <div className='tw:space-y-3 tw:h-full tw:w-full tw:overflow-y-auto tw:pr-4'>
                {searchFilterParks.map((p) => (
                    <div key={p?.id}>
                        <ParkCard 
                            park={p} 
                            handleCardClick={(v) => handleCardClicked(v)}
                        />
                    </div>
                ))}
            </div>

            

        </div>
    )
};

export default ParkColumn;