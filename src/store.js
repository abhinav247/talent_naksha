// import { createStore, applyMiddleware, compose } from 'redux';
// // import thunk from 'react-thunk';
// import thunkMiddleware from 'redux-thunk';
// import rootReducer from './reducers';


// export default createStore(
//   rootReducer,
//   compose(
//     applyMiddleware(thunkMiddleware),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   )
// );


import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers';




function configureStore() {
  if (process.env.NODE_ENV === "production") {
      return createStore(
          rootReducer,
          applyMiddleware(thunkMiddleware)
      );
  }
  else {
      const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
      return createStore(
          rootReducer,
          composeEnhancers(
              applyMiddleware(thunkMiddleware)
          )
      );
  }
}

export default configureStore();