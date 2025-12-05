import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Welcome from './Welcome';
import FindParkStepper from './FindParkStepper';
import { Park } from "../../types";

interface WelcomeModalProps {
    allParks: Park[];
};

interface ComponentPropsMap {
    welcome: { handleButtonClick: (type: string) => void };
    findParkStepper: { allParks: Park[] };
};

type ActiveComponentType =
  | { component: "welcome"; props: { handleButtonClick: (type: string) => void } }
  | { component: "findParkStepper"; props: { allParks: Park[] } };

const componentMap = {
    "welcome": Welcome,
    "findParkStepper": FindParkStepper,
}

function WelcomeModal({ allParks }: WelcomeModalProps) {

    console.log("all parks", allParks)

    const [open, setOpen] = React.useState(true);
    const [activeComponent, setActiveComponent] = React.useState<'welcome' | 'findParkStepper'>("welcome");

    type ActiveComponentKey = keyof ComponentPropsMap;
    const DynamicComponent = componentMap[activeComponent];

    const handleClose = () => setOpen(false);

    function handleButtonClick(buttonType: string) {
        console.log("in fun", buttonType)
        switch (buttonType) {
            case 'close':
                handleClose();
                return;
            case 'findParkStepper': 
                console.log("step", allParks)
                setActiveComponent("findParkStepper");
                return;
            case 'searchPark':
                handleClose();
                return;
            default:
                handleClose();
                return;
        }
    }

    return (
        <Dialog
            fullScreen={activeComponent === 'findParkStepper'}
            open={open}
            onClose={(event, reason) => {
                if (reason === "backdropClick" || reason === "escapeKeyDown") {
                    return;
                }
                handleClose();
            }}
            slotProps={{
                paper: {
                    sx: {
                        ...(activeComponent === 'findParkStepper' ? {} : {
                            borderRadius: 4,
                            border: "2px solid #000",
                        }),
                        maxWidth: "none",
                        padding: 2,
                        boxShadow: 8,
                    }
                }
            }}
        >
            <div
                tabIndex={-1}
                style={{ outline: 'none' }}
            >
                <DynamicComponent
                    {...(activeComponent === "welcome" ? { handleButtonClick } : { allParks })}
                />
            </div>
        </Dialog>
    )
};

export default WelcomeModal;