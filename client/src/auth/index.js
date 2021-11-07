import { getNativeSelectUtilityClasses } from "@mui/material";
import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

export const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    ERROR: "ERROR",
    MODAL_CLOSE: "MODAL_CLOSE",
    LOGOUT_USER: "LOGOUT_USER",
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        error: false,
        errorMessage: null,
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    error: false,
                    errorMessage: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: false,
                    errorMessage: null
                })
            }
            case AuthActionType.ERROR: {
                return setAuth({
                    user: payload.user,
                    loggedIn: false,
                    error: true,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: payload.loggedIn,
                    error: false,
                    errorMessage: null
                })
            }
            case AuthActionType.MODAL_CLOSE: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.user,
                    error: false,
                    errorMessage: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: false,
                    errorMessage: null
                })
            }
            default:
                return auth;
        }
    }
    auth.loginUser = async function (userdata, store) {
        const response = await api.loginUser(userdata).catch((error) => {
            authReducer({
                type: AuthActionType.ERROR,
                payload: {
                    user: null,
                    errorMessage: error.response.data.errorMessage
                }
            });
        });
        if (response && response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            });
            history.push("/")
            store.loadIdNamePairs();
        }

    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
            //history.push("/");
            //store.loadIdNamePairs();
        }
    }
    auth.logoutUser = async function() {
        authReducer({
            type: AuthActionType.LOGOUT_USER,
            payload: {
                loggedIn: false
            }
        })
        history.push("/");
    }
    auth.registerUser = async function(userData, store) {
        const response = await api.registerUser(userData).catch((error) => {
            authReducer({
                type: AuthActionType.ERROR,
                payload: {
                    user: null,
                    errorMessage: error.response.data.errorMessage
                }
            });
        });      
        if (response && response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        } 
    }
    auth.closeModal = async function() {
        authReducer({
            type: AuthActionType.MODAL_CLOSE,
            payload: {
                user: null,
                loggedIn: false
            }
        })
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };