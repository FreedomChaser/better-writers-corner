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
import {connect} from 'react-redux'
import {updateUserid} from '../ducks/reducer'

class Plots extends Component{
    constructor(){
        super()

        this.state = {
            titles: [],
            tree1: [],
            tree2: [],
            tree3: []
        }
        this.getContent = this.getContent.bind(this)
        this.titleMap = this.titleMap.bind(this)
        this.changeTree1 = this.changeTree1.bind(this)
        this.changeTree2 = this.changeTree2.bind(this)
        this.changeTree3 = this.changeTree3.bind(this)
        this.tree1Map = this.tree1Map.bind(this)
        this.tree2Map = this.tree2Map.bind(this)
        this.tree3Map = this.tree3Map.bind(this)
        this.threeTreesMap = this.threeTreesMap.bind(this)
    }

    componentDidMount(){
        if(!this.props.userid){
            axios.get('api/userData')
            .then(res => {
                this.props.updateUserid()
                this.getContent()
            })
            .catch(err => {
                this.props.history.push('/')
            })
        }else{
            this.getContent()
        }
    }

    getContent(){
        let storyid = this.props.match.params.storyid
        //axios call for titles and three default tree arrays
        axios.get(`/api/getPlotContent/${storyid}`)
        .then(res => {
            console.log(res)
            this.setState({titles: res.data.titles, tree1: res.data.tree1, tree2: res.data.tree2, tree3: res.data.tree3}, this.threeTreesMap)
        })
    }
    titleMap(){
        console.log('fired')
        let titles = this.state.titles.map((e) => {
            return(
            <option value={`${e.treeid}`}>{e.title}</option>
            )
        })

        return titles
    }
    //functions to map trees 1,2,3 by default
    threeTreesMap(){
        this.tree1Map()
        this.tree2Map()
        this.tree3Map()
    }
    tree1Map(){
        return this.state.tree1.map( e => {
            return(
                <div>
                    {/* plot order and done bool which will be accross from each other */}
                    <h2>{e.title}</h2>
                    <p>{e.summary}</p>
                </div>
            )
        })
    }
    tree2Map(){
        return this.state.tree2.map( e => {
            return(
                <div>
                    {/* plot order and done bool which will be accross from each other */}
                    <h2>{e.title}</h2>
                    <p>{e.summary}</p>
                </div>
            )
        })
    }
    tree3Map(){
        return this.state.tree3.map( e => {
            return(
                <div>
                    {/* plot order and done bool which will be accross from each other */}
                    <h2>{e.title}</h2>
                    <p>{e.summary}</p>
                </div>
            )
        })
    }
    changeTree1(treeid){
        let storyid = this.props.match.params.storyid

        axios.get(`/api/tree/${treeid}/${storyid}`)
        .then(res => {
            this.setState({tree1: res}, this.tree1Map())
        })
    }
    changeTree2(treeid){
        let storyid = this.props.match.params.storyid

        axios.get(`/api/tree/${treeid}/${storyid}`)
        .then(res => {
            this.setState({tree2: res}, this.tree2Map())
        })
    }
    changeTree3(treeid){
        let storyid = this.props.match.params.storyid

        axios.get(`/api/tree/${treeid}/${storyid}`)
        .then(res => {
            this.setState({tree3: res}, this.tree3Map())
        })
    }

    render(){
        console.log(this.state.titles, this.state.tree1)
        console.log(this.titleMap())
        return(
            <div className='plotsBod'>
                {/* each of these will have a selector box */}
                <div>tree 1
                    <div>
                        {/* add title */}
                        <select onChange={e => {this.changeTree1(e.target.value)}}>
                            <option value='null'>Select Plot Tree </option>
                            {this.titleMap()}
                        </select>
                        {this.tree1Map()}
                    </div>
                </div>
                <div>tree 2
                    <div>
                        {/* add title */}
                        <select onChange={e => {this.changeTree2(e.target.value)}}>
                            <option value='null'>Select Plot Tree </option>
                            {this.titleMap()}
                        </select>
                        {this.tree2Map()}
                    </div>
                </div>
                <div>tree 3
                    <div>
                        {/* add title */}
                        <select onChange={e => {this.changeTree3(e.target.value)}}>
                            <option value='null'>Select Plot Tree </option>
                            {this.titleMap()}
                        </select>
                        {this.tree3Map()}
                    </div>
                </div>
                <div>tree 2</div>
                <div>tree 3</div>
            </div>
        )
    }
}

function mapStateToProps(reduxState){
    const {
        userid
    } = reduxState

    return {
        userid
    }
}

export default connect(mapStateToProps, {updateUserid}) (Plots)
