import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUserid } from '../ducks/reducer'

//pull character info to use as default values for input boxes(like helo)
//mimic form for helo, but with input rather than selection boxes
//parent div, an on hover function, position absolute and z-index
class CharacterForm extends Component {
    constructor() {
        super()

        this.state = {
            first_name: '',
            last_name: '',
            gender: '',
            hair_color: '',
            eye_color: '',
            age: 0,
            occupation: '',
            dd_alignment: '',
            special_abilities: '',
            hobby: '',
        }
        this.addChara = this.addChara.bind(this)
    }
    componentDidMount() {
        if (!this.props.userid) {
            axios.get('/api/userData')
                .then(res => {
                    this.props.updateUserid(res.data.userid)
                }).catch(err => {
                    this.props.history.push('/')
                })
        } else {
            return null
        }
    }
    //make axios.post to save character
    addChara(storyid) {
        if (this.state.first_name) {
            let numPattern =  /^[0-9]*$/gm
            if(numPattern.test(this.state.age)){
                axios.post(`/api/addChara/${storyid}`, { ...this.state })
                    .then(() => this.props.history.push(`/characters/${storyid}/${this.props.match.params.title}`))
            }else{
                alert('Age must be an integer')
            }
        }
        else {
            alert('New character must have a first Name')
        }
    }

    render() {
        let storyid = this.props.match.params.storyid
        let title = this.props.match.params.title
        return (
            <div>
                <h1>{title}</h1>
                <h2>New Character</h2>
                <button onClick={() => this.props.history.push(`/characters/${storyid}/${title}`)}>Cancel</button>

                <div>
                    <p>First Name</p>
                    <input onChange={(e) => this.setState({ first_name: e.target.value })}></input>
                </div>
                <div>
                    <p>Last Name</p>
                    <input onChange={(e) => this.setState({ last_name: e.target.value })}></input>
                </div>
                <div>
                    <p>Gender</p>
                    <input onChange={(e) => this.setState({ gender: e.target.value })}></input>
                </div>
                <div>
                    <p>Hair Color</p>
                    <input onChange={(e) => this.setState({ hair_color: e.target.value })}></input>
                </div>
                <div>
                    <p>Eye Color</p>
                    <input onChange={(e) => this.setState({ eye_color: e.target.value })}></input>
                </div>
                <div>
                    <p>Age</p>
                    <input onChange={(e) => this.setState({ age: e.target.value })}></input>
                </div>
                <div>
                    <p>Occupation</p>
                    <input onChange={(e) => this.setState({ Occupation: e.target.value })}></input>
                </div>
                <div>
                    <p>dd_alignment</p>
                    <input onChange={(e) => this.setState({ dd_alignment: e.target.value })}></input>
                </div>
                <div>
                    <p>special_abilities</p>
                    <input onChange={(e) => this.setState({ special_abilities: e.target.value })}></input>
                </div>
                <div>
                    <p>Hobby</p>
                    <input onChange={(e) => this.setState({ hobby: e.target.value })}></input>
                </div>
                
                <button onClick={() => this.addChara(storyid)}>Save Character</button>
            </div>
        )
    }
}

function mapStateToProps(reduxState) {
    const {
        userid,
    } = reduxState

    return {
        userid,
    }
}

export default connect(mapStateToProps, { updateUserid })(CharacterForm)
