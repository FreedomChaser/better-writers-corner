import React, {Component} from 'react'

export default class Login extends Component{
    login(){
        let {REACT_APP_DOMAIN, REACT_APP_CLIENT_ID} = process.env

        // let url = `${window.location.origin}/auth/callback`
        let url = encodeURIComponent(`${window.location.origin}/auth/callback`);

        window.location = `https://${REACT_APP_DOMAIN}/authorize?client_id=${REACT_APP_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${url}&response_type=code`
    }
    render(){
        return(
            <div className='loginBody'>
            <div className='login'>
                <img src='logo.png' alt=''/>
                <h1 className='loginH1'>reandom quote</h1>
                <button className='loginBtn' onClick={this.login}>Login / Register</button>
            </div>
            </div>
        )
    }
}