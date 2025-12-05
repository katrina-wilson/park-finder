import * as React from 'react';
import Button from '@mui/material/Button';

interface WelcomeProps {
    handleButtonClick: (type: string) => void
};


function Welcome({ handleButtonClick }: WelcomeProps) {


    return (
        <div className='tw:flex tw:flex-col tw:items-center tw:p-4'>
            <div className='tw:text-3xl tw:font-bold tw:pb-3'>
                Welcome to Park Finder!
            </div>
            <div className='tw:text-lg tw:text-center'>
                Discover parks in the triangle area and find the perfect spot for your next adventure!
            </div>

            <div className='tw:flex tw:pt-10 tw:space-x-3 tw:items-center tw:justify-center tw:w-full'>
                <Button
                    variant='contained'
                    size='large'
                    className='tw:h-18'
                    onClick={() => handleButtonClick('searchPark')}
                >
                    I have a park in mind
                </Button>
                <Button
                    variant='contained'
                    size='large'
                    className='tw:h-18'
                    onClick={() => handleButtonClick('findParkStepper')}
                >
                    Help me find a park
                </Button>
                <Button
                    variant='contained'
                    size='large'
                    className='tw:h-18'
                    onClick={() => handleButtonClick('all')}
                >
                    Explore all parks
                </Button>
            </div>

        </div>
    )
}

export default Welcome;