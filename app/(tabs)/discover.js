/********************************************************************/
/*  Author:     Stephen Magrowski                                   */
/*  Created:    February 14, 2021                                   */
/*  Filename:   DiscoverScreen.js                                   */
/*  Purpose:    Displays content which can be selected using the    */
/*              reusable filterComponent. A search bar is also      */
/*              implemented using the reusable searchBarComponent.  */
/*                                                                  */
/********************************************************************/

import React, { useState, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, Dimensions, StatusBar, FlatList, Animated, Image } from 'react-native';
import { View } from '../components/Themed';

import Popular from '../constants/Popular';
import Comics from '../constants/Comics';
import FootballCards from '../constants/FootballCards';
import HotWheels from '../constants/HotWheels';

import CategoryArrayDiscover from '../constants/DiscoverFilters';
import FiltersComponent from '../components/SearchFilters';
import SearchBarComponent from '../components/SearchBar';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth*.331;

const DiscoverScreen = () => {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'ios' ? insets.top+6 : StatusBar.currentHeight+6;
  const headerHeight = ( screenWidth < 670 ) ? 86 : 112;
  const halfHeader = headerHeight / 2;

  const [searchInput, setSearchInput] = useState('');
  const [selectedId, setSelectedId] = useState('Popular');
  const [firstMount, setFirstMount] = useState(true);
  const [refreshLock, setRefreshLock] = useState(false);
  const [theImages, setImages] = useState(Popular);

  const handleSearch = (text) => {
    setSearchInput(text)
  }

  const clearSearch = () => {
    setSearchInput('')
  }

  const handleInputFocus = () => {
  }

  const renderFilterList = ({ item }) => {
    const textColor = item.title === selectedId ? 'red' : '#787878';
    const handlePress = () => {
      if (selectedId != item.title) {
        setSelectedId(item.title)
        firstMount ? setFirstMount(false) : null
        item.title == 'Popular' ? setImages(Popular) : null
        item.title == 'Comics' ? setImages(Comics) : null
        item.title == 'Hot Wheels' ? setImages(HotWheels) : null
        item.title == 'NFL Cards' ? setImages(FootballCards) : null
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

  const renderImages = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
				<Image source={{ uri: item.sourceUri }}
  	      style={styles.image1} />
      </View>
    );
  };

  const ref = useRef(null);
  const totalOffset = useRef(0);
  const startOffset = useRef(0);

  const scrollY = useRef(new Animated.Value(0));
  const scrollYClamped = Animated.diffClamp(scrollY.current, 0, halfHeader);

  const transY = scrollYClamped.interpolate({
    inputRange: [0, halfHeader],
    outputRange: [0, -(halfHeader)],
  });

  const opacY = scrollYClamped.interpolate({
    inputRange: [0, halfHeader],
    outputRange: [1, 0],
  });

  const translateYNumber = useRef();

  transY.addListener(({value}) => {
    value == translateYNumber.current ? null : translateYNumber.current = value
  });

  const handleScroll = (offsetY) => {
    if (offsetY >= 0) {
      setRefreshLock(false);
      offsetY == totalOffset.current ? null : totalOffset.current = offsetY;
    }
    else {
      setRefreshLock(true);
    }
  };

  const momentumBegin = () => {
    clearTimeout(() => scrollEndTimer);
  };

  const scrollBegin = () => {
    startOffset.current = totalOffset.current;
    clearTimeout(() => scrollEndTimer);
  };

  const handleEnd = () => {
    scrollEndTimer = setTimeout(handleSnap, 100);
  };

  const handleSnap = () => {
    const offsetY = totalOffset.current;
    if (
      !(
        translateYNumber.current === 0 ||
        translateYNumber.current === -(halfHeader)
      )
    ) {
      if (ref.current) {
        const direction = startOffset.current > offsetY ? true : false
        const difference = halfHeader + translateYNumber.current;
        ref.current.scrollToOffset({
          offset:
            direction ? offsetY-(halfHeader-difference) : offsetY + difference,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[ styles.header, { paddingTop: topPad, transform: [{ translateY: refreshLock ? 0 : transY }] } ]}>
        <SearchBarComponent
          placeHold={'Search'}
          searchInput={searchInput}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
          opacAnim={refreshLock ? 1 : opacY}
          onPress={handleInputFocus}
        />
        <View style={styles.filterContainer}>
          <FlatList
            scrollEnabled={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={CategoryArrayDiscover}
            renderItem={renderFilterList}
            keyExtractor={(item) => item.id}
            ListFooterComponent={<View style={styles.outerPadding}/>}
            ListHeaderComponent={<View style={styles.outerPadding}/>}
          />
        </View>
        <View style={styles.borderView}/>
      </Animated.View>

      <Animated.FlatList
        horizontal={false}
        numColumns={3}
        scrollEventThrottle={1}
        ref={ref}
        bounces={true}
        contentContainerStyle={{ paddingTop: headerHeight+topPad }}
        showsVerticalScrollIndicator={true}
        columnWrapperStyle={styles.wrapperStyle}
        scrollEnabled={true}
        onScrollBeginDrag={scrollBegin}
        onScrollEndDrag={handleEnd}
        onMomentumScrollBegin={momentumBegin}
        data={theImages}
        renderItem={renderImages}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {y: scrollY.current},
              },
            },
          ],
          {
            useNativeDriver: true,
            listener: ({ nativeEvent: {contentOffset: {y}} }) => handleScroll(y)
          },
        )}
      />

    </View>  // End container view
  );  // End return
} // End component

export default DiscoverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
    flexDirection: 'row'
  },
  header: {
    position: 'absolute',
    backgroundColor: '#F5F5F5',
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1,
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
  borderView: {
    width: '100%',
    height: (screenWidth < 670 ? 8 : 14),
    borderBottomWidth: screenWidth*.0034,
    borderBottomColor: '#DCDCDC',
    backgroundColor: 'transparent'
  },
  wrapperStyle: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },
  squareView: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'yellow',
    borderWidth: .5,
    borderColor: 'black'
  },
  squareViewInner: {
    flex: 1,
    backgroundColor: 'blue',
    borderWidth: 1,
    borderColor: 'gray'
  },
  imageContainer: {
    height: itemWidth,
    width: itemWidth,
    backgroundColor: 'white',
    borderBottomWidth: screenWidth*.0034,
    borderBottomColor: '#DCDCDC',
  },
  image1: {
    flex: 1,
    resizeMode: 'cover',
  },
});
