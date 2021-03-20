function withS(set) {
    if (set != undefined) {
        return set.length > 1 ? "s" : ""
    }
}

export { withS }