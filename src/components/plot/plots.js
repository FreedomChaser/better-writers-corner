//three arrays each with it's own tree id 
//DONE selector box in all three divs that populates all the plot tree titles
//box conditionally renders based on how many plots there are
//and defaults to second third or first id respectively
//use if statements
//model to add cards to individual trees
//each box needs title, cards, selector box, add plot model
//I'll need a modal component that renders info when clicked and has edit, delete, and finished features

//populate other two trees with tree 1 func
//build crud for trees
//drag and drop for trees

//!!!!in delete story I need to add a call to delete plots!!!

import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUserid } from '../ducks/reducer'
import Modal from './plotModal'

class Plots extends Component {
    constructor() {
        super()

        this.state = {
            titles: [],
            tree1: [],
            tree2: [],
            tree3: [],
            tree1id: 0,
            tree2id: 0,
            tree3id: 0,
            tree1Title: '',
            tree2Title: '',
            tree3Title: '',
            modalToggle: false,
            editToggleTitle: false,
            currentTitle: '',
            editToggleSum: false,
            currentSum: '',
            titleInput: '',
            summaryInput: '',
            treeInput: '',
            treeToggle: false,
            currentTree: '',
        }
        this.toggleModal = this.toggleModal.bind(this)
        this.getContent = this.getContent.bind(this)
        this.titleMap = this.titleMap.bind(this)
        this.changeTree1 = this.changeTree1.bind(this)
        this.changeTree2 = this.changeTree2.bind(this)
        this.changeTree3 = this.changeTree3.bind(this)
        this.tree1Map = this.tree1Map.bind(this)
        this.tree2Map = this.tree2Map.bind(this)
        this.tree3Map = this.tree3Map.bind(this)
        this.threeTreesMap = this.threeTreesMap.bind(this)
        this.toggleEditTitle = this.toggleEditTitle.bind(this)
        this.toggleEditSum = this.toggleEditSum.bind(this)
        this.toggleTree = this.toggleTree.bind(this)
        this.createTree = this.createTree.bind(this)
    }

    componentDidMount() {
        if (!this.props.userid) {
            axios.get('api/userData')
                .then(res => {
                    this.props.updateUserid()
                    this.getContent()
                })
                .catch(err => {
                    this.props.history.push('/')
                })
        } else {
            this.getContent()
        }
    }

    getContent() {
        let storyid = this.props.match.params.storyid
        //axios call for titles and three default tree arrays
        axios.get(`/api/getPlotContent/${storyid}`)
            .then(res => {
                console.log(res)
                this.setState({ titles: res.data.titles, tree1: res.data.tree1, tree2: res.data.tree2, tree3: res.data.tree3, tree1id: res.data.titles[0].treeid, tree2id: res.data.titles[1].treeid, tree3id: res.data.titles[2].treeid, tree1Title: res.data.titles[0].title, tree2Title: res.data.titles[1].title, tree3Title: res.data.titles[2].title }, this.threeTreesMap)
            })
    }
    toggleModal() {
        this.setState({ modalToggle: !this.state.modalToggle }, this.getContent)
    }
    toggleEditTitle(title) {
        if (title) {
            this.setState({ editToggleTitle: !this.state.editToggleTitle, currentTitle: title }, this.getContent)
        } else {
            this.setState({ editToggleTitle: !this.state.editToggleTitle, currentTitle: '' }, this.getContent)
        }
    }
    toggleEditSum(sum) {
        if (sum) {
            this.setState({ editToggleSum: !this.state.editToggleSum, currentSum: sum }, this.getContent)
        } else {
            this.setState({ editToggleSum: !this.state.editToggleSum, currentSum: '' }, this.getContent)
        }
    }
    toggleTree(tree) {
        if (tree) {
            this.setState({ treeToggle: !this.state.treeToggle, currentTree: tree }, this.tree1Map)
        } else {
            this.setState({ editToggleSum: !this.state.editToggleSum, currentSum: '' }, this.tree1Map)
        }
    }
    deletePlotCard(treeid, plotid) {
        axios.delete(`/api/deletePlotCard/${treeid}/${plotid}`)
            .then(() => this.getContent())
    }
    editPlotCardTitle(treeid, plotid) {
        let { titleInput } = this.state
        axios.put(`/api/editPlotCardTitle/${treeid}/${plotid}`, { titleInput })
            .then(() => this.toggleEditTitle())
    }
    editPlotCardSum(treeid, plotid) {
        let { summaryInput } = this.state
        axios.put(`/api/editPlotCardSum/${treeid}/${plotid}`, { summaryInput })
            .then(() => this.toggleEditSum())
    }

    createTree(){
        let storyid = this.props.match.params.storyid
        let {treeInput} = this.state
        axios.post(`/api/createTree/${storyid}`, {treeInput})
        //set titles for selector and set tree title
        .then((res) => {
            console.log(res)
            this.setState({tree1: []}, this.toggleTree)})
    }

