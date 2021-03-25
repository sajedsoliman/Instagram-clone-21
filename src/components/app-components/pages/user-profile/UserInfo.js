import { useEffect, useState } from 'react'
// Material-Ui imports
import { Grid, makeStyles, Typography } from '@material-ui/core'

// component imports
import { AuthedUser } from '../../../user-context/AuthedUserContext'
import AuthUserActions from './user-details-section/AuthUserActions'
import NormalUserActions from './user-details-section/NormalUserActions'
import UserStatistics from './user-details-section/UserStatistics'
import UserDetails from './user-details-section/UserDetails'
import UserProfileImage from './user-details-section/UserProfileImage'
import { db } from '../../../common-components/firebase/database'

// style
const useStyles = makeStyles(theme => ({
    imageSection: {
        padding: "0 30px 30px 30px",
        [theme.breakpoints.down("xs")]: {
            padding: 0
        },

        "& .MuiAvatar-root": {
            width: 150,
            height: 150,
            cursor: "pointer",
            [theme.breakpoints.down("xs")]: {
                height: 80,
                width: 80
            }
        }
    },
    infoWrapper: {
        marginBottom: 50,
    },
    infoSection: {
        maxWidth: 350,
    },
    details: {
        "& > div": {
            display: "flex",
        }
    },
    actions: {
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,

        "& .username": {
            fontWeight: "normal",
            color: "rgba(0,0,0, .70)"
        }
    },
}))

function UserInfo(props) {
    const classes = useStyles()
    const loggedUser = AuthedUser()

    // destructuring through props
    const { user } = props

    // destructuring the user
    const { avatar, fullName, username, id } = user

    // State variables
    const [modalInfo, setModalInfo] = useState({ isOpen: false, title: "Change Profile Image" })

    // handle toggle change avatar modal
    const handleModalOpen = () => {
        setModalInfo(prev => ({
            ...prev, isOpen: !prev.isOpen
        }))
    }

    // Check that if the user if logged and they own this profile
    const isLoggedOwner = loggedUser != "no user" && (loggedUser.username == username)

    return (
        <Grid className={classes.infoWrapper} container>
            {/* User photo url */}
            <Grid item xs={3} sm={4} md={4} className={classes.imageSection}>
                <UserProfileImage
                    profileUser={user}
                    modalOpen={modalInfo}
                    handleModalOpen={handleModalOpen}
                    progressSize={window.innerWidth > 600 ? 170 : 95}
                    avatar={avatar}
                    userId={loggedUser.uid}
                    fullName={fullName} />
            </Grid>

            {/* User info & details section */}
            <Grid item xs={9} sm={8} md={8} className={classes.infoSection}>
                <div className={classes.details}>

                    {/* Name + actions */}
                    <div className={classes.actions}>
                        <Typography variant="h6" className="username">{username}</Typography>

                        {/* render action based on user state (logged in or out) */}
                        {isLoggedOwner ? <AuthUserActions /> :
                            <NormalUserActions user={user} />}
                    </div>

                    {/* Statistics */}
                    <UserStatistics
                        userId={id}
                        username={username}
                    />

                    {/* some other info like bio, fullName, and website... */}
                    <UserDetails user={user} />

                </div>
            </Grid>
        </Grid>

    )
}

export default UserInfo
