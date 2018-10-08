//for add story always render a menu button with a plus sign, when the plus sign is clicked a modal pops up with a title input and an add/purchase story button
//add/purchase story renders condtionally based on whether story count is <= 2 after purchasing with strip the story button will appear and site will run as usual

//button with stripe fix add customer
// login api
//chara popup

//PROBLEMS
//!!!onClick submenu stays
import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUserid } from '../ducks/reducer'
import StripeCheckout from 'react-stripe-checkout'
// import RadialTest from './radialTest'
import { relative } from 'path';

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stories: [{ title: '+' }],
      modalInput: '',
      modalToggle: false,
      storyNum: 1,
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
    this.buyStory = this.buyStory.bind(this)
  }
  componentDidMount() {
    if (!this.props.userid) {
      axios.get('/api/userData')
        .then((res) => {
          this.props.updateUserid()
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
      .then(res => { 
        this.setState({ stories: [{ title: '+' }, ...res.data.stories], storyNum: res.data.count[0].count }) 
      })
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
  // subClick(){
  //     this.toggleSub()
  //     this.subMenuVals()
  // }

    addClick() {
        this.addStory()
        this.toggleModal()
    }
    //just do an axios then rerender stories
    addStory() {
        axios.post('/api/addStory', { title: this.state.modalInput })
            .then(() => this.getStories())
    }
    //add in stripe functionality and then run the axios call and rerender stories
    buyStory = (token) => {
        fetch('/save-stripe-token', {
            method: 'POST',
            body: JSON.stringify(token),
        }).then(() => {this.addStory()})
     }

     deleteStory(storyid) {
      axios.delete(`/api/deleteStory/${storyid}`)
          .then(() => this.getStories())
  }

  // renameStory(storyid){}

  subMenuVals(storyid) {
      // let newTitle = this.state.titles
      // newTitle[title] = [left, top]
      this.setState({storyid: storyid })
  }
  subMenuDisplay(title, origin) {
    console.log('submenu display method firing')
    // let left = this.state.titles[0]
    // let top = this.state.titles[1]

    if (this.state.subToggle) {
      return (
        <div className='homeSubBtns'>
          <button className='subBtn' onClick={() => this.props.history.push(`/characters/${this.state.storyid}/${title}`)}>Character</button>
          <button className='subBtn' onClick={() => this.props.history.push(`/plots/${this.state.storyid}/${title}`)}>Plots</button>
          <button className='subBtn' onClick={() => this.deleteStory(this.state.storyid)}>Delete</button>
        </div>
      )
    } else { return null }
  }


  render() {
    // console.log(process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE )
    // let menu = this.state.stories.map((e, i) => {
    //     let l = this.state.stories.length
    //     let top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
    //     let left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
    //     return (
    //         // classname = on click for circle and open
    //         <div key={i} className={this.state.menuToggle ? 'open circle' : 'circle'} style={this.state.menuToggle ? { left, top } : {}}>
    //             {e.title != '+' ?
    //                 //onClick for sub menues                        
    //                 <button className='radMenuBtn' onClick={() => {
    //                     this.toggleSub()
    //                     this.subMenuVals(e.storyid)
    //                 }}>{e.title}</button>
    //                 //on click for add story model
    //                 : <button id="radMenuBtn" onClick={this.toggleModal}>{e.title}</button>
    //             }
    //             {this.state.storyid === e.storyid ? this.subMenuDisplay(e.title) : null}
    //         </div>
    //     )
    // })

    let deg = 360 / (1 + Number(this.state.storyNum))
    let origin = 0 - deg
    console.log(this.state.stories)
    // console.log(this.state.storyNum)
    // console.log({deg, origin})
    let menu = this.state.stories.map(ea => {
      //     console.log({ea})
      if (this.state.menuToggle) {
        origin += deg
        // console.log(origin)
        return (
          <div className='rotation-container'
            style={{ 
              transform: `rotate(${origin}deg)`
            }}
            >
            {ea.title != '+' ?
              //onClick for sub menues 
              <button className='radMenuBtn' onClick={() => {
                this.toggleSub()
                this.subMenuVals(ea.storyid)
              }} 
              >{ea.title}</button>
              //on click for add story model
              : <button className="radMenuBtn" onClick={this.toggleModal} >{ea.title}</button>}


            {this.state.storyid === ea.storyid ? this.subMenuDisplay(ea.title, origin) : null}
          </div>
        )
      } else {
        return null
      }
    })

    //         console.log('menu toggle', this.state.menuToggle)
    //         console.log('submenu toggle', this.state.subToggle);
    //         origin += deg
    //         return(
    //             <div>
    //                 {/* ea.title != '+' ? */}
    //             <button className='radMenuBtn' onClick={this.toggleSub} style={{height: '200px', position: 'absolute', transform: `rotate(${origin}deg)`, transformOrigin: '0 100%'}}>{ea.title}</button>
    //             {this.state.subToggle ? this.subMenuDisplay() : null}
    //             </div>
    //         )
    //     }else{
    //         return null
    //     }
    // })
    console.log(this.state.storyNum[0])
    return (
      <div>

        <div className='homeMenu'>
          <div className='radBtns'>
            <button className='radialMenu' onClick={this.menuClick}>My Stories</button>
            {/* <RadialTest stories={this.state.stories} storyNum={this.state.storyNum}/> */}
            {menu}
          </div>
        </div>

        {this.state.modalToggle ?
          <div>
            {/* <!-- The Modal --> */}
            < div id="myModal" className="modal">

              {/* <!-- Modal content --> */}
              <div className="modal-content">
                <div>
                  <span className="close" onClick={this.toggleModal}>&times;</span>
                  <p>What would you like to call your story?</p>
                </div>
                <input className='modelInput' onChange={(e) => { this.setState({ modalInput: e.target.value }) }}></input>
                {/* button that conditionally renders based on number of stories */}
                <div className='modelBtns'>
                  {Number(this.state.storyNum[0]) <= 2 ? <button className='addStoryBtn' onClick={this.addClick}>Add story</button> : <StripeCheckout
                    name='WritersCorner'
                    //add image
                    token={this.buyStory}
                    stripeKey={process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE}
                    amount='100'
                    closed={this.toggleModal}
                  />}
                  {/* // <button>Buy Story ($1.00)</button>} */}
                  <button className='addStoryBtn' onClick={this.toggleModal}>Cancel</button>
                </div>
                <sub>*The first three story boards are free, but if you find Writers Corner helpful you can purchase additional story boards for just $1.00.</sub>
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