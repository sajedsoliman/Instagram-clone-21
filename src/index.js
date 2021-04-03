import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"

// Material-UI
import { ThemeProvider } from "@material-ui/styles";
import theme from './styles/commonTheme'


// Contexts
import { AuthedUserProvider } from './components/user-context/AuthedUserContext'
import { NotificationContext } from "./components/notification-context/NotificationContext";
import { LayoutContextProvider } from "./components/contexts/layout-context/LayoutContext";


// SnackBars (stack) on top of each other
import { SnackbarProvider } from 'notistack';

// Components
import App from "./components/App"

ReactDOM.render(
    <Router>
        <ThemeProvider theme={theme}>
            <AuthedUserProvider>
                <NotificationContext>
                    <LayoutContextProvider>
                        <SnackbarProvider maxSnack={4}>
                            <App />
                        </SnackbarProvider>
                    </LayoutContextProvider>
                </NotificationContext>
            </AuthedUserProvider>
        </ThemeProvider>
    </Router>, document.getElementById("root"))