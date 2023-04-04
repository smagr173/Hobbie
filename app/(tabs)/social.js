/********************************************************************/
/*  Author:     Stephen Magrowski                                   */
/*  Created:    February 3, 2021                                    */
/*  Filename:   SocialFeed.js                                       */
/*  Purpose:    This file contains       */
/*                                                                  */
/********************************************************************/

import React, { useState } from 'react';
import { StyleSheet, FlatList, Dimensions, View } from 'react-native';

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

const screenWidth = Dimensions.get('window').width;

const SocialFeed = () => {
  const [selected, setSelected] = useState(null);

  const renderList = ({ item }) => {
    // If the current item in the list is selected then text color is set to 'red'
    const color = item.id === selected ? 'red' : 'gray';

    return (
      <ListItem 
        item={item}
        textColor={{ color }}
        onPress={() => setSelected(item.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
        <View style={styles.filterContainer}>
          <FlatList
            scrollEnabled={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={DATA}
            renderItem={renderList}
            keyExtractor={(item) => item.id}
            extraData={selected}
            ListFooterComponent={<View style={styles.outerPadding}/>}
            ListHeaderComponent={<View style={styles.outerPadding}/>}
          />
        </View>

    </View>  // End container view
  );  // End return
} // End component

export default SocialFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
    flexDirection: 'row'
  },
  filterContainer: {
    height: (screenWidth < 670 ? 37 : 45),
    backgroundColor: 'transparent',
    marginBottom: 2
  },
  outerPadding: {
    height: '100%',
    width: (screenWidth < 670 ? 14 : 15),
    backgroundColor: 'transparent'
  },
});

