import React from 'react';
// import logo from './logo.svg';
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import './App.css';
import Header from './Components/Header';
import Repository from './Components/Repository';
import RepoList from './Components/RepoList';

const github_api_url = 'https://api.github.com/graphql';

const client = new ApolloClient({
  uri: github_api_url,
  headers: {
      "Content-Type":"application/json",
    Authorization: `Bearer ${process.env.REACT_APP_PERSONAL_ACCESS_TOKEN}`,
  },
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}>


    <div className="App">
    <h2 style={{backgroundColor:"rgba(0, 102, 255, 0.751)", padding:"10px 10px", justifyContent:'center'
    }}>
     Demo GitHub-GraphQL
      </h2>
    <Header />
    <Repository />
    <RepoList />
    </div>
    </ApolloProvider>

  );
}

export default App;
