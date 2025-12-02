import { Chip, IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Park } from "../types";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ParkDetails from './ParkDetails';
import InfoIcon from '@mui/icons-material/Info';


interface ParkDetailsProps {
    selectedPark: Park;
    setSelectedPark: (park: Park | null) => void;
};

function ParkDetails({ selectedPark, setSelectedPark }: ParkDetailsProps) {


    return (
        <div className='tw:flex tw:flex-col tw:bg-white tw:h-full tw:w-full tw:shadow tw:p-4 tw:rounded-2xl tw:border tw:border-border'>
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

            <div className='tw:flex tw:flex-col tw:space-y-2 tw:h-fit tw:border-b tw:border-border tw:py-4'>
                { selectedPark?.type && (
                    <div className='tw:py-3 tw:w-full tw:flex'>
                        <Chip label={selectedPark.type}/>
                    </div>
                )}

                <div className='tw:flex'>
                    Website: 
                    <Tooltip title="Open in new tab" >
                        <a 
                            href={selectedPark.website}
                            target="_blank"
                            className='tw:pl-2 tw:underline tw:text-gray-600 tw:hover:text-primary tw:break-all'
                        >
                            { selectedPark?.website || 'Unknown' }
                        </a>
                    </Tooltip>
                </div>

                <div>
                    Address: { selectedPark?.address ? selectedPark?.address : 'Unknown' }
                </div>

                <div>
                    Size: { selectedPark?.sizeAcres ? selectedPark?.sizeAcres?.toFixed(1) + ' acres' : 'Unknown' }
                </div>

                { !!selectedPark?.amenities?.length && (
                    <div className='tw:flex tw:flex-wrap tw:space-x-2 tw:space-y-2'>
                        { selectedPark.amenities.map((a: string) => (
                            <div className='tw:w-fit'>
                                <Chip label={a}/>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className='tw:flex tw:flex-col tw:py-4'>
                <div className='tw:flex tw:items-center tw:text-lg tw:font-bold'>
                    Parks you may also like:
                    
                    <div className='tw:w-fit tw:-mt-2.5'>
                        <Tooltip title="Click to learn more">
                            <IconButton size='small'>
                                <InfoIcon fontSize='small'/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    
                </div>


            </div>
        </div>
    )

};

export default ParkDetails;