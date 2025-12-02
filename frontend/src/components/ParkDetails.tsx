import { Chip, IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Park } from "../types";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ParkDetails from './ParkDetails';


interface ParkDetailsProps {
    selectedPark: Park;
    setSelectedPark: (park: Park | null) => void;
};

function ParkDetails({ selectedPark, setSelectedPark }: ParkDetailsProps) {

    return (
        <div className='tw:flex tw:flex-col tw:bg-white tw:h-full tw:shadow tw:p-4 tw:rounded-2xl tw:border tw:border-border'>
            <div className='tw:flex tw:items-center tw:border-b tw:border-border'>
                <div className='tw:pr-3'>
                    <Tooltip title="Back to all parks">
                        <IconButton
                            aria-label='Back to all parks'
                            onClick={() => setSelectedPark(null)}
                        >
                            <ChevronLeftIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
                <div className='tw:text-xl tw:font-bold'>
                    {selectedPark?.name}
                </div>
            </div>

            { selectedPark?.type && (
                <div className='tw:py-3 tw:w-full tw:justify-center tw:flex'>
                    <Chip label={selectedPark.type}/>
                </div>
            )}

            <div className='tw:flex'>
                Website: 
                <Tooltip title="Open in new tab" >
                    <a 
                        href={selectedPark.website}
                        target="_blank"
                        className='tw:pl-2 tw:underline tw:text-gray-600 tw:hover:text-primary'
                    >
                        { selectedPark?.website || 'Unknown' }
                    </a>
                </Tooltip>
            </div>

            <div>
                Address: { selectedPark?.address ? selectedPark?.address : 'Unknown' }
            </div>

            <div>
                Size: { selectedPark?.sizeAcres ? selectedPark?.sizeAcres?.toFixed(0) + ' acres' : 'Unknown' }
            </div>
            
        </div>
    )

};

export default ParkDetails;