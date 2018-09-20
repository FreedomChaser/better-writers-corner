import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateUserid } from '../ducks/reducer'
import axios from 'axios'

//display chara's in a horizonatal menu start wtih no db version then upgrade to this
//should I allow images? and if so with or without amazon s3?..no for mvp
//have an add button that takes user to form 
//create form 
//a get req for the first 5 columns--this populates the horizontal menu
//have a menu toggle if toggle is false set menu to horizontal if true set to vertical
//just render on the page
class Characters extends React.Component {
    constructor() {
        super()

        this.state = {
            characters: []
        }
        this.getChara = this.getChara.bind(this)
        this.mapChara = this.mapChara.bind(this)
    }

    componentDidMount() {
        if (!this.props.userid) {
            axios.get('/api/userData')
                .then(res => {
                    this.props.updateUserid(res.data.userid)
                    this.getChara()
                }).catch(err => {
                    this.props.history.push('/')
                })
        } else {
            this.getChara()
        }
    }
    getChara() {
        //make sure getChara only grabs first six items
        axios.get(`/api/getChara/${this.props.match.params.storyid}`)
            .then((res) => {
                this.setState({ characters: res.data }, this.mapChara)
            })
    }
    deleteChara(storyid, characterid) {
        console.log('firing')
        axios.delete(`/api/deleteChara/${storyid}/${characterid}`)
            .then(() => this.getChara())
    }
    mapChara() {
        if (this.state.characters[0]) {
            return this.state.characters.map((ele, i) => {
                return (
                    // route must contain storyid and characterid
                    <div className='chareCard'>
                        <Link to={`/characters/${ele.storyid}/${this.props.match.params.title}/characterEditForm/${ele.characterid}`}>
                            <div>
                                <h2>{ele.first_name} {ele.last_name}</h2>
                                <p>Gender: {ele.gender}</p>
                                <p>Hair Color: {ele.hair_color}</p>
                                <p>Eye Color: {ele.eye_color}</p>
                                <p>Hobby: {ele.hobby}</p>
                            </div>
                        </Link>
                        <button onClick={() => this.deleteChara(ele.storyid, ele.characterid)}>Delete Character</button>
                    </div>
                )
            })
        } else {
            return (
                <p>No characters yet</p>
            )
        }
    }
    render() {
        let storyid = this.props.match.params.storyid
        let title = this.props.match.params.title
        return (
            <div>
                <h1>{title}</h1>
                <p>Characters</p>
                {/* <Link to={`/characters/${storyid}/characterForm`}> */}
                <button onClick={() => this.props.history.push(`/characters/${storyid}/${title}/characterAddForm`)}>Add Character</button>
                {/* </Link> */}
                {this.mapChara()}
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