import React from 'react'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import { updateUserid } from '../ducks/reducer'

//display chara's in a horizonatal menu
//should I allow images? and if so with or without amazon s3?..no for mvp
//have an add button that takes user to form 
//create form 
//a get req for the first 5 columns--this populates the horizontal menu
class Characters extends React.Component{

    render(){
        let storyid = this.props.match.params.storyid
        return(
            <div>
                <p>Characters</p>
                {/* <Link to={`/characters/${storyid}/characterForm`}> */}
                <button onClick={() => this.props.history.push(`/characters/${storyid}/characterForm`)}>Add Character</button>
                {/* </Link> */}
            </div>
        )
    }
}

function mapStateToProps(reduxState) {
    const {
        userid
    } = reduxState

    return {
        userid
    }
}

export default connect(mapStateToProps, { updateUserid })(Characters)