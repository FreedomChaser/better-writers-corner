import React, { Component } from 'react'
import axios from 'axios'

export default class Modal extends Component {
    constructor(props) {
        super(props)
        //pass in storyid treeid through props
        this.state = {
            titleInput: '',
            summaryInput: ''
        }
        this.checkSummary = this.checkSummary.bind(this)
        this.createPlotCard = this.createPlotCard.bind(this)
    }
    
    checkSummary(val){
        let str = val.length
        if(str > 700){
            alert('Summary exceeds max character length of 700')
        }else{
            this.setState({summaryInput: val})
        }
    }
    //needs to render with new item
    createPlotCard(){
        let {treeid} = this.props
        let {titleInput, summaryInput} = this.state
        axios.post(`/api/createPlotCard/${treeid}`, {titleInput, summaryInput})
        .then(() => {
            this.props.toggleModal()
            // this.props.tree1Map()
        })
    }
    render() {
        console.log(this.props.treeid)
        return (
            <div>
                {this.props.toggle ? <div>
                    {/* <!-- The Modal --> */}
                    < div id="myModal" className="modal">

                        {/* <!-- Modal content --> */}
                        <div className="modal-content">
                            <div className='plotModal'>
                                <span className="close" onClick={this.props.toggleModal}>&times;</span>
                                <p>Card Title</p>
                                <input className='plotInput' onChange={e => {this.setState({titleInput: e.target.value})}}></input>
                                <p>Card Summary</p>
                                <textarea className='plotText' placeholder='Max character length of 700' rows='5' onChange={e => this.checkSummary(e.target.value)}></textarea>
                                <button className='plotBtns2' onClick={this.createPlotCard}>Save Plot Card</button>
                            </div>
                            </div>
                            </div>
                </div> : null}

            </div>
        )
    }

}