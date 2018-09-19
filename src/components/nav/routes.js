import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Characters from '../character/characters'
import Home from '../home/home'
import Login from '../login/login'
// import characterForm from '../components/character/CharaForm'

export default function Nav(){
    return(
        <div>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route path='/home' component={Home}/>
                <Route path='/characters' component={Characters}/>
                {/* <Route path='/' component={}/> */}
            </Switch>
        </div>
    )
}