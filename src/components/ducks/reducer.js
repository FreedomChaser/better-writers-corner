const initialState = {
    userid: 0
}

const UPDATE_USERID = 'UPDATE_USERID'

export function updateUserid(userid){
    return{
        type: UPDATE_USERID,
        payload: userid
    }
}

function reducer(state = initialState, action){
    switch(action.type){
        case UPDATE_USERID:
            return Object.assign({}, state, {userid: action.payload})

        default: return state
    }
}

export default reducer