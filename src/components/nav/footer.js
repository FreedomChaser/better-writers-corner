import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class Footer extends Component {
    render() {
        if (this.props.location.pathname !== '/') {
            return (
                <p>This site was built using:</p>
            )
        }else{
            return null
        }
    }
}

export default withRouter(Footer)