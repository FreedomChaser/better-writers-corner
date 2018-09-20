import React, {Component} from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUserid, updateFirstName, updateLastName, updateGender, updateHairColor, updateEyeColor, updateHobby } from '../ducks/reducer'

//pull character info to use as default values for input boxes(like helo)
//mimic form for helo, but with input rather than selection boxes
//parent div, an on hover function, position absolute and z-index
class CharacterForm extends Component{
    constructor(){
        super()

        this.state = {
            first_name: '',
            last_name: '',
            gender: '',
            hair_color: '',
            eye_color: '',
            hobby: '',                      
        }
        this.clearState = this.clearState.bind(this)
        this.updateUser = this.updateUser.bind(this)
    }
    componentDidMount(){
        if(!this.props.userid){
            axios.get('/api/userData')
            .then(res => {
                console.log(res)
                this.props.updateUserid(res.data.userid)
                axios.get('/api/getCharaByid')
                .then((res) => {this.setState({
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    gender: res.data.gender,
                    hair_color: res.data.hair_color,
                    eye_color: res.data.eye_color,
                    hobby: res.data.hobby,                    
            })
                this.props.updateFirstName(res.data.first_name)
                this.props.updateLastName(res.data.last_name)
                this.props.updateGender(res.data.gender)
                this.props.updateHairColor(res.data.hair_color)
                this.props.updateEyeColor(res.data.eye_color)
                this.props.updateHobby(res.data.hobby)                
            })  
            }).catch(err => {
                this.props.history.push('/')
            })
        }else{
            axios.get('/api/getChara')
            .then((res) => {this.setState({
                first_name: res.data.first_name,
                last_name: res.data.last_name,
                gender: res.data.gender,
                hair_color: res.data.hair_color,
                eye_color: res.data.eye_color,
                hobby: res.data.hobby,                
        })
                this.props.updateFirstName(res.data.first_name)
                this.props.updateLastName(res.data.last_name)
                this.props.updateGender(res.data.gender)
                this.props.updateHairColor(res.data.hair_color)
                this.props.updateEyeColor(res.data.eye_color)
                this.props.updateHobby(res.data.hobby)                
    })  
    }     
    }

    getCharaByid(){}


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
        userid,
        first_name,
        last_name,
        gender,
        hair_color,
        eye_color,
        hobby
    } = reduxState

    return {
        userid,
        first_name,
        last_name,
        gender,
        hair_color,
        eye_color,
        hobby
    }
}

export default connect(mapStateToProps, { updateUserid, updateFirstName, updateLastName, updateGender, updateHairColor, updateEyeColor, updateHobby })(CharacterForm)
