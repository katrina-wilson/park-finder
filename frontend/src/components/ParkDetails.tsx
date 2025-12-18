import * as React from 'react'; 
import { Box, Chip, Tab, Tabs } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Park } from "../types";


interface ParkDetailsProps {
    selectedPark: Park;
    setSelectedPark: (park: Park | null) => void;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

function ParkDetails({ selectedPark }: ParkDetailsProps) {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className='tw:flex tw:flex-col tw:bg-white tw:h-full tw:w-full tw:shadow tw:p-4 tw:rounded-2xl tw:border tw:border-border'>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Park Details" {...a11yProps(0)} />
                    <Tab label="Reviews" {...a11yProps(1)} />
                </Tabs>
            </Box>

            <CustomTabPanel value={value} index={0}>
                <div className='tw:flex tw:flex-col tw:space-y-2 tw:h-fit'>

                    { selectedPark?.description && (
                        <div className='tw:text-gray-700 tw:whitespace-pre-wrap'>
                            { selectedPark?.description }
                        </div>
                    )}

                    { selectedPark?.type && (
                        <div>
                            <span className='tw:font-bold'>Type: </span>
                            <span className='tw-font-semibold tw-text-gray-700'>{ selectedPark?.type }</span>
                        </div>
                    )}
                    <div className='tw:flex'>
                        <span className='tw:font-bold'>Website: </span>
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
                        <span className='tw:font-bold'>Address:</span> { selectedPark?.address ? selectedPark?.address : 'Unknown' }
                    </div>

                    <div>
                        <span className='tw:font-bold'>Size:</span> { selectedPark?.sizeAcres ? selectedPark?.sizeAcres?.toFixed(1) + ' acres' : 'Unknown' }
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
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
                Reviews coming soon!
            </CustomTabPanel>
        </div>
    )
};

export default ParkDetails;