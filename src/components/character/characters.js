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
        axios.delete(`/api/deleteChara/${storyid}/${characterid}`)
            .then(() => this.getChara())
    }
    mapChara() {
        if (this.state.characters[0]) {
            return this.state.characters.map((ele, i) => {
                return (
                    // route must contain storyid and characterid
                    <div className='charaCard'>
                        <Link to={`/characters/${ele.storyid}/${this.props.match.params.title}/characterEditForm/${ele.characterid}`}>
                            <div>
                                <h2 className='charaH2'>{ele.first_name} {ele.last_name}</h2>
                                <p className='chara'>Gender: {ele.gender}</p>
                                <p className='chara'>Hair Color: {ele.hair_color}</p>
                                <p className='chara'>Eye Color: {ele.eye_color}</p>
                                <p className='chara'>Hobby: {ele.hobby}</p>
                            </div>
                        </Link>
                        <div className='delCharaDiv'>
                        <button className='charaDelBtn' onClick={() => this.deleteChara(ele.storyid, ele.characterid)}>Delete Character</button>
                        </div>
                    </div>
                )
            })
        } else {
            return (
                <p className='charaNone'>No characters yet</p>
            )
        }
    }
    // componentWillUnmount(){
    //     console.log('unmount')
    // }
    render() {
        let storyid = this.props.match.params.storyid
        let title = this.props.match.params.title
        return (
            <div className='charaBod'>
                <div className='charaTitle'>
                <h1 className='charaH1'>{title}</h1>
                {/* <p>Characters</p> */}
                {/* <Link to={`/characters/${storyid}/characterForm`}> */}
                <button className='charaAddBtn' onClick={() => this.props.history.push(`/characters/${storyid}/${title}/characterAddForm`)}>Add Character</button>
                </div>
                {/* </Link> */}
                <div className='charaDiv'>
                {this.mapChara()}
                </div>
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