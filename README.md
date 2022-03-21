# Using GraphQL with React Native
Please note the code for this can be found here: `https://github.com/will-sloan/sysc3010-techmemo/blob/main/App.js`
## Motivation


## Set up
Assuming npm is installed.  
Assume Visual Studio code is installed.  
Assuming node is installed.  
Assuming the reader has a Android device simulator.   

## Make React Native project

`npm install -g npx`

`npx react-native init MyDemoApp`

`cd MyDemoApp` 


## ApolloClient
`npm install @apollo/client graphql`

We will follow an example similar to the Apollo getting started example except a bit more practical. 

Open `App.js` and delete everything. 
At the top add:
``` javascript
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
```
	
Above imports all the modules that we will use in this tutoiral. What each one of these things does, will be explained once they are used in the project. 
Next, we need to create the ApolloClient object which we will use to interact with our GraphQL server. 
Below `@apollo/client` put:
``` javascript
const client = new ApolloClient({
 uri: 'https://71z1g.sse.codesandbox.io/',
 cache: new InMemoryCache()
});
```

The `uri` we used above, connects to an open GraphQL server which we can use for some brief testing. `cache` is used for local storage of information that is retrieved from a GraphQL request. 

### GraphQL basics
From their website:
```
GraphQL is a query language for your API, and a server-side runtime for executing queries using a type system you define for your data.
```

Simply it allows you to send JSON like strings to a server and get a JSON object back containing the data you asked for. It acts like a front end for your database which is simple to use. 

In GraphQL, there are two types of requests, a query and a mutation. A query is a request to get data, and a mutation is a request to change data. 
Since the GraphQL server entered above doesn't have any mutation implemented (obviously not a good idea for a public server), we will have to use a query.

Queries are generally structured like:
```
query Name {
	queryName(argument: value){
		property1
		property2
	}
}
```

Note that `Name` can be anything, or could be excluded entirely. 
Sometimes there won't be an argument so the line may just be:
`queryName {`

Open `https://71z1g.sse.codesandbox.io/`. Once loaded there should be a query already there for you to try by pressing the play button. 

After running the default query, try the one below if they are different:
```
query GetDogs {
    dogs {
      id
      breed
    }
}
```

The above query calls the `dogs` query, asking for all dogs which are stored in the database. `id` and `breed` are used to select information we want from the results, in this case only the id and breed name. We can get more information about the dogs by adding `displayImage` below `breed`. Try running it with `displayImage`, you should see:

![Sample Output](https://github.com/will-sloan/sysc3010-techmemo/blob/main/images/sample_query_output.png)

## Integrating with React Native
Now that we have a basic understanding of GraphQL, lets integrate it with our app. 

To have ApolloClient work, we have to wrap our App in its client so that everything can access the client. 
In App.js, add the following:
``` javascript
const App = () => {
  return (
    <ApolloProvider client={client}>
        <Text>Hello World</Text>
    </ApolloProvider>
  );
};

export default App;
```

This causes the app to use the `client` we had previously defined. 
`<Text>Hello</Text>` displays whatever text is between the tags onto the screen.
We can now run this to display `Hello World`

Before we add can run our code, we have to replace `metro.config.js` because currently some of the Apollo source files won't be recognized. 
Replace the current `metro.config.js` with:
``` javascript
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts;
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    sourceExts: process.env.RN_SRC_EXT
      ? [...process.env.RN_SRC_EXT.split(',').concat(defaultSourceExts), 'cjs'] 
      : [...defaultSourceExts, 'cjs'],
  },
};
```

Now we are ready to run our code. Make sure your android simulator is running, then in a terminal run:
`npx react-native run-android`

You should see:

![Hello World](https://github.com/will-sloan/sysc3010-techmemo/blob/main/images/hello_world_phone.png)

With our setup complete, we can start with some GraphQL requests.

## Queries in GraphQL
Now we have to create a query in javascript. To so this we use `gql`. Copy below and paste it below where the client was declared. 
``` javascript
const GET_DOGS = gql`
  query GetDogs {
    dogs {
      id
      breed
    }
  }
`;
```

Next, add the code below the query. 

``` javascript
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

  // Get the first dog breed
  var firstResult = data["dogs"][0]["breed"];
  return (<Text>{firstResult}</Text>);
}
```
Above declares a new component which will use `useQuery` to make a request using the `GET_DOGS` query we have declared. 
All is left is to update our App declaration.
Replace `<Text>Hello World</Text>`  with `<MyApp/>`

Now in your Metro bundler terminal press `r`:

![Metro Bundler](https://github.com/will-sloan/sysc3010-techmemo/blob/main/images/metro_terminal.png)

Your app should reload and a dog breed should be displayed like: 

![Final Output](https://github.com/will-sloan/sysc3010-techmemo/blob/main/images/final_phone.png)

## Conclusion
This tutorial has only covered the very basics of getting the app set up in a way that you can create queries. Next steps could be to display more of the information that you have retrieved. Or you could add `displayImage` to the request and try displaying the images in the app. Here are some links for getting you started in that direction:

Images: `https://reactnative.dev/docs/image`  
Walkthrough: `https://www.apollographql.com/docs/react/data/queries/`  

We haven't even implemented mutations yet, or passed arguments to queries. If you'd like to learn more about that check out these links:

Mutations: `https://www.apollographql.com/docs/react/data/mutations`  
Queries: `https://www.apollographql.com/docs/react/data/queries/`  

