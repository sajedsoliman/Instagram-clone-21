function withS(set) {
    if (set != undefined) {
        return set.length > 1 ? "s" : ""
    }
}

// The date that something was created at
// it does take only one param which the time stamp object
function presenceDate(timestamp) {
    const intervals = [
        { label: 'y', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hr', seconds: 3600 },
        { label: 'min', seconds: 60 },
        { label: 'sec', seconds: 1 }
    ];

    let timeInSeconds = Math.ceil(((new Date().getTime() / 1000) - timestamp?.seconds))
    const interval = intervals.find(i => i.seconds <= timeInSeconds);
    const count = Math.floor(timeInSeconds / interval.seconds);

    // setCreatedTime(`${count} ${interval.label}${count !== 1 ? 's' : ''} ago`)
    return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;

}

export { withS, presenceDate }