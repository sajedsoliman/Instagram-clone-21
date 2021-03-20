// Material-Ui imports
import { Typography } from "@material-ui/core"
import { useState } from "react";


function PostCreatedTime({ postTimestamp }) {

    // State vars
    // const [createdTimeUnit, setCreatedTimeUnit] = useState("")
    const [createdTime, setCreatedTime] = useState(getCreatedTime())

    // get post's published time (algorithm)
    function getCreatedTime() {
        let unit = ""
        /* 
                // A promise to get post's created time in its proper unit and form in sequence
                const timePromise = new Promise((resolve, reject) => {
                    if (timeInSeconds >= 60) {
                        unit = "Min"
                        // Get time in minutes
                        resolve(timeInSeconds /= 60)
                    } else {
                        reject("secs")
                    }
                })
                timePromise
                    .then(inMins => {
                        if (inMins >= 60) {
                            unit = "Hr"
                            // in hours
                            return timeInSeconds /= 60
                        }
                    })
                    .then(inHrs => {
                        if (inHrs >= 24) {
                            unit = "Day"
                            // in days
                            return timeInSeconds /= 24
                        }
                    }).then(inDays => {
                        if (inDays >= 30) {
                            unit = "Month"
                            // in months
                            return timeInSeconds /= 30
                        }
                    }).then(finished => {
                        setCreatedTimeUnit(unit)
                        setCreatedTime(Math.floor(timeInSeconds))
                    }).catch(less => {
                        setCreatedTimeUnit(unit)
                        setCreatedTime(Math.floor(timeInSeconds))
                    }) */

        // another way to get it
        const intervals = [
            { label: 'y', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hr', seconds: 3600 },
            { label: 'min', seconds: 60 },
            { label: 'sec', seconds: 1 }
        ];

        let timeInSeconds = Math.round(((new Date().getTime() / 1000) - postTimestamp.seconds))
        const interval = intervals.find(i => i.seconds < timeInSeconds);
        const count = Math.floor(timeInSeconds / interval.seconds);

        // setCreatedTime(`${count} ${interval.label}${count !== 1 ? 's' : ''} ago`)
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }

    return (
        <Typography
            variant="overline"
            color="textSecondary">
            {createdTime}</Typography>
    )
}

export default PostCreatedTime
