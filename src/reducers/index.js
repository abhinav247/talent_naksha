import { combineReducers } from 'redux';
import jobdetail from './jobTableReducer';
import ajaxStatus from './ajaxStatus.reducer';


export default combineReducers({
  jobdetail,
  ajaxStatus
});
