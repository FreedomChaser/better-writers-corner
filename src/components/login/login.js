import React, {Component} from 'react'
import axios from 'axios'

export default class Login extends Component{
    constructor(){
        super()

        this.state={
            txt: [],
            val: 0
        }

    }
    login(){
        let {REACT_APP_DOMAIN, REACT_APP_CLIENT_ID} = process.env

        // let url = `${window.location.origin}/auth/callback`
        let url = encodeURIComponent(`${window.location.origin}/auth/callback`);

        window.location = `https://${REACT_APP_DOMAIN}/authorize?client_id=${REACT_APP_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${url}&response_type=code`
    }
    //change compnentdidmount
   async componentDidMount(){
        let quote = await axios.get('http://api.icndb.com/jokes/random')
        let quoteVal = quote.data.value.joke.length
        let quoteTxt = quote.data.value.joke.split('')

        this.setState({txt: quoteTxt, val: quoteVal})
        //set txt to state
        //do the for each in render
   

        // txt.forEach((ea))
        //parent div position relative
        //2nchilds button div(chara) absolute
    }
    //axios call to quote api
    //stringify
    //.then count string length
    //split string
    //have all letters start at 0deg and 20px from center
    //use 360/n(string count) to figure out length of separation
    //separate letters by that many degrees

    // circularTxt(txt, )
    render(){
        let deg = 360/ this.state.val
        let origin = 0
        

        let quote = this.state.txt.map(ea => {
            origin += deg
            return(
                <p style={{height: '200px', position: 'absolute', transform: `rotate(${origin}deg)`, transformOrigin: "0 100%"}}>{ea}</p>
            )
        })

        return(
            // <div style={{backgroundColor: 'black', opacity: '0.5'}}>
            <div>
            <div className='loginContainer'>
            <div className='circTxt'>
                {quote}
                <button className='loginBtn' onClick={this.login}>Login / Register</button>
            </div>
            </div>
            </div>
        )
    }
}