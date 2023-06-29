/********************************************************************/
/*  Author:     Stephen Magrowski                                   */
/*  Created:    February 3, 2021                                    */
/*  Filename:   MapScreen.js                                        */
/*  Purpose:    This file contains the components for the map       */
/*                                                                  */
/********************************************************************/

import React, { useState, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard, StatusBar, FlatList, Image } from 'react-native';
import { View } from '../components/Themed';
import { FontAwesome5, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import BottomSheet from 'reanimated-bottom-sheet';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import MapStyle from '../constants/MapStyle';

import CategoryArray from '../constants/Filters';
import FiltersComponent from '../components/SearchFilters';
import SearchBarComponent from '../components/SearchBar';
import markers1 from '../constants/markers1';
import markers2 from '../constants/markers2';
import VenueList from '../constants/VenueList';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const headerHeight = screenWidth < 670 ? 113 : 153;

const mapRegion = {
  latitude: 40.0,
  longitude: -75.40,
  latitudeDelta: .8,
  longitudeDelta: .8,
}

const MapScreen = () => {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight;

  const [searchInput, setSearchInput] = useState('');
  const [selectedId, setSelectedId] = useState('Popular');
  const [firstMount, setFirstMount] = useState(true);
  const [isPressed, setIsPressed] = useState(1);
  const [outerIcon, setOuterIcon] = useState(1);
  const [innerIcon, setInnerIcon] = useState(1);
  const [markerList, setList] = useState(markers1);

  const bs = useRef(null);

  const handleSearch = (text) => {
    setSearchInput(text);
  }

  const handleInputFocus = () => {
    bs.current.snapTo(0)
  }

  const clearSearch = () => {
    setSearchInput('');
  }

  const handleLegendIcon = () => {
    Keyboard.dismiss();
    console.log(nodeObject)
  }

  const handleLocation = () => {
    Keyboard.dismiss();
    innerIcon == 1 ? setInnerIcon(0) : setInnerIcon(1);
  }

  const renderFilterList = ({ item }) => {
    const textColor = item.title === selectedId ? 'red' : '#787878';
    const handlePress = () => {
      if (selectedId != item.title) {
        setSelectedId(item.title);
        firstMount ? setFirstMount(false) : null
        markerList == markers1 ? setList(markers2) : setList(markers1)
      }
    }
    return (
      <FiltersComponent 
        category={item.title}
        selectedId={selectedId}
        textColor={textColor}
        firstMount={firstMount}
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
          handleSearch={handleSearch}
          clearSearch={clearSearch}
          onPress={handleInputFocus}
        />
        <View style={styles.filterContainer}>
          <FlatList
            scrollEnabled={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={CategoryArray}
            renderItem={renderFilterList}
            keyExtractor={(item) => item.id}
            ListFooterComponent={<View style={styles.outerPadding}/>}
            ListHeaderComponent={<View style={styles.outerPadding}/>}
          />
        </View>
        <View style={styles.divider}/>
      </View>  // End headerContainer
    )
  };

  const renderVenueList = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Text numberOfLines={1} style={styles.contentTitle}>{item.title}</Text>
        <View style={{flexDirection: 'row', backgroundColor: 'transparent', marginTop: 3, marginBottom: 2}}>
          <Text style={styles.subText}>{item.category}</Text>
          <Text style={styles.subText}> {'\u00B7'} </Text>
          <Text style={styles.subText}>{item.distance} mi</Text>
        </View>
        {( item.reviews != 0 ) ?
          <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
            <Ionicons name={'ios-star'}
              size={(screenWidth < 670 ? 15.5 : 17)}
              color={'#ffaa00'}
              style={{ backgroundColor: 'transparent', bottom: -0.67 }}/>
            <Text style={styles.ratingNum}> {item.rating} </Text>
            <Text style={styles.ratingText}>({item.reviews}) on Yelp</Text>
          </View>
        : <Text style={styles.ratingText}>No Reviews</Text> }
        <View style={styles.imageContainer}>
          {( item.hasImage == 1 ) ?
            <Image source={{ uri: 'https://johndan2354.github.io/hobbieImages/venueImages/'+item.id+'.PNG' }}
  	          style={styles.image1} />
          :
            <FontAwesome5 name='map-marked-alt' size={30} color='#787878' style={{ opacity: .75 }}/> }
        </View>
      </View>
    )
  };

  const itemSeparator = () => {
    return (
      <View style={styles.itemSeparator}/>
    )
  };

  const renderBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <FlatList
          scrollEnabled={true}
          horizontal={false}
          bounces={true}
          showsVerticalScrollIndicator={true}
          data={VenueList}
          renderItem={renderVenueList}
          ItemSeparatorComponent={itemSeparator}
          keyExtractor={(item) => item.id}
        />
      </View>  // End bodyContainer
    )
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.mapContainer}
          onPress={Keyboard.dismiss}
          customMapStyle={MapStyle}
          provider={PROVIDER_GOOGLE}
          initialRegion={mapRegion}
          pitchEnabled={false}
          rotateEnabled={false} >
        {markerList.map((marker, index) => (
          <Marker
            pinColor={'#e60000'}
            key={index}
            coordinate={marker.coordinate}
          />
        ))}
      </MapView>

      <TouchableWithoutFeedback
          onPress={handleLegendIcon}
          delayPressOut={60}
          onPressIn={() => setIsPressed(0.5)}
          onPressOut={() => setIsPressed(1)}>
        <View style={[styles.mapButton, { top: (screenWidth < 670 ? topPad+10 : topPad+12) }]}>
          <MaterialCommunityIcons
            name='map-legend'
            size={(screenWidth < 670 ? 29 : 40)}
            color='red'
            style={{ backgroundColor: 'transparent', opacity: isPressed }} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
          onPress={handleLocation}
          onPressIn={() => setOuterIcon(0.5)}
          onPressOut={() => setOuterIcon(1)}>
        <View style={[styles.mapButton, { top: (screenWidth < 670 ? topPad+66 : topPad+85) }]}>
          <FontAwesome5
            name='location-arrow'
            size={(screenWidth < 670 ? 24 : 30)}
            color='red'
            style={{ backgroundColor: 'transparent', opacity: outerIcon }} />
          <FontAwesome
            name='location-arrow'
            size={(screenWidth < 670 ? 22.5 : 28)}
            color='#F5F5F5'
            style={[styles.innerLocationIcon, { opacity: innerIcon } ]}/>
        </View>
      </TouchableWithoutFeedback>

      <BottomSheet
        ref={bs}
        snapPoints={[screenHeight-(topPad+60), 299.5, headerHeight]}
        initialSnap={2}
        renderHeader={renderHeader}
        renderContent={renderBody}
        enabledBottomClamp={true}
        onCloseStart={() => Keyboard.dismiss()}
      />

    </View>  // End container view
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
  bodyContainer: {
    backgroundColor: '#F5F5F5',
  },
  itemContainer: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    paddingTop: (screenWidth < 670 ? 14 : 20),
    paddingBottom: (screenWidth < 670 ? 14 : 20),
    paddingLeft: (screenWidth < 670 ? 14 : 15),
    paddingRight: (screenWidth < 670 ? 88 : 15),
  },
  contentTitle: {
    fontSize: (screenWidth < 670 ? 19 : 23),
    color: '#383838',
    fontWeight: 'bold'
  },
  subText: {
    fontSize: (screenWidth < 670 ? 15 : 18),
    color: '#383838',
  },
  ratingNum: {
    fontSize: (screenWidth < 670 ? 15 : 18),
    fontWeight: 'bold',
    color: '#ffaa00'
  },
  ratingText: {
    fontSize: (screenWidth < 670 ? 15 : 18),
    color: '#888888'
  },
  divider: {
    width: '100%',
    height: (screenWidth < 670 ? 1.5 : 2),
    backgroundColor: '#DCDCDC'
  },
  itemSeparator: {
    width: '95%',
    height: (screenWidth < 670 ? 1 : 1.5),
    borderRadius: 5,
    backgroundColor: '#DCDCDC',
    alignSelf: 'center'
  },
  imageContainer: {
    height: 64,
    width: 64,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    top: (screenWidth < 670 ? 14 : 20),
    right: (screenWidth < 670 ? 14 : 15),
    position: 'absolute',
    backgroundColor: '#DCDCDC',
    borderWidth: 1.5,
    borderColor: '#C8C8C8',
    borderRadius: 9
  },
  image1: {
    height: 64,
    width: 64,
    borderRadius: 9,
    resizeMode: 'cover'
  },
  mapButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    height: (screenWidth < 670 ? 47 : 60),
    width: (screenWidth < 670 ? 47 : 60),
    backgroundColor: '#F5F5F5',
    right: (screenWidth < 670 ? 8 : 12),
    borderWidth: 0,
    borderRadius: 8,
    shadowOpacity: .25,
    shadowOffset: {height: 3},
    elevation: 8
  },
  innerLocationIcon: {
    position: 'absolute',
    top: (screenWidth < 670 ? 10.4 : 14.5),
    left: (screenWidth < 670 ? 15.7 : 20),
    backgroundColor: 'transparent',
  }
});
