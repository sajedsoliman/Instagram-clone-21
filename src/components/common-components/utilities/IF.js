
function IF({ condition, children, elseChildren = null }) {

    return (
        condition ? children : elseChildren
    )
}

export default IF
