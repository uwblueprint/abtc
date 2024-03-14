import React, {useState, useEffect} from "react";
import ShiftCard from "../common/ShiftCard";
import baseAPIClient from "../../APIClients/BaseAPIClient";

const Shifts = (): React.ReactElement => {
    const [shifts, setShifts] = useState<any>([]);

    useEffect(() => {
        const fetchShifts = async () => {
            // const data = await baseAPIClient.get(
            //     "/serviceRequests");
            // setShifts(data);
        }
        fetchShifts();
        console.log(shifts)
    }, []);
    
    return (
        <div>
            <h1>Your Shifts</h1>
            <ShiftCard />
        </div>
    );
}

export default Shifts;