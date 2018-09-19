//for add story always render a menu button with a plus sign, when the plus sign is clicked a modal pops up with a title input and an add/purchase story button
//add/purchase story renders condtionally based on whether story count is >= 3 after purchasing with strip the story button will appear and site will run as usual


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
        // this.addTitle = this.addTitle.bind( this )
        // this.deleteStory = this.deleteStory.bind( this )
        this.toggleModal = this.toggleModal.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
        this.toggleSub = this.toggleSub.bind(this)
        this.subMenuDisplay = this.subMenuDisplay.bind(this)
        this.subMenuVals = this.subMenuVals.bind(this)
    }
    componentDidMount() {
        if (!this.props.userid) {
            axios.get('api/userData')
                .then((res) => {
                    this.props.updateUserid
                    axios.get('/api/getStories')
                        .then(res => { this.setState({ stories: [...this.state.stories, ...res.data.stories], storyNum: res.data.count }) })
                })
                .catch(err => {
                    this.props.history.push('/')
                })
        } else {
            axios.get('/api/getStories')
                .then(res => { this.setState({ stories: res.data.stories, storyNum: res.data.count }) })
        }
    }

    //make modal on click button method
    toggleModal() {
        this.setState({ modalToggle: !this.state.modalToggle })
    }
    toggleMenu() {
        this.setState(previousState => { return {menuToggle: !previousState.menuToggle} })
    }
    toggleSub() {
        this.setState({subToggle: !this.state.subToggle})
    }
    //just do an axios then rerender stories
    addStory() {
        let { modalInput } = this.state
        axios.post('/api/addStory', { modalInput })
            .then()
    }
    //add in stripe functionality and then run the axios call and rerender stories
    buyStory() { }

    deleteStory() { }

    subMenuVals(title, left, top, storyid){
        console.log('subfiring')
        // let newTitle = this.state.titles
        // newTitle[title] = [left, top]
        this.setState({titles: [left, top], storyid: storyid})
    }
    subMenuDisplay(){
        let left = this.state.titles[0]
        console.log(left)
        let top = this.state.titles[1]

        if(this.state.subToggle){
            return(
                <div className={this.state.subToggle ? 'open sub' : 'sub'} style={this.state.subToggle ? {left, top}: {left: 0, top: 0}}>
                    <button onClick={()=>this.props.history.push(`/story/${this.state.storyid}/character/`)}>Character</button>
                    <button onClick={() => this.deleteStory(this.state.storyid)}>Delete</button>
                </div>
            )
        }else{return null}
    }
    render() {
        console.log(this.state.titles)
        let mappedMenu = this.state.stories.map((e, i) => {
            let l = this.state.stories.length
            let top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
            let left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
            return (
                // classname = on click for circle and open
                <div key={i} className={this.state.menuToggle ?'open circle': 'circle'} style={this.state.menuToggle ?{ left, top }: {}}>
                    {e.title != '+' ?
                        //onClick for sub menues                        
                        <button className='radMenuBtn' onClick={() => {
                            this.toggleSub()
                            this.subMenuVals(e.title, left, top, e.storyid)
                        }}>{e.title}</button>
                        //on click for add story model
                        : <button id="addStoryBtn" onClick={this.toggleModal}>{e.title}</button>
                    }
                    {this.state.storyid === e.storyid ? this.subMenuDisplay(): null}
                </div>
            )
        })
        return (
            <div>

                <div className='circular-menu'>
                <button className='radialMenu' onClick={this.toggleMenu}>My Stories</button>
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
                                {this.state.storyNum <= 2 ? <button>Add story</button> : <button>Buy Story ($0.99)</button>}
                                <button onClick={this.toggleModal}>Cancel</button>
                            </div>
                        </ div>
                    </div>
                    : null}

                <Link to='/characters'>
                    <button>Characters</button>
                </Link>
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