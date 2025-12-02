import { Chip, CircularProgress, IconButton, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Tooltip from '@mui/material/Tooltip';
import ParkCard from '../components/ParkCard';
import { Park } from "../types";
import ParkDetails from './ParkDetails';

interface ParkColumnProps {
    searchValue: string;
    setSearchValue: (searchValue: string) => void;
    searchFilterParks: Park[];
    selectedPark: Park | null;
    setSelectedPark: (park: Park | null) => void;
};


function ParkColumn({ searchValue, setSearchValue, searchFilterParks, selectedPark, setSelectedPark }: ParkColumnProps) {


    return (
        <div className='tw:flex tw:flex-col tw:h-full tw:items-center'>
            { !selectedPark ? (
                <>
                    <div className='tw:flex tw:flex-col tw:w-full tw:items-end tw:pb-3'>
                        <div className='tw:flex tw:w-full tw:space-x-2'>
                            <TextField 
                                variant='outlined' 
                                label="Search Parks"
                                className='tw:w-full'
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
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

                            <Tooltip title="Filter Parks">
                                <IconButton 
                                    aria-label="Filter Parks"
                                    onClick={() => {}}
                                >
                                    <FilterAltIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>

                        <span className='tw:text-sm tw:min-w-fit tw:text-gray-600 tw:pt-3 tw:italic'>
                            { searchFilterParks?.length } Results
                        </span>
                    </div>

                    <div className='tw:space-y-3 tw:h-full tw:w-full tw:overflow-y-auto'>
                        {searchFilterParks.map((p) => (
                            <div key={p?.id}>
                                <ParkCard 
                                    park={p} 
                                    isSelected={selectedPark?.id === p?.id}
                                    handleCardClick={(v) => setSelectedPark(v)}
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <ParkDetails
                    selectedPark={selectedPark}
                    setSelectedPark={setSelectedPark}
                />
            )}

        </div>
    )
};

export default ParkColumn;