import React from 'react'
import { AuthProvider } from './navigation/AuthProvider'
import Routes from './navigation/Routes'
import Toast from 'react-native-toast-message'
import { toastConfig } from './utils/Toast'
import store from './store'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import client from './apollo'

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ApolloProvider client={client}>
          <Routes />
          <Toast config={toastConfig} />
        </ApolloProvider>
      </AuthProvider>
    </Provider>
  )
}

export default App;