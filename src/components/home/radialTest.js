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

    render(){
        let deg = 360/this.state.storyNum
        let origin = 0

        let menu = this.state.stories.map(ea => {
            if(this.state.menuToggle){
                origin += deg
                return(
                    <div>
                    <button onClick={this.toggleSub} style={{height: '200px', position: 'absolute', transform: `rotate(${origin}deg)`, transformOrigin: '0 100%'}}>{ea.title}</button>
                    {this.state.subToggle ? <button>Characters</button> : null}
                    </div>
                )
            }else{
                return null
            }
        })
        return(
            <div>
                <button onClick={this.toggleMenu} style={{top: '50%', left: '50%'}}>My Stories</button>
                {menu}
            </div>
        )
    }
} 



