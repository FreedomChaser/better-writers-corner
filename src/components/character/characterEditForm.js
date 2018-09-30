import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUserid, updateFirstName, updateLastName, updateGender, updateHairColor, updateEyeColor, updateHobby, updateAge, updateOccupation, updateDD_alignment, updateSpecial_abilities } from '../ducks/reducer'

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
            undoToggle: false
        }
        // this.clearState = this.clearState.bind(this)
        this.resetState = this.resetState.bind(this)
        this.updateChara = this.updateChara.bind(this)
        this.getCharaByid = this.getCharaByid.bind(this)
        this.cancelBtn = this.cancelBtn.bind(this)
        this.setNewInfo = this.setNewInfo.bind(this)
        this.resetSave = this.resetSave.bind(this)
    }
    componentDidMount() {
        if (!this.props.userid) {
            axios.get('/api/userData')
                .then(res => {
                    console.log(res)
                    this.props.updateUserid(res.data.userid)
                    this.getCharaByid()
                }).catch(err => {
                    this.props.history.push('/')
                })
        } else {
            this.getCharaByid()
        }
    }

    getCharaByid() {
        let storyid = this.props.match.params.storyid
        let characterid = this.props.match.params.characterid
        axios.get(`/api/getCharaByid/${storyid}/${characterid}`)
            .then((res) => {
                console.log(res)
                this.setState({
                    first_name: res.data[0].first_name,
                    last_name: res.data[0].last_name,
                    gender: res.data[0].gender,
                    hair_color: res.data[0].hair_color,
                    eye_color: res.data[0].eye_color,
                    hobby: res.data[0].hobby,
                    age: res.data[0].age,
                    occupation: res.data[0].occupation,
                    dd_alignment: res.data[0].dd_alignment,
                    special_abilities: res.data[0].special_abilities
                })
                this.props.updateFirstName(res.data[0].first_name)
                this.props.updateLastName(res.data[0].last_name)
                this.props.updateGender(res.data[0].gender)
                this.props.updateHairColor(res.data[0].hair_color)
                this.props.updateEyeColor(res.data[0].eye_color)
                this.props.updateHobby(res.data[0].hobby)
                this.props.updateAge(res.data[0].age)
                this.props.updateOccupation(res.data[0].occupation)
                this.props.updateDD_alignment(res.data[0].dd_alignment)
                this.props.updateSpecial_abilities(res.data[0].special_abilities)
            })
    }
    setNewInfo() {
        let storyid = this.props.match.params.storyid
        let characterid = this.props.match.params.characterid
        axios.get(`/api/getCharaByid/${storyid}/${characterid}`)
            .then((res) => {
                this.setState({
                    first_name: res.data[0].first_name,
                    last_name: res.data[0].last_name,
                    gender: res.data[0].gender,
                    hair_color: res.data[0].hair_color,
                    eye_color: res.data[0].eye_color,
                    hobby: res.data[0].hobby,
                    age: res.data[0].age,
                    occupation: res.data[0].occupation,
                    dd_alignment: res.data[0].dd_alignment,
                    special_abilities: res.data[0].special_abilities,
                    undoToggle: !this.state.undoToggle
                })
            })
    }

    clearState(val) {
        switch (val) {
            //this.setState({[val]:''})           
            case 'first_name':
                return this.setState({ first_name: '' })
            case 'last_name':
                return this.setState({ last_name: '' })
            case 'gender':
                return this.setState({ gender: '' })
            case 'hair_color':
                return this.setState({ hair_color: '' })
            case 'eye_color':
                return this.setState({ eye_color: '' })
            case 'age':
                return this.setState({ age: 0 })
            case 'occupation':
                return this.setState({ occupation: '' })
            case 'dd_alignment':
                return this.setState({ dd_alignment: '' })
            case 'special_abilities':
                return this.setState({ special_abilities: '' })
            case 'hobby':
                return this.setState({ hobby: '' })
            default: return this.state
        }
        this.setState({
            first_name: '',
            last_name: '',
            gender: '',
            hair_color: '',
            eye_color: '',
            age: null,
            occupation: '',
            dd_alignment: '',
            special_abilities: '',
            hobby: '',
        })
    }

    resetState() {
        this.setState({
            first_name: this.props.first_name,
            last_name: this.props.last_name,
            gender: this.props.gender,
            hair_color: this.props.hair_color,
            eye_color: this.props.eye_color,
            age: this.props.age,
            occupation: this.props.occupation,
            dd_alignment: this.props.dd_alignment,
            special_abilities: this.props.special_abilities,
            hobby: this.props.hobby,
            undoToggle: !this.state.undoToggle
        })

    }

    cancelBtn() {
        let storyid = this.props.match.params.storyid
        let title = this.props.match.params.title
        // this.resetState()
        this.props.history.push(`/characters/${storyid}/${title}`)
    }

    updateChara() {
        console.log('firing')
        let storyid = this.props.match.params.storyid
        let characterid = this.props.match.params.characterid

        axios.post(`/api/updateChara/${storyid}/${characterid}`, { ...this.state })
            .then(() => {
                this.setNewInfo()
                //add a method that renders a button called undo last update? and have it trigger reset state
                alert('character updated')
            })
    }

    resetSave() {
        this.setState({
            first_name: this.props.first_name,
            last_name: this.props.last_name,
            gender: this.props.gender,
            hair_color: this.props.hair_color,
            eye_color: this.props.eye_color,
            age: this.props.age,
            occupation: this.props.occupation,
            dd_alignment: this.props.dd_alignment,
            special_abilities: this.props.special_abilities,
            hobby: this.props.hobby,
            undoToggle: !this.state.undoToggle
        }, this.updateChara)
        // <button onClick={this.resetState}>Undo Update</button>
    }

    deleteChara(storyid, characterid) {
        // let storyid = this.props.match.params.storyid
        let title = this.props.match.params.title
        axios.delete(`/api/deleteChara/${storyid}/${characterid}`)
            .then(() => this.props.history.push(`/characters/${storyid}/${title}`))

    }

    render() {
        let storyid = this.props.match.params.storyid
        let characterid = this.props.match.params.characterid
        let title = this.props.match.params.title
        return (
            <div className='charaEditBod'>
                <div className='editCharaDiv'>
                    <h1 className='editCharaH1'>{title}</h1>
                    <h2 className='editCharaH2'>{this.state.first_name} {this.state.last_name}</h2>
                    <div>
                    <button className='editCharaResUp' onClick={this.cancelBtn}>Go to main <b>{title}</b> page</button>
                    <button className='editCharaResUp' onClick={this.resetState}>Reset</button>
                    </div>
                    <div>
                    <p className='editCharaText'>First Name:</p>
                    <input className='editCharaInput' value={this.state.first_name} onClick={() => this.clearState('first_name')} onChange={(e) => this.setState({ first_name: e.target.value })}></input>
                    </div>
                    <div>
                    <p className='editCharaText'>Last Name:</p>
                    <input className='editCharaInput' value={this.state.last_name} onClick={() => this.clearState('last_name')} onChange={(e) => this.setState({ last_name: e.target.value })}></input>
                    </div>
                    <div>
                    <p className='editCharaText'>Gender:</p>
                    <input className='editCharaInput' value={this.state.gender} onClick={() => this.clearState('gender')} onChange={(e) => this.setState({ gender: e.target.value })}></input>
                    </div>
                    <div>
                    <p className='editCharaText'>Hair Color:</p>
                    <input className='editCharaInput' value={this.state.hair_color} onClick={() => this.clearState('hair_color')} onChange={(e) => this.setState({ hair_color: e.target.value })}></input>
                    </div>
                    <div>
                    <p className='editCharaText'>Eye Color:</p>
                    <input className='editCharaInput' value={this.state.eye_color} onClick={() => this.clearState('eye_color')} onChange={(e) => this.setState({ eye_color: e.target.value })}></input>
                    </div>
                    <div>
                    <p className='editCharaText'>Age:</p>
                    <input className='editCharaInput' value={this.state.age} onClick={() => this.clearState('age')} onChange={(e) => this.setState({ age: e.target.value })}></input>
                    </div>
                    <div>
                    <p className='editCharaText'>Occupation:</p>
                    <input className='editCharaInput' value={this.state.occupation} onClick={() => this.clearState('occupation')} onChange={(e) => this.setState({ occupation: e.target.value })}></input>
                    </div>
                    <div>
                    <p className='editCharaText'>D&D Alignment:</p>
                    <input className='editCharaInput' value={this.state.dd_alignment} onClick={() => this.clearState('dd_alignment')} onChange={(e) => this.setState({ dd_alignment: e.target.value })}></input>
                    </div>
                    <div>
                    <p className='editCharaText'>Special Abilities:</p>
                    <input className='editCharaInput' value={this.state.special_abilities} onClick={() => this.clearState('special_abilities')} onChange={(e) => this.setState({ special_abilities: e.target.value })}></input>
                    </div>
                    <div>
                    <p className='editCharaText'>Hobby:</p>
                    <input className='editCharaInput' value={this.state.hobby} onClick={() => this.clearState('hobby')} onChange={(e) => this.setState({ hobby: e.target.value })}></input>
                    </div>
                    <div>
                    <button className='editCharaResUp' onClick={this.updateChara}>Update</button>
                    {this.state.undoToggle ? <button className='editCharaResUp' onClick={this.resetSave}>Undo Update</button> : null}
                    <button className='editCharaResUp' onClick={() => this.deleteChara(storyid, characterid)}>Delete Character</button>
                </div>
                </div>
            </div >
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
        hobby,
        age,
        occupation,
        dd_alignment,
        special_abilities
    } = reduxState

    return {
        userid,
        first_name,
        last_name,
        gender,
        hair_color,
        eye_color,
        hobby,
        age,
        occupation,
        dd_alignment,
        special_abilities
    }
}

export default connect(mapStateToProps, { updateUserid, updateFirstName, updateLastName, updateGender, updateHairColor, updateEyeColor, updateHobby, updateAge, updateOccupation, updateDD_alignment, updateSpecial_abilities })(CharacterForm)
