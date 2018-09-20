//for add story always render a menu button with a plus sign, when the plus sign is clicked a modal pops up with a title input and an add/purchase story button
//add/purchase story renders condtionally based on whether story count is <= 2 after purchasing with strip the story button will appear and site will run as usual

//write purchase button with stripe
// login api
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUserid } from '../ducks/reducer'

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            stories: [{ title: '+' }],
            modalInput: '',
            modalToggle: false,
            storyNum: 0,
            menuToggle: false,
            titles: [0, 0],
            subToggle: false,
            storyid: 0,
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
        this.toggleSub = this.toggleSub.bind(this)
        this.subMenuDisplay = this.subMenuDisplay.bind(this)
        this.subMenuVals = this.subMenuVals.bind(this)
        this.getStories = this.getStories.bind(this)
        this.deleteStory = this.deleteStory.bind(this)
        this.menuClick = this.menuClick.bind(this)
        this.addStory = this.addStory.bind(this)
        this.addClick = this.addClick.bind(this)
    }
    componentDidMount() {
        if (!this.props.userid) {
            axios.get('api/userData')
                .then((res) => {
                    this.props.updateUserid
                    this.getStories()
                })
                .catch(err => {
                    this.props.history.push('/')
                })
        } else {
            this.getStories()
        }
    }

    getStories() {
        axios.get('/api/getStories')
            .then(res => { this.setState({ stories: [{ title: '+' }, ...res.data.stories], storyNum: res.data.count[0].count }) })
    }
    toggleModal() {
        this.setState({ modalToggle: !this.state.modalToggle })
    }
    toggleMenu() {
        this.setState(previousState => { return { menuToggle: !previousState.menuToggle } })
    }
    toggleSub() {
        this.setState({ subToggle: !this.state.subToggle })
    }
    menuClick() {
        if (this.state.subToggle) {
            this.toggleMenu()
            this.toggleSub()
        } else {
            this.toggleMenu()
        }
    }

    addClick() {
        this.addStory()
        this.toggleModal()
    }
    //just do an axios then rerender stories
    addStory() {
        let { modalInput } = this.state
        axios.post('/api/addStory', { title: this.state.modalInput })
            .then(() => this.getStories())
    }
    //add in stripe functionality and then run the axios call and rerender stories
    buyStory() { }

    deleteStory(storyid) {
        axios.delete(`/api/deleteStory/${storyid}`)
            .then(() => this.getStories())
    }

    // renameStory(storyid){}

    subMenuVals(title, left, top, storyid) {
        // let newTitle = this.state.titles
        // newTitle[title] = [left, top]
        this.setState({ titles: [left, top], storyid: storyid })
    }
    subMenuDisplay(title) {
        let left = this.state.titles[0]
        let top = this.state.titles[1]

        if (this.state.subToggle) {
            return (
                <div className={this.state.subToggle ? 'open sub' : 'sub'} style={this.state.subToggle ? { left, top } : { left: 0, top: 0 }}>
                    <button onClick={() => this.props.history.push(`/characters/${this.state.storyid}/${title}`)}>Character</button>
                    <button onClick={() => this.deleteStory(this.state.storyid)}>Delete</button>
                    {/* <button onClick={() => this.renameStory(this.state.storyid)}>Rename</button> */}
                </div>
            )
        } else { return null }
    }


    render() {
        console.log(this.state)
        let mappedMenu = this.state.stories.map((e, i) => {
            let l = this.state.stories.length
            let top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
            let left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
            return (
                // classname = on click for circle and open
                <div key={i} className={this.state.menuToggle ? 'open circle' : 'circle'} style={this.state.menuToggle ? { left, top } : {}}>
                    {e.title != '+' ?
                        //onClick for sub menues                        
                        <button className='radMenuBtn' onClick={() => {
                            this.toggleSub()
                            this.subMenuVals(e.title, left, top, e.storyid)
                        }}>{e.title}</button>
                        //on click for add story model
                        : <button id="addStoryBtn" onClick={this.toggleModal}>{e.title}</button>
                    }
                    {this.state.storyid === e.storyid ? this.subMenuDisplay(e.title) : null}
                </div>
            )
        })
        return (
            <div>

                <div className='circular-menu'>
                    <button className='radialMenu' onClick={this.menuClick}>My Stories</button>
                    {mappedMenu}
                </div>

                {this.state.modalToggle ?
                    <div>
                        {/* <!-- The Modal --> */}
                        < div id="myModal" className="modal">

                            {/* <!-- Modal content --> */}
                            <div className="modal-content">
                                <span className="close" onClick={this.toggleModal}>&times;</span>
                                <p>What would you like to call your story?</p>
                                <input className='modelInput' onChange={(e) => { this.setState({ modalInput: e.target.value }) }}></input>
                                {/* button that conditionally renders based on number of stories */}
                                {Number(this.state.storyNum[0]) >= 2 ? <button onClick={this.addClick}>Add story</button> : <button>Buy Story ($1.00)</button>}
                                <button onClick={this.toggleModal}>Cancel</button>
                            </div>
                        </ div>
                    </div>
                    : null}
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

export default connect(mapStateToProps, { updateUserid })(Home)