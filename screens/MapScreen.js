/********************************************************************/
/*  Author:     Stephen Magrowski                                   */
/*  Created:    February 3, 2021                                    */
/*  Filename:   MapScreen.js                                        */
/*  Purpose:    This file implements a map feature that displays    */
/*              markers for nearby sellers. The type of marker      */
/*              displayed can be selected using the search bar or   */
/*              filter buttons.                                     */
/*                                                                  */
/********************************************************************/

import React, { useState } from 'react';
import { StyleSheet, Keyboard, FlatList } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';

import MapList from '../constants/MapList';

import FiltersComponent from '../components/SearchFilters';
import SearchBarComponent from '../components/SearchBar';

const MapScreen = () => {
  const [selectedId, setSelectedId] = useState('Popular');

  const renderFilterList = ({ item }) => {
    const textColor = item.title === selectedId ? 'red' : '#787878';
    const handlePress = () => {
      if (selectedId != item.title) {
        setSelectedId(item.title);
      }
    }
    return (
      <FiltersComponent 
        category={item.title}
        textColor={textColor}
        onPress={handlePress}
      />
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerIcon}/>
        <SearchBarComponent
          placeHold={'City, state, or zip code'}
          searchInput={searchInput}
        />
        <View style={styles.filterContainer}>
          <FlatList
            horizontal={true}
            data={MapList}
            renderItem={renderFilterList}
            keyExtractor={(item) => item.id}
            ListFooterComponent={<View style={styles.outerPadding}/>}
            ListHeaderComponent={<View style={styles.outerPadding}/>}
          />
        </View>
        <View style={styles.divider}/>
      </View>  // End headerContainer
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <FlatList
          data={VenueList}
          renderItem={renderVenueList}
          ItemSeparatorComponent={itemSeparator}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.mapContainer}
        customMapStyle={MapStyle}
        provider={PROVIDER_GOOGLE}
        initialRegion={mapRegion} 
      />
      <BottomSheet
        renderHeader={renderHeader}
        renderContent={renderBody}
        enabledBottomClamp={true}
        onCloseStart={() => Keyboard.dismiss()}
      />
    </View>
  );  // End return
}  // End component

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowOpacity: .12,
    shadowOffset: {height: -5},
  },
  headerIcon: {
    width: (screenWidth < 670 ? 40 : 55),
    height: (screenWidth < 670 ? 5 : 7),
    borderRadius: 5,
    backgroundColor: '#00000040',
    marginTop: (screenWidth < 670 ? 8 : 15),
    marginBottom: (screenWidth < 670 ? 12 : 15),
    alignSelf: 'center'
  },
  filterContainer: {
    height: (screenWidth < 670 ? 37 : 45),
    backgroundColor: 'transparent',
    marginBottom: (screenWidth < 670 ? 12 : 18)
  },
  outerPadding: {
    height: '100%',
    width: (screenWidth < 670 ? 14 : 15),
    backgroundColor: 'transparent'
  },
});
