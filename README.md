# Hobbie Mobile App
Create, share, and discover collections of rare or noteworthy possessions<br/>
## Table of Contents
&nbsp; &nbsp;1. [Project Overview](#overview)
<br/>
&nbsp; &nbsp;2. [Reusable Components Explained](#functcomp)
<a name="overview"/>
## Project Overview
Welcome! First off, thank you for taking the time to view this project. This repository will describe and show the features of my hobbie mobile app. It was created using React Native, which makes it compatible with both iOS and Android devices.

There are four major features of the app aside from the user authentication. The first of which allows the user to catalog and view their personal collections. Items can be added or removed as the user builds their physical collection. These collections are then displayed in a stack layout which the user can swipe through. The user can also manage their profile from this screen.

Secondly, the user can explore new items from the community database. This screen features a grid of images that can be viewed and expanded. A list of filters at the top of the screen allows the user to select what type of item is displayed. Anything from comic books to model trains can be selected. The user can also look for other members or groups using the search bar component at the top.

Next, a map feature was implemented allowing the user to locate nearby auction houses, yard sales, hobby stores, and flea markets. The type of locations displayed can be selected using a list of pressable filters. Alternatively, a search bar can be used to find a specific business or location. These features are actually reusable functional components used in the discover screen as well. Further discussion about these reusable components can be found in the following section - [Reusable Components Explained](#functcomp)

The final feature is an activity feed that displays events from the user's own usage or any accounts the user has followed. This includes any new additions to a collection, item trades, locations visited, and milestones reached.

For image captions, point out behavior. For example, “As the user scrolls, the search bar is hidden or displayed, depending on the direction.”

Sizes well across various screen sizes and devices, including tablets<br/>
Section for what I learned from this project, animations, redux, hooks. Limitations of javascript, need for native code<br/>
Makes use of React Hooks<br/>

The images below are screenshots of the map, discover, and home screen<br/>
<br/>
![MapScreen](https://johndan2354.github.io/BBMobileImages/Map.PNG) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ![ComicsScreen](https://johndan2354.github.io/BBMobileImages/Comics.PNG)
<a name="functcomp"/>
## Reusable Components Explained
```javascript
/********************************************************************/
/*  Author:     Stephen Magrowski                                   */
/*  Created:    October 18, 2021                                    */
/*  Filename:   App.js                                              */
/*  Purpose:    Makes use of a given list of categories to render   */
/*              selectable buttons. A reusable component is         */
/*              imported which can be used in other screens.        */
/*                                                                  */
/********************************************************************/

import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import { data } from '../data';
import ListFilters from '../components/ListFilters';

const App = () => {
  // Holds the unique identifier of the selected button
  const [selected, setSelected] = useState('1');

  const renderList = ({ item }) => {
    // If the current item in the list is selected then text color is set to 'red'
    const textColor = item.id === selected ? 'red' : 'gray';
    return (
      <ListFilters 
        category={item.title}
        textColor={textColor}
        onPress={() => setSelected(item.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal={true}
        data={data}
        renderItem={renderList}
        keyExtractor={(item) => item.id}
        ListFooterComponent={<View style={styles.outerPadding}/>}
        ListHeaderComponent={<View style={styles.outerPadding}/>}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  outerPadding: {
    height: '100%',
    width: 15,
  },
});
```

