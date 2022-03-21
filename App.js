/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Text,
} from 'react-native';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
 
 } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://71z1g.sse.codesandbox.io/',
  cache: new InMemoryCache()
});

const GET_DOGS = gql`
  query GetDogs {
    dogs {
      id
      breed
    }
  }
`;

const MyApp = () => {
  // Variables below store data about the state of the request.
  // Loading --> if the request is still waiting for a response
  // Error --> if an error was returned by the server
  // data --> initially empty but gets data once the request is returned
  const { loading, error, data } = useQuery(GET_DOGS);

  // While waiting, we should display that we are still loading
  if (loading) return (<Text>Loading...</Text>);

  // If we get an error then we should display what it was
  if (error) return (<Text>Error! ${error.message}</Text>);

  // The response is in JSON format, which looks like:
  /*
  {
    "dogs":[
      {
        "__typename": "Dog",
        "breed": "affenpinscher",
        "id": "Z1fdFgU"
      },
      ...
    ]
  }
  */
  // So "dogs" gets the list of dogs
  // 0 gets the first dog in the list
  // "breed" gets the second properity of the object which corresponds to the dog breed name
  var firstResult = data["dogs"][0]["breed"];
  return (<Text>{firstResult}</Text>);
}


const App = () => {
  return (
    <ApolloProvider client={client}>
        <MyApp/>
    </ApolloProvider>
  );
};

export default App;
