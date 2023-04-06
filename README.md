# Hobbie: Collect Socially
Create, share, and discover collections of rare or noteworthy possessions<br/>
- Implemented using React Native, MySQL, and Ruby on Rails
- React Hooks and functional components
- External libraries such as Redux, React Navigation, and React Spring
- Accesibility considerations including text upscaling and internationalization
## Table of Contents
&nbsp; &nbsp;1. [Showcase](#showcase)
<br/>
&nbsp; &nbsp;2. [Project Description](#description)
<br/>
&nbsp; &nbsp;3. [Reusable Component Demo](#demo)
<br/>
&nbsp; &nbsp;4. [Final Thoughts](#finalthoughts)
<br/>
<a name="showcase"/>
## Showcase
<img src="https://johndan2354.github.io/hobbieImages/collections.PNG" width="300" height="530" /> &nbsp; &nbsp; <img src="https://johndan2354.github.io/hobbieImages/discComics.PNG" width="300" height="530" />
<br/><br/>
<img src="https://johndan2354.github.io/hobbieImages/mapHidden.PNG" width="300" height="530" /> &nbsp; &nbsp; <img src="https://johndan2354.github.io/hobbieImages/mapvid.GIF" width="300" height="530" />
<a name="description"/>

## Project Description
Welcome! First off, thank you for taking the time to view this project. This repository will describe and show the features of the Hobbie mobile app. It was created using React Native, which makes it compatible with both iOS and Android devices. The server-side portion was implemented using Ruby on Rails.

There are four major features of the app aside from the user authentication. The first of which allows the user to catalog and view their personal collections. Items can be added or removed as the user builds their physical collection. These collections are then displayed in a stack layout which the user can swipe through. The user can also manage their profile from this screen.

Secondly, the user can explore new items from the community database. This screen features a grid of images that can be viewed and expanded. A list of filters at the top of the screen allows the user to select what type of item is displayed. Anything from comic books to model trains can be selected. The user can also look for other members or groups using the search bar component at the top.

Next, a map feature was implemented allowing the user to locate nearby auction houses, yard sales, hobby stores, and flea markets. The type of locations displayed can be selected using a list of selectable filters. Alternatively, a search bar can be used to find a specific business or location. These features are actually reusable functional components used in the discover screen as well. Further discussion about these components can be found in the section below.

The final feature is an activity feed that displays events from the user's own usage or any accounts the user has followed. This includes any new additions to a collection, item trades, locations visited, and milestones reached.

## Reusable Component Demo
The code snippet below is a simplified example of the category component implemented in both the Discover and Map screen. The category list located beneath the search bar is displayed and manipulated the same way no matter where it is called. Data received by the component is the only part that will vary. Please refer the [showcase](#showcase) section above for a visual reference of this feature.<br/><br/>
The reusable component, ```<DefaultFlatList />``` gets imported into App.js and can be called any number of times. It is used to render a list of data with each item rendered using the ```renderItem``` function. The ```keyExtractor``` prop is also used to provide a unique key for each item.
```javascript
// App.js
import React from 'react';
import { Text, View } from 'react-native';
import DefaultFlatList from '../components/DefaultFlatList';

const data = [
  { id: 1, title: 'Popular' },
  { id: 2, title: 'Comics' },
  { id: 3, title: 'NFL Cards' },
];

const renderItem = ({ item }) => {
  return (
    <View>
      <Text>{item.title}</Text>
    </View>
  );
};

export default function App() {
  return (
    <View>
      <DefaultFlatList data={data} renderItem={renderItem} />
    </View>
  );
}

```
The ```DefaultFlatList``` component accepts two props:<br/>
&nbsp; &nbsp;**data -** array of data, in this case it contains the categories<br/>
&nbsp; &nbsp;**renderItem -** function that returns a component to render each item in the array<br/>
```javascript
// DefaultFlatList.js
import React from 'react';
import { FlatList } from 'react-native';

const DefaultFlatList = ({ data, renderItem }) => {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default DefaultFlatList;
```

<a name="finalthoughts"/>

## Final Thoughts
I took on many different roles in the development process. It was up to me to gather requirements and to select the tools needed. A lot of time went into the design and creating detailed mockups. This is crucial for the implementation phase when the focus should be on writing good code, not on how the app should look.<br/><br/>
**Challenges Faced -**
During development real mobile devices were used, including the iPhone 8, X, 13, and a Samsung tablet. This allowed me to program the behavior of the app more effectively. There are obvious challenges that arise when dealing with a cross-platform framework. Support for certain methods or features will vary and may not work as intended. It was also difficult sizing the app appropriately for the various screen dimensions.<br/><br/>
**React Hooks & JavaScript ES6 -**
Many new features were added to React when I first started this project. React Hooks were new to me at the time, but I quickly got familiar with useState, useEffect, and useRef. I found the use of Hooks to be a great addition to React. The code looks cleaner than the equivalent class component and is easier to read. Another way to write more concise code was made available when JavaScript arrow function syntax was introduced in ES6.
<br/><br/>
**Expanded Skillset -**
I was exposed to several tools that I had little to no experience with, including Animations and Redux for state management. I familiarized myself with a handful of animation libraries so I could implement a hideable header and search bar that can shrink/expand. The second tool, Redux, was very useful in the user authentication feature. Redux made it possible to store login data for use in other components that otherwise would not have a safe and reliable way to access said data.<br/>
