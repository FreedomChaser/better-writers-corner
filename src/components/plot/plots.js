//three arrays each with it's own tree id 
//DONE selector box in all three divs that populates all the plot tree titles
//box conditionally renders based on how many plots there are
//and defaults to second third or first id respectively
//use if statements
//model to add cards to individual trees
//each box needs title, cards, selector box, add plot model
//I'll need a modal component that renders info when clicked and has edit, delete, and finished features

//populate other two trees with tree 1 func
//build crud for trees decided against delete
//drag and drop for trees

//!!!!in delete story I need to add a call to delete plots!!!
//!!!toggle fix

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
            start: null,
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
        this.dragStart = this.dragStart.bind(this)
        this.drop1 = this.drop1.bind(this)
        this.drop2 = this.drop2.bind(this)
        this.drop3 = this.drop3.bind(this)
        this.dragOver = this.dragOver.bind(this)
        this.createOrder1 = this.createOrder1.bind(this)
        this.createOrder2 = this.createOrder2.bind(this)
        this.createOrder3 = this.createOrder3.bind(this)
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
            this.setState({ treeToggle: !this.state.treeToggle, currentTree: '' }, this.tree1Map)
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
            this.setState({tree1: [], titles: res.data, tree1Title: res.data[0].title}, this.toggleTree())})
    }
    updateTree(treeid){
        let storyid = this.props.match.params.storyid
        let {treeInput} = this.state

        axios.put(`/api/updateTree/${storyid}/${treeid}`, {treeInput})
        .then((res) => {
            this.setState({tree1: [], titles: res.data.titles, tree1Title: res.data.updatedTree[0].title}, this.toggleTree())})
    }
    dragStart(e, i){
        this.setState({start:i})
        // console.log('start',this.state.start)
    }
    dragOver(e){
        // console.log(e)
        e.preventDefault()
    }
    //create a function that takes in an arr and orders it by id and invoke it as part of set state
    async createOrder1(){
        let orderedTree = await this.state.tree1.map((e, i) => {
            return {plotid: e.plotid, plot_order: i}
        })
        let orderSubmit = await axios.put('/api/setOrder', {orderedTree})

        // console.log(orderSubmit)
    }
    async createOrder2(){
        let orderedTree = await this.state.tree2.map((e, i) => {
            return {plotid: e.plotid, plot_order: i}
        })
        let orderSubmit = await axios.put('/api/setOrder', {orderedTree})

        // console.log(orderSubmit)
    }
    async createOrder3(){
        let orderedTree = await this.state.tree3.map((e, i) => {
            return {plotid: e.plotid, plot_order: i}
        })
        let orderSubmit = await axios.put('/api/setOrder', {orderedTree})

        // console.log(orderSubmit)
    }
    drop1(e, i){
       let tree1Copy = this.state.tree1.slice()
       let moving = tree1Copy.splice(this.state.start, 1)[0]
       tree1Copy.splice(i, 0, moving)
       //!!!!!can't invoke in this callback
       this.setState({tree1: tree1Copy}, this.createOrder1) 
    }
    drop2(e, i){
       let tree2Copy = this.state.tree2.slice()
       let moving = tree2Copy.splice(this.state.start, 1)[0]
       tree2Copy.splice(i, 0, moving)
       this.setState({tree2: tree2Copy}, this.createOrder2) 
    }
    drop3(e, i){
       let tree3Copy = this.state.tree3.slice()
       let moving = tree3Copy.splice(this.state.start, 1)[0]
       tree3Copy.splice(i, 0, moving)
       this.setState({tree3: tree3Copy}, this.createOrder3) 
    }
    titleMap() {
        let titles = this.state.titles.map((e) => {
            return (
                <option value={e.treeid}>{e.title}</option>
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
        if (this.state.tree1[0]) {
        return this.state.tree1.map((e, i) => {
            // no plot yet not displaying
                return (
                    // !!!!build drag n drop functions!!!!!!!
                    <div 
                        className='plotCard'  
                        key={i} 
                        draggable
                        onDragStart={e => this.dragStart(e, i)}
                        onDragOver={this.dragOver}
                        onDrop={e => this.drop1(e,i)}>
                        {/* plot order and done bool which will be accross from each other */}
                        {this.state.editToggleTitle && this.state.currentTitle === e.title ?
                            <div>
                                <input className='plotInput' placeholder='New Title' onChange={(e) => this.setState({ titleInput: e.target.value })}></input>
                                {/* axios put that takes in treeid and plotid call that rerenders page and resets editToggle title to false */}
                                <div>
                                    <button className='plotBtns' onClick={() => this.editPlotCardTitle(e.treeid, e.plotid)}>Save Changes</button>
                                    <button className='plotBtns' onClick={this.toggleEditTitle}>Cancel</button>
                                </div>
                            </div>
                            : <h2 className='titleH2' onClick={() => this.toggleEditTitle(e.title)}>{e.title}</h2>}

                        {this.state.editToggleSum && this.state.currentSum === e.summary ?
                            <div>
                                <textarea className='plotText' placeholder='New Summary' onChange={(e) => this.setState({ summaryInput: e.target.value })}></textarea>
                                <div>
                                    <button className='plotBtns' onClick={() => this.editPlotCardSum(e.treeid, e.plotid)}>Save Changes</button>
                                    <button className='plotBtns' onClick={this.toggleEditSum}>Cancel</button>
                                </div>
                            </div>
                            : <p className='sumamryPara' onClick={() => this.toggleEditSum(e.summary)}>{e.summary}</p>}
                        <div>
                            {/* a function that takes in e.plotid and e.treeid */}
                            <button className='plotBtns' onClick={() => this.deletePlotCard(e.treeid, e.plotid)}>Delete Card</button>
                        </div>
                    </div>
                )
            })
        } else {
            return (
                <p>No plots yet</p>
            )

        }
        }
    tree2Map() {
        if (this.state.tree2[0]) {
        return this.state.tree2.map((e, i) => {
            // no plot yet not displaying
                return (
                    <div 
                    className='plotCard'
                    key={i} 
                        draggable
                        onDragStart={e => this.dragStart(e, i)}
                        onDragOver={this.dragOver}
                        onDrop={e => this.drop2(e,i)}>
                        {/* plot order and done bool which will be accross from each other */}
                        {this.state.editToggleTitle && this.state.currentTitle === e.title ?
                            <div>
                                <input className='plotInput' placeholder='New Title' onChange={(e) => this.setState({ titleInput: e.target.value })}></input>
                                {/* axios put that takes in treeid and plotid call that rerenders page and resets editToggle title to false */}
                                <div>
                                    <button className='plotBtns' onClick={() => this.editPlotCardTitle(e.treeid, e.plotid)}>Save Changes</button>
                                    <button className='plotBtns' onClick={this.toggleEditTitle}>Cancel</button>
                                </div>
                            </div>
                            : <h2 className='titleH2' onClick={() => this.toggleEditTitle(e.title)}>{e.title}</h2>}

                        {this.state.editToggleSum && this.state.currentSum === e.summary ?
                            <div>
                                <textarea className='plotText' placeholder='New Summary' onChange={(e) => this.setState({ summaryInput: e.target.value })}></textarea>
                                <div>
                                    <button className='plotBtns' onClick={() => this.editPlotCardSum(e.treeid, e.plotid)}>Save Changes</button>
                                    <button className='plotBtns' onClick={this.toggleEditSum}>Cancel</button>
                                </div>
                            </div>
                            : <p className='sumamryPara' onClick={() => this.toggleEditSum(e.summary)}>{e.summary}</p>}
                        <div>
                            {/* a function that takes in e.plotid and e.treeid */}
                            <button className='plotBtns' onClick={() => this.deletePlotCard(e.treeid, e.plotid)}>Delete Card</button>
                        </div>
                    </div>
                )
            })
        } else {
            return (
                <p>No plots yet</p>
            )

        }
        }
    tree3Map() {
        if (this.state.tree3[0]) {
        return this.state.tree3.map((e, i) => {
            // no plot yet not displaying
                return (
                    <div 
                    className='plotCard'
                    key={i} 
                        draggable
                        onDragStart={e => this.dragStart(e, i)}
                        onDragOver={this.dragOver}
                        onDrop={e => this.drop3(e,i)}>
                        {/* plot order and done bool which will be accross from each other */}
                        {this.state.editToggleTitle && this.state.currentTitle === e.title ?
                            <div>
                                <input className='plotInput' placeholder='New Title' onChange={(e) => this.setState({ titleInput: e.target.value })}></input>
                                {/* axios put that takes in treeid and plotid call that rerenders page and resets editToggle title to false */}
                                <div>
                                    <button className='plotBtns' onClick={() => this.editPlotCardTitle(e.treeid, e.plotid)}>Save Changes</button>
                                    <button className='plotBtns' onClick={this.toggleEditTitle}>Cancel</button>
                                </div>
                            </div>
                            : <h2 className='titleH2' onClick={() => this.toggleEditTitle(e.title)}>{e.title}</h2>}

                        {this.state.editToggleSum && this.state.currentSum === e.summary ?
                            <div>
                                <textarea className='plotText' placeholder='New Summary' onChange={(e) => this.setState({ summaryInput: e.target.value })}></textarea>
                                <div>
                                    <button className='plotBtns' onClick={() => this.editPlotCardSum(e.treeid, e.plotid)}>Save Changes</button>
                                    <button className='plotBtns' onClick={this.toggleEditSum}>Cancel</button>
                                </div>
                            </div>
                            : <p className='sumamryPara' onClick={() => this.toggleEditSum(e.summary)}>{e.summary}</p>}
                        <div>
                            {/* a function that takes in e.plotid and e.treeid */}
                            <button className='plotBtns' onClick={() => this.deletePlotCard(e.treeid, e.plotid)}>Delete Card</button>
                        </div>
                    </div>
                )
            })
        } else {
            return (
                <p>No plots yet</p>
            )

        }
        }
    // tree2Map() {
    //     return this.state.tree2.map(e => {
    //         // if(tree[1])
    //         return (
    //             <div>
    //                 {/* plot order and done bool which will be accross from each other */}
    //                 <h2>{e.title}</h2>
    //                 <p>{e.summary}</p>
    //             </div>
    //         )
    //     })
    // }
    // tree3Map() {
    //     return this.state.tree3.map(e => {
    //         return (
    //             <div>
    //                 {/* plot order and done bool which will be accross from each other */}
    //                 <h2>{e.title}</h2>
    //                 <p>{e.summary}</p>
    //             </div>
    //         )
    //     })
    // }
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
        let {title} = this.props.match.params
        return (
            <div className='plotsBod'>
                {/* each tree will have a selector box with all the tree titles */}
                <div className='plotsHead'>
                    <h1 className='plotH1'>{title}</h1>
                        <button className='plotBtns' onClick={() => this.toggleTree()}>Add Plot Tree</button>
                        {this.state.treeToggle && this.state.currentTree === '' ? 
                            <div>
                            <input className='plotInput' placeholder='New Tree Title' onChange={(e) => this.setState({treeInput: e.target.value})}></input>
                            <button className='plotBtns' onClick={this.createTree}>Create Tree</button>
                            <button className='plotBtns' onClick={this.toggleTree}>Cancel</button>
                            </div>

                            :null}
                </div>
                <div className='treefull'>
                <div className='treeparts'>
                {this.state.treeToggle && this.state.currentTree === this.state.tree1Title ?
                            <div>
                                <input className='plotInput' placeholder='New Tree Title' onChange={(e) => this.setState({ treeInput: e.target.value })}></input>
                                {/* axios put that takes in treeid and plotid call that rerenders page and resets editToggle title to false */}
                                <div>
                                    <button className='plotBtns' onClick={() => this.updateTree(this.state.tree1id)}>Save Changes</button>
                                    <button className='plotBtns' onClick={() => this.toggleTree()}>Cancel</button>
                                </div>
                            </div>
                        :<h2 className='treeH2' onClick={() => this.toggleTree(this.state.tree1Title)}>{this.state.tree1Title}</h2>}
                    {/* <div> */}
                        {/* add a funtionality for new plot tree it will automatically replace tree 1 in view */}
                        {/* make sure an alert is sounded that confirms deletion */}
                        {/* <button>Delete Plot Tree</button> */}
                    {/* </div> */}
                    <div>
                        <select className='plotSelect' onChange={e => { this.changeTree1(e.target.value) }}>
                            <option value='null'>Select Plot Tree </option>
                            {this.titleMap()}
                        </select>
                    </div>
                    {/* this button will fire a modal that will take needed input and do axios call separate component: plotModal */}
                    <button className='plotBtns' onClick={this.toggleModal}>Add Plot Card</button>
                    <div >
                    {this.tree1Map()}
                    <Modal toggleModal={this.toggleModal} toggle={this.state.modalToggle} treeid={this.state.tree1id} tree1Map={this.tree1Map} />
                    </div>
                    {/* add a delete tree function nevermind */}
                </div>
                <div className='treeparts'>
                {this.state.treeToggle && this.state.currentTree === this.state.tree2Title ?
                            <div>
                                <input className='plotInput' placeholder='New Tree Title' onChange={(e) => this.setState({ treeInput: e.target.value })}></input>
                                {/* axios put that takes in treeid and plotid call that rerenders page and resets editToggle title to false */}
                                <div>
                                    <button className='plotBtns' onClick={() => this.updateTree(this.state.tree2id)}>Save Changes</button>
                                    <button className='plotBtns' onClick={() => this.toggleTree()}>Cancel</button>
                                </div>
                            </div>
                        :<h2 className='treeH2' onClick={() => this.toggleTree(this.state.tree2Title)}>{this.state.tree2Title}</h2>}
                    {/* <div> */}
                        {/* add a funtionality for new plot tree it will automatically replace tree 1 in view */}
                        {/* make sure an alert is sounded that confirms deletion */}
                        {/* <button>Delete Plot Tree</button> */}
                    {/* </div> */}
                    <div>
                        <select className='plotSelect' onChange={e => { this.changeTree2(e.target.value) }}>
                            <option value='null'>Select Plot Tree </option>
                            {this.titleMap()}
                        </select>
                    </div>
                    {/* this button will fire a modal that will take needed input and do axios call separate component: plotModal */}
                    <button className='plotBtns' onClick={this.toggleModal}>Add Plot Card</button>
                    <div >
                    {this.tree2Map()}
                    <Modal toggleModal={this.toggleModal} toggle={this.state.modalToggle} treeid={this.state.tree2id} tree1Map={this.tree2Map} />
                    </div>
                    {/* add a delete tree function nevermind */}
                </div>

                    {/* <div>
                        <h1>{this.state.tree2Title}</h1>
                        <select onChange={e => { this.changeTree2(e.target.value) }}>
                            <option value='null'>Select Plot Tree </option>
                            {this.titleMap()}
                        </select>
                        {this.tree2Map()}
                    </div>
                </div> */}
                <div className='treeparts'>
                {this.state.treeToggle && this.state.currentTree === this.state.tree3Title ?
                            <div>
                                <input className='plotInput' placeholder='New Tree Title' onChange={(e) => this.setState({ treeInput: e.target.value })}></input>
                                {/* axios put that takes in treeid and plotid call that rerenders page and resets editToggle title to false */}
                                <div>
                                    <button className='plotBtns' onClick={() => this.updateTree(this.state.tree3id)}>Save Changes</button>
                                    <button className='plotBtns' onClick={() => this.toggleTree()}>Cancel</button>
                                </div>
                            </div>
                        :<h2 className='treeH2' onClick={() => this.toggleTree(this.state.tree3Title)}>{this.state.tree3Title}</h2>}
                    {/* <div> */}
                        {/* add a funtionality for new plot tree it will automatically replace tree 1 in view */}
                        {/* make sure an alert is sounded that confirms deletion */}
                        {/* <button>Delete Plot Tree</button> */}
                    {/* </div> */}
                    <div>
                        <select className='plotSelect' onChange={e => { this.changeTree3(e.target.value) }}>
                            <option value='null'>Select Plot Tree </option>
                            {this.titleMap()}
                        </select>
                    </div>
                    {/* this button will fire a modal that will take needed input and do axios call separate component: plotModal */}
                    <button className='plotBtns' onClick={this.toggleModal}>Add Plot Card</button>
                    <div >
                    {this.tree3Map()}
                    <Modal toggleModal={this.toggleModal} toggle={this.state.modalToggle} treeid={this.state.tree3id} tree1Map={this.tree3Map} />
                    </div>
                    {/* add a delete tree function nevermind */}
                </div>
                </div>
                {/* <div>
                    <h1>{this.state.tree3Title}</h1>
                    <select onChange={e => { this.changeTree3(e.target.value) }}>
                        <option value='null'>Select Plot Tree </option>
                        {this.titleMap()}
                    </select>
                    {this.tree3Map()}
                </div>
            </div>
        </div>
        </div> */}
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
