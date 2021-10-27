# Hobbie Mobile App
Create, share, and discover collections of rare or noteworthy possessions<br/>
- Implemented using React Native, TypeScript, and Node.js
- React Hooks and functional components
- Community libraries such as Redux, React Navigation, and React Spring were used as well
- Sizes well across various devices, including the new iPhone 13
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
<br/>
<a name="description"/>

## Project Description
Welcome! First off, thank you for taking the time to view this project. This repository will describe and show the features of my Hobbie mobile app. It was created using React Native, which makes it compatible with both iOS and Android devices.

There are four major features of the app aside from the user authentication. The first of which allows the user to catalog and view their personal collections. Items can be added or removed as the user builds their physical collection. These collections are then displayed in a stack layout which the user can swipe through. The user can also manage their profile from this screen.

Secondly, the user can explore new items from the community database. This screen features a grid of images that can be viewed and expanded. A list of filters at the top of the screen allows the user to select what type of item is displayed. Anything from comic books to model trains can be selected. The user can also look for other members or groups using the search bar component at the top.

Next, a map feature was implemented allowing the user to locate nearby auction houses, yard sales, hobby stores, and flea markets. The type of locations displayed can be selected using a list of selectable filters. Alternatively, a search bar can be used to find a specific business or location. These features are actually reusable functional components used in the discover screen as well. Further discussion about these reusable components can be found in the following section - [Reusable Component Demo](#demo)

The final feature is an activity feed that displays events from the user's own usage or any accounts the user has followed. This includes any new additions to a collection, item trades, locations visited, and milestones reached.

For image captions, point out behavior. For example, “As the user scrolls, the search bar is hidden or displayed, depending on the direction.”
The images below are screenshots of the map, discover, and home screen<br/>
<br/>
![MapScreen](https://johndan2354.github.io/BBMobileImages/Map.PNG) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ![ComicsScreen](https://johndan2354.github.io/BBMobileImages/Comics.PNG)
<a name="demo"/>
## Reusable Component Demo
The code snippet below is a simplified example of the filter component implemented in both the Discover and Map screen. The filter list located beneath the search bar is displayed and manipulated the same way no matter where it is called. Data received by the component is the only part that will vary.<br/>
The reusable component, ```<ListItem />``` gets imported into App.js and can be reused any number of times. Each title within the data object will be rendered as a list of selectable buttons. With the useState hook, state variables can be used without the need for a class component.
```javascript
// App.js
import React, { useState } from 'react';
import { FlatList } from 'react-native';

import ListItem from '../components/ListItem';

const DATA = [
  {
    id: '56aed5-3ad53abb28ba',
    title: 'Popular',
  },
  {
    id: '6a4f8-fbd91aa97f63',
    title: 'Comics',
  },
  {
    id: '9bd96-145571e29d72',
    title: 'NFL Cards',
  },
];

const App = () => {
  // Holds the unique identifier of the selected button
  const [selected, setSelected] = useState(null);

  const renderList = ({ item }) => {
    // If the item in the list is selected then text color is set to 'red'
    const color = item.id === selected ? 'red' : 'gray';

    return (
      <ListItem 
        item={item}
        textColor={{ color }}
        onPress={() => setSelected(item.id)}
      />
    );
  };  // End renderList

  return (
    <FlatList
      data={DATA}
      renderItem={renderList}
      keyExtractor={(item) => item.id}
      extraData={selected}
    />
  );
};

export default App;
```
Each item in the data object is passed to the ```<ListItem />``` component where the title is rendered and formatted. Depending on what button is selected, the color of the text will change to red. The component receives the title, textColor, and onPress function as properties.
```javascript
// ListItem.js
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ListItem = ({ item, onPress, textColor }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.title, textColor]}>{item.title}</Text>
    </TouchableOpacity>
  );
};

export default ListItem;
```

<a name="finalthoughts"/>

## Final Thoughts
Since this was an independent project I took on many different roles in the development process. It was up to me to gather requirements and to select the tools needed. A lot of time went into the design and creating detailed mockups. This is crucial for the implementation phase when the focus should be on writing good code, not on how the app should look.<br/><br/>
**Challenges Faced -**
During development real mobile devices were used, including the iPhone 8, X, 13, and a Samsung tablet. This allowed me to program the behavior of the app more effectively. There are obvious challenges that arise when dealing with a cross-platform framework. Support for certain properties or features will vary and may not work as intended. It was also difficult sizing the app appropriately for the various screen dimensions.<br/><br/>
**React Hooks & JavaScript ES6 -**
Many new features were added to React when I first started this project. React Hooks were new to me at the time, but I quickly got familiar with useState, useEffect, and useRef. I found the use of Hooks to be a great addition to React. The code looks cleaner than the equivalent class component and is easier to read. Another way to write more concise code was made available when JavaScript arrow function syntax was introduced in ES6.
<br/><br/>
**Expanded Skillset -**
I was exposed to several tools that I had little to no experience with, including Animations and Redux for state management. I familiarized myself with a handful of animation libraries so I could implement a hideable header and search bar that can shrink/expand. The second tool, Redux, was very useful in the user authentication feature. Redux made it possible to store login data for use in other components that otherwise would not have a safe and reliable way to access said data.<br/>
