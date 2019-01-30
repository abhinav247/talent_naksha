import {BEGIN_AJAX_CALL, END_AJAX_CALL} from './actionTypes';

export function beginAjaxCall() {

    return {type: BEGIN_AJAX_CALL};

}

export function endAjaxCall() {

    return {type: END_AJAX_CALL};

}