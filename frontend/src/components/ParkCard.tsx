import { CardContent } from "@mui/material";
import Card from "@mui/material/Card";


function ParkCard({ park }) {

    return (
        <>
            <Card variant="outlined" className="tw:w-80">
                <CardContent>
                    {park?.name}
                </CardContent>

            </Card>
        </>
    )
};

export default ParkCard;