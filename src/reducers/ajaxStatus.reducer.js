import {BEGIN_AJAX_CALL, END_AJAX_CALL} from '../actions/actionTypes';


export default function ajaxStatus(state = 0, action/*, isShowLoadTime*/) {

    if (action.type === BEGIN_AJAX_CALL) {
        return state + 1;
    } else if (action.type === END_AJAX_CALL && state > 0) {
        return state - 1;
    }
    return state;
}
