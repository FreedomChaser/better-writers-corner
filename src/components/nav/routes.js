import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Characters from '../character/characters'
import CharacterAddForm from '../character/characterAddForm'
import CharacterEditForm from '../character/characterEditForm'
import Home from '../home/home'
import Login from '../login/login'
// import characterForm from '../components/character/CharaForm'

export default function Nav(){
    return(
        <div>
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route path='/home' component={Home}/>
                <Route exact path='/characters/:storyid/:title' component={Characters}/>
                <Route path='/characters/:storyid/:title/characterAddForm' component={CharacterAddForm}/>
                <Route path='/characters/:storyid/:title/characterEditForm/:characterid' component={CharacterEditForm}/>
                {/* <Route path='/' component={}/> */}
            </Switch>
        </div>
    )
}