    titleMap() {
        let titles = this.state.titles.map((e) => {
            return (
                <option value={`${e.treeid}`}>{e.title}</option>
            )
        })

        return titles
    }
    //functions to map trees 1,2,3 by default
    threeTreesMap() {
        this.tree1Map()
        this.tree2Map()
        this.tree3Map()
    }
    tree1Map() {
        return this.state.tree1.map(e => {
            if (this.state.tree1[0]) {
                return (
                    <div>
                        {/* plot order and done bool which will be accross from each other */}
                        {this.state.editToggleTitle && this.state.currentTitle === e.title ?
                            <div>
                                <input placeholder='New Title' onChange={(e) => this.setState({ titleInput: e.target.value })}></input>
                                {/* axios put that takes in treeid and plotid call that rerenders page and resets editToggle title to false */}
                                <div>
                                    <button onClick={() => this.editPlotCardTitle(e.treeid, e.plotid)}>Save Changes</button>
                                    <button onClick={this.toggleEditTitle}>Cancel</button>
                                </div>
                            </div>
                            : <h2 onClick={() => this.toggleEditTitle(e.title)}>{e.title}</h2>}

                        {this.state.editToggleSum && this.state.currentSum === e.summary ?
                            <div>
                                <textarea placeholder='New Summary' onChange={(e) => this.setState({ summaryInput: e.target.value })}></textarea>
                                <div>
                                    <button onClick={() => this.editPlotCardSum(e.treeid, e.plotid)}>Save Changes</button>
                                    <button onClick={this.toggleEditSum}>Cancel</button>
                                </div>
                            </div>
                            : <p onClick={() => this.toggleEditSum(e.summary)}>{e.summary}</p>}
                        <div>
                            {/* a function that takes in e.plotid and e.treeid */}
                            <button onClick={() => this.deletePlotCard(e.treeid, e.plotid)}>Delete Card</button>
                        </div>
                    </div>
                )
            } else {
                return (
                    <p>No plots yet</p>
                )

            }
        })
    }
    tree2Map() {
        return this.state.tree2.map(e => {
            // if(tree[1])
            return (
                <div>
                    {/* plot order and done bool which will be accross from each other */}
                    <h2>{e.title}</h2>
                    <p>{e.summary}</p>
                </div>
            )
        })
    }
    tree3Map() {
        return this.state.tree3.map(e => {
            return (
                <div>
                    {/* plot order and done bool which will be accross from each other */}
                    <h2>{e.title}</h2>
                    <p>{e.summary}</p>
                </div>
            )
        })
    }
    changeTree1(id) {
        let storyid = this.props.match.params.storyid
        let title = this.state.titles.filter(e => {
            return Number(id) === e.treeid
        })
        this.setState({ tree1id: id, tree1Title: title[0].title })

        axios.get(`/api/tree/${id}/${storyid}`)
            .then(res => {
                this.setState({ tree1: res.data }, this.tree1Map)
            })
    }
    changeTree2(treeid) {
        let storyid = this.props.match.params.storyid

        this.setState({ tree2id: treeid })

        axios.get(`/api/tree/${treeid}/${storyid}`)
            .then(res => {
                this.setState({ tree2: res }, this.tree2Map)
            })
    }
    changeTree3(treeid) {
        let storyid = this.props.match.params.storyid

        this.setState({ tree3id: treeid })

        axios.get(`/api/tree/${treeid}/${storyid}`)
            .then(res => {
                this.setState({ tree3: res }, this.tree3Map)
            })
    }

    render() {
        // console.log(this.state.tree1)
        // console.log(this.titleMap())
        console.log(this.state.modalToggle)
        return (
            <div className='plotsBod'>
                {/* each of these will have a selector box */}
                        <button onClick={this.toggleTree}>Add Plot Tree</button>
                        {this.state.treeToggle ? 
                            <div>
                            <input placeholder='New Tree Title' onChange={(e) => this.setState({treeInput: e.target.value})}></input>
                            <button onClick={this.createTree}>Create Tree</button>
                            </div>

                            :null}
                <div>tree 1
                        <h1>{this.state.tree1Title}</h1>
                    <div>
                        {/* add a funtionality for new plot tree it will automatically replace tree 1 in view */}
                        {/* make sure an alert is sounded that confirms deletion */}
                        <button>Delete Plot Tree</button>
                    </div>
                    <div>
                        <select onChange={e => { this.changeTree1(e.target.value) }}>
                            <option value='null'>Select Plot Tree </option>
                            {this.titleMap()}
                        </select>
                    </div>
                    {this.tree1Map()}
                    {/* this button will fire a modal that will take needed input and do axios call separate component: plotModal */}
                    <button onClick={this.toggleModal}>Add Plot Card</button>
                    <Modal toggleModal={this.toggleModal} toggle={this.state.modalToggle} treeid={this.state.tree1id} tree1Map={this.tree1Map} />
                    {/* add a delete tree function */}
                </div>
                <div>tree 2
                    <div>
                        <h1>{this.state.tree2Title}</h1>
                        <select onChange={e => { this.changeTree2(e.target.value) }}>
                            <option value='null'>Select Plot Tree </option>
                            {this.titleMap()}
                        </select>
                        {this.tree2Map()}
                    </div>
                </div>
                <div>tree 3
                    <div>
                        <h1>{this.state.tree3Title}</h1>
                        <select onChange={e => { this.changeTree3(e.target.value) }}>
                            <option value='null'>Select Plot Tree </option>
                            {this.titleMap()}
                        </select>
                        {this.tree3Map()}
                    </div>
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

export default connect(mapStateToProps, { updateUserid })(Plots)
