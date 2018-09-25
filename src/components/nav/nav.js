import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'

class Nav extends Component {
    logout() {
        axios.post('/api/logout')
            .then(this.props.history.push('/'))
    }
    render() {
        if (this.props.location.pathname !== '/') {
            return (
                <div className='navMain'>
                    <Link to='/home'>
                        <h1 className='navH1'>Writers Corner</h1>
                    </Link>
                    <button className='navBtn' onClick={() => this.logout()}>Logout</button>
                </div>
            )
            // if(this.props.location.pathname === '/home'){
            //     return(
            //         <div>
            //             <h1>Writers Corner</h1>
            //             <button onClick={() => this.logout()}>Logout</button>
            //         </div>
            //     )
            // }else if(this.props.location.pathname === '/characters/:storyid'){
            //     
            // }else{
            //     return null
            // }
        } else {
            return null
        }
    }
}

export default withRouter(Nav)