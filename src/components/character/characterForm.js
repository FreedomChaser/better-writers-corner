import React, {Component} from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUserid } from '../ducks/reducer'

//pull character info to use as default values for input boxes(like helo)
//mimic form for helo, but with input rather than selection boxes
class CharacterForm extends Component{
    render(){
        let storyid = this.props.match.params.storyid 
        return(
            <div>Character Form
                <button onClick={() => this.props.history.push(`/characters/${storyid}/`)}>Cancel</button>
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

export default connect(mapStateToProps, { updateUserid })(CharacterForm)
