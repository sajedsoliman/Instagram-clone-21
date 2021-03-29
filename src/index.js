import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./components/App"

// Contexts
import { AuthedUserProvider } from './components/user-context/AuthedUserContext'

// SnackBars (stack) on top of each other
import { SnackbarProvider } from 'notistack';


ReactDOM.render(
    <Router>
        <AuthedUserProvider>
            <SnackbarProvider maxSnack={4}>
                <App />
            </SnackbarProvider>
        </AuthedUserProvider>
    </Router>, document.getElementById("root"))