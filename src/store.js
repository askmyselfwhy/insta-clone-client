import createSagaMiddleware from 'redux-saga';
import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { rootReducer as modulesReducers, rootSaga } from './modules/index';

export default () => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  // Connect the saga to the redux store
  const sagaMiddleware = createSagaMiddleware({
    onError: () => {}
  });
  const middleware = [
    sagaMiddleware
  ];
  // Redux persist
  const store = createStore(modulesReducers, composeEnhancers(applyMiddleware(...middleware)));
  const persistor = persistStore(store);
  
  if (module.hot) {
    module.hot.accept('./modules/', () => {
      const nextRootReducer = require('./modules/index').rootReducer;
      store.replaceReducer(nextRootReducer);
    })
  }

  sagaMiddleware.run(rootSaga);
  return { store, persistor };
}