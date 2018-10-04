import React, {Component} from 'react'
import {Popout} from 'react-popout-component'

export default class plotPop extends Component{
    constructor(props){
        super(props)

        this.state = {
            titles: [],
            tree: []
        }
    }

    render(){
        return (
            <Popout>
                pop
            </Popout>
        )
    }
}