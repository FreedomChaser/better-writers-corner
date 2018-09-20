const initialState = {
    userid: 0,
    first_name: '',
    last_name: '',
    gender: '',
    hair_color: '',
    eye_color: '',
    hobby: '',
}

const UPDATE_USERID = 'UPDATE_USERID'
const UPDATE_FIRST_NAME = 'UPDATE_FIRST_NAME'
const UPDATE_LAST_NAME = 'UPDATE_LAST_NAME'
const UPDATE_GENDER = 'UPDATE_GENDER'
const UPDATE_HAIR_COLOR = 'UPDATE_HAIR_COLOR'
const UPDATE_EYE_COLOR = 'UPDATE_EYE_COLOR'
const UPDATE_HOBBY = 'UPDATE_HOBBY'

export function updateUserid(userid){
    return{
        type: UPDATE_USERID,
        payload: userid
    }
}
export function updateFirstName(first_name){
    return{
        type: UPDATE_FIRST_NAME,
        payload: first_name
    }
}
export function updateLastName(last_name){
    return{
        type: UPDATE_LAST_NAME,
        payload: last_name
    }
}
export function updateGender(gender){
   return{
       type: UPDATE_GENDER,
       payload: gender
   }
}
export function updateHairColor(hair_color){
   return{
       type: UPDATE_HAIR_COLOR,
       payload: hair_color
   }
}
export function updateEyeColor(eye_color){
   return{
       type: UPDATE_EYE_COLOR,
       payload: eye_color
   }
}
export function updateHobby(hobby){
   return{
       type: UPDATE_HOBBY,
       payload: hobby
   }
}

function reducer(state = initialState, action){
    switch(action.type){
        case UPDATE_USERID:
            return Object.assign({}, state, {userid: action.payload})
        
        case UPDATE_FIRST_NAME:
            return Object.assign({}, state, {first_name: action.payload})
            
        case UPDATE_LAST_NAME:
            return Object.assign({}, state, {last_name: action.payload})

        case UPDATE_GENDER:
            return Object.assign({}, state, {gender: action.payload})

        case UPDATE_HAIR_COLOR:
            return Object.assign({}, state, {hair_color: action.payload})

        case UPDATE_EYE_COLOR:
            return Object.assign({}, state, {eye_color: action.payload})

        case UPDATE_HOBBY:
            return Object.assign({}, state, {hobby: action.payload})

        default: return state
    }
}

export default reducer