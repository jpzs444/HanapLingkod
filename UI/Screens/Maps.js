import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import MapView, {Geojson} from 'react-native-maps';

import * as Location from 'expo-location';

const Maps = () => {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const myPlace = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [12.9927, 124.0147],
            },
          },
        ],
      };

    useEffect(() => {
        (async () => {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let alocation = await Location.getCurrentPositionAsync({});
          console.log(alocation.coords.latitude)
          setLocation({...alocation})

          console.log(location)
        })();
      }, []);

  return (
    <>
        <MapView
    style={{flex: 1}}
    initialRegion={{
      latitude: 14.116667,
      longitude: 122.949997,
      latitudeDelta: 0.0722,
      longitudeDelta: 0.0321,
    }}
  >
    <Geojson geojson={myPlace} />
  </MapView>

    </>
  )
}

export default Maps

const styles = StyleSheet.create({})