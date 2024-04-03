import { Event } from "react-big-calendar";
import { getNextDays } from "../../../utils/DateUtils";

const now = new Date();
// set to 12am for consistency across time calculations
now.setHours(0, 0, 0, 0);
const tomorrow = getNextDays(now, 1);
const threeDaysBefore = getNextDays(now, -3);
const tenDaysBefore = getNextDays(now, -10);

const events: Event[] = [
    {
        title: 'Acai Bowls',
        start: new Date(tenDaysBefore.setHours(8)),
        end: new Date(tenDaysBefore.setHours(11)),
        resource: {
            requestType: 'kitchen'
        }
    },
    {
        title: 'Do Floorings',
        start: new Date(threeDaysBefore.setHours(12)),
        end: new Date(new Date(threeDaysBefore.setHours(16)).setMinutes(30)),
        resource: {
            requestType: 'site'
        }
    },
    {
        title: 'Eggs and Toast',
        start: new Date(now.setHours(8)),
        end: new Date(now.setHours(9)),
        resource: {
            requestType: 'kitchen'
        }
    },
    {
        title: 'Spaghetti and Meatballs',
        start: new Date(new Date(now.setHours(8)).setMinutes(30)),
        end: new Date(now.setHours(11)),
        resource: {
            requestType: 'kitchen'
        }
    },
    {
        title: 'Get New Supplies',
        start: new Date(new Date(now.setHours(14)).setMinutes(30)),
        end: new Date(now.setHours(16)),
        resource: {
            requestType: 'site'
        }
    },
    {
        title: 'Fix Lightings',
        start: new Date(tomorrow.setHours(11)),
        end: new Date(tomorrow.setHours(12)),
        resource: {
            requestType: 'site'
        }
    },
];
export default events;
