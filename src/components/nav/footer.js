import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'

class Footer extends Component{
    render(){
        return(
            <p>This site was built using:</p>
        )
    }
}

export default withRouter(Footer)