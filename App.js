/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Text, View, PermissionsAndroid, AppRegistry, StyleSheet, Dimensions, Image, StatusBar, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE } from 'react-native-maps';
import Polyline from '@mapbox/polyline';
const { width, height } = Dimensions.get('screen')




export default class App extends Component {


constructor(props) {
  super(props);
  
  this.state = {
    latitude: 12.8568761, //pg location
    longitude: 77.5887916,
    error: null,
    concat: null,
    coords:[],
    x: 'false',
    cordLatitude:12.878094, //office location
    cordLongitude:77.595491,
  };

  this.mergeLot = this.mergeLot.bind(this);

}

componentDidMount() {
  this.getPermissionRequest();


  // navigator.geolocation.getCurrentPosition(
  //    (position) => {
  //      this.setState({
  //        latitude: position.coords.latitude,
  //        longitude: position.coords.longitude,
  //        error: null,
  //      });
  //      this.mergeLot("12.878094,77.595491");
  //    },
  //    (error) => this.setState({ error: error.message }),
  //    { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
  //  );

 }

 getPermissionRequest(){
  try {
    let granted = 
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        // alert(PermissionsAndroid.RESULTS.GRANTED)
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        alert("You can use the location")
    }
    else {
      granted = 
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        // alert("enied" +  PermissionsAndroid.RESULTS.GRANTED)
    }
}
catch (err) {
    console.warn(err)
    alert('error' + err)

}
 }

 mergeLot(destination) {
  if (this.state.latitude != null && this.state.longitude != null) {
    let concatLot = this.state.latitude + "," + this.state.longitude;
    this.setState({
      concat: concatLot
    });
    this.getDirections(concatLot, destination);
  }
}

 async getDirections(startLoc, destinationLoc) {

       try {

           let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=${key}`)
           let respJson = await resp.json();
           console.log('Resp' + JSON.stringify(respJson))
           const response = respJson.routes[0]
           const distanceTime = response.legs[0]
           const destAddress = distanceTime.end_address;
           const startAddress = distanceTime.start_address;

           console.log('distance time' + JSON.stringify(distanceTime));
           const distance = distanceTime.distance.text
           const time = distanceTime.duration.text
      



           let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
          //  alert('point' + points)

           let coords = points.map((point, index) => {
               return  {
                   latitude : point[0],
                   longitude : point[1]
               }
           })
          //  this.setState({coords: coords})
          this.setState({ coords, distance, time , startAddress, destAddress})

           this.setState({x: "true"})
           return coords
       } catch(error) {
        // alert('error' + error)
        this.setState({x: "error"})
           return error
       }
   }
   handlePress = coordinate => {
    let latlong = coordinate.latitude + "," + coordinate.longitude;
    this.setState({
      cordLatitude: coordinate.latitude,
      cordLongitude: coordinate.longitude
    });
    this.mergeLot(latlong);
  };

render() {
  const {
    time,
    startAddress,
    destAddress,
    coords,
    distance,
    latitude,
    longitude,
    destination
  } = this.state

  if (this.state.loading) {
    return null;
  }
  console.log('latitude --- > ' + this.state.latitude+ ', '+this.state.longitude)
  return (
<View style={{flex: 1}}>
    <View
    style={{
      width,
      paddingTop: 10,
      alignSelf: 'center',
      alignItems: 'center',
      height: height * 0.15,
      backgroundColor: 'white',
      justifyContent: 'flex-end',
    }}>
    <Text style={{ fontWeight: 'bold' }}>Estimated Time: {time}</Text>
    <Text style={{ fontWeight: 'bold' }}>Estimated Distance: {distance}</Text>
    <Text style={{ fontWeight: 'bold' }}>Destination: {destAddress}</Text>

  </View>

    <MapView 
    
    style={{flex: 1}} 
    customMapStyle = {this.mapStyle}
    initialRegion={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
    }}          onPress={({ nativeEvent }) => this.handlePress(nativeEvent.coordinate)}
     >

    {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
       coordinate={{"latitude":this.state.latitude,"longitude":this.state.longitude}}
       title={"Your Location"}
      //  {...alert('working in yout location')}
     />}

     {!!this.state.cordLatitude && !!this.state.cordLongitude && <MapView.Marker
        coordinate={{"latitude":this.state.cordLatitude,"longitude":this.state.cordLongitude}}
        title={"Your Destination"}
        // {...alert('working inside destinations')}

      />}

     {!!this.state.latitude && !!this.state.longitude && this.state.x == 'true' && <MapView.Polyline
        //  {...alert('working inside not longitude')}
          coordinates={this.state.coords}
          strokeWidth={4}
          strokeColor="red"/>
      }
      

      {!!this.state.latitude && !!this.state.longitude && this.state.x == 'error' && <MapView.Polyline
        
          // {...alert('nothing found')}
        />
       }
    </MapView>
    </View>
  );
}


styles = StyleSheet.create({
map: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
});

 mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]

}

