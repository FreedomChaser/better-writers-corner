import React, {Component} from 'react'
import axios from 'axios'

export default class Radial extends Component{
    constructor(props){
        super(props)
            this.state = {
                stories: [{ title: '+' }],
                storyNum: 0,
                menuToggle: false,
                subToggle: false,
            }
        this.getStories = this.getStories.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
        this.toggleSub = this.toggleSub.bind(this)
        this.subMenuDisplay = this.subMenuDisplay.bind(this)
        this.deleteStory = this.deleteStory.bind(this)
    }

    getStories() {
        axios.get('/api/getStories')
            .then(res => { this.setState({ stories: [{ title: '+' }, ...res.data.stories], storyNum: res.data.count[0].count }) })
    }
    toggleMenu() {
        this.setState(previousState => { return { menuToggle: !previousState.menuToggle } })
    }
    toggleSub() {
        this.setState({ subToggle: !this.state.subToggle })
    }
    subMenuDisplay(title) {
        // let left = this.state.titles[0]
        // let top = this.state.titles[1]

        if (this.state.subToggle) {
            return (
                <div className={this.state.subToggle ? 'open sub' : 'sub'}>
                    <button className='subBtn' onClick={() => this.props.history.push(`/characters/${this.state.storyid}/${title}`)}>Character</button>
                    <button className='subBtn' onClick={() => this.deleteStory(this.state.storyid)}>Delete</button>
                    {/* <button onClick={() => this.renameStory(this.state.storyid)}>Rename</button> */}
                </div>
            )
        } else { return null }
    }
    deleteStory(storyid) {
        axios.delete(`/api/deleteStory/${storyid}`)
            .then(() => this.getStories())
    }


    render(){
        let deg = 360/this.props.storyNum
        let origin = 0

        let menu = this.props.stories.map(ea => {
            if(this.state.menuToggle){
                origin += deg
                return(
                    <div>
                    <button className='radMenuBtn' onClick={this.toggleSub} style={{height: '200px', position: 'absolute', transform: `rotate(${origin}deg)`, transformOrigin: '0 100%'}}>{ea.title}</button>
                    {this.state.subToggle ? this.subMenuDisplay() : null}
                    </div>
                )
            }else{
                return null
            }
        })
        return(
            <div className='circular-menu'>
                <button onClick={this.toggleMenu} style={{top: '50%', left: '50%'}}>My Stories</button>
                {menu}
            </div>
        )
    }
} 



