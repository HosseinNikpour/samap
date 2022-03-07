import React, { useState, useEffect } from 'react';
import { Route, Redirect } from "react-router-dom";
import { verifyToken } from '../api/index'

const PrivateRoute = (props) => {
    const [authenticated, setAuthenticated] = useState(0);

    useEffect(() => {


        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : undefined,
            token = localStorage.getItem('token') ? localStorage.getItem('token') : undefined;
        if (!user || !token) {
            setAuthenticated(-1);
        }
        else {
            verifyToken({ user, token }).then(response => {
                //todo : handel permission for admin role ===>props.role=='admin'
                //todo : check the response and then if it is  ok set state
                ///    console.log(response);
                //  console.log("user.role", user);
                //   console.log("page.role", this.props.role);
               // debugger;
                if (typeof props.onLogin === 'function')
                    props.onLogin(5);

                if (props.role)
                    if (user.role === props.role)
                        setAuthenticated(1);
                    else
                        setAuthenticated(-1);
                else
                    setAuthenticated(1);
            }).catch((error) => {
                console.log(error);
                setAuthenticated(-1);
            });
        }
    }, [])
    if (authenticated === -1)
        return (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />)//,message:'دسترسی لازم برای این صفحه را ندارید'
    else if (authenticated > 0)
        return (<Route {...props} />)
    return (<div></div>)
}
export default PrivateRoute;