//three arrays each with it's own tree id 
//selector box in all three divs that populates all the plot tree titles
//box conditionally renders based on how many plots there are
//and defaults to second third or first id respectively
//use if statements
//model to add cards to individual trees
//each box needs title, cards, selector box, add plot model
//I'll need a modal component that renders info when clicked and has edit, delete, and finished features

import React, {Component} from 'react'
import axios from 'axios'

class Plots extends Component{
    constructor(){
        super()

        this.state = {
            titles: [],
            tree1: [],
            tree2: [],
            tree3: []
        }
    }

    render(){
        return(
            <div className='plotsBod'>plots</div>
        )
    }
}

export default Plots
