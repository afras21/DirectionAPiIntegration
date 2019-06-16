/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Text, View, PermissionsAndroid, StyleSheet, Dimensions} from 'react-native';
import Polyline from '@mapbox/polyline';
const { width, height } = Dimensions.get('screen')
import getDirections from 'react-native-google-maps-directions'
import { Button, Icon } from 'native-base';


export default class App extends Component {
   ; // remember to remove while commiting

   destLat = 12.9507; // location of lalbag
   destLong = 77.5848;
   startLat = 0;
   startLong = 0;
   constructor() {
     super()
     this.state = {
       coordinates : []
     }
     this.getDirections = this.getDirections.bind(this);
     this.handleGetDirections = this.handleGetDirections.bind(this);
   }

   componentDidMount () {
     setInterval(() =>{
         this.getCurrentLocation();
       },
       15000 // 15 seconds
     )
     console.log('componenr did mount in working')
     // for location Permission
        this.getLocationPermission();
        console.log('startLat' + this.startLat)

    // getting direction details
         this.getDirections ("12.8572648, 77.5887875", "" +this.destLat + "," + ""+this.destLong)``
         
   }


   handleGetDirections = () => {
      const data = {
        source : {
          latitude : this.startLat,
          longitude: this.startLong,
        },
        destination : {
          latitude : this.destLat,
          longitude : this.destLong
        },
        params: [
          {
            key : "travelmode",
            value: "driving"
          },
          {
            key: "dir_action",
            value: "navigate"
          }
        ]
      }
      if(this.startLat && this.startLong)
      {
        getDirections(data);
      } else {
        alert('please wait for location')
      }

   }

   async getLocationPermission () {
    try {
            let granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                  title: 'Servitor Needs Location Access',
                  message: 'Please allow location access'
                })
                console.log('granted------------------> ' + JSON.stringify(granted));
                console.log('permisionandroid----------> ' + PermissionsAndroid.RESULTS.GRANTED);

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                alert("You can use the location")
                this.getCurrentLocation();
            }
            else {
              granted = 
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            }
        }
        catch (err) {
            console.log('error in getting location permission' + err)
            alert('error in' + err)
      
        }
   }

   getCurrentLocation () {
     console.log('getting current location.................')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("getCurrentPosition Success"+position.coords.latitude);
        // alert('' + position.coords.latitude)
        // this.startLat = position.coords.latitude;
        // this.startLong = position.coords.longitude;
        this.watchPosition();          // for watching location changes
      },
      (error) => {
        alert('Problem in Detecting your current Location')
        console.log("Error dectecting your location" + JSON.stringify(error));
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
    );
   }

   watchPosition() {
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        this.startLat = position.coords.latitude;
        this.startLong = position.coords.longitude;
        // this.handleGetDirections();
        console.log("watchPosition Success" + JSON.stringify(position));
      },
      (error) => {
        console.log("Error dectecting your location" + error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }



    async getDirections(startLoc, destinationLoc) {
      try{

          let ;
           let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=${key}`)
           let respJson = await resp.json();
          //  console.log('Resp' + JSON.stringify(respJson))

           const response = respJson.routes[0]
           const distanceTime = response.legs[0]
           const destAddress = distanceTime.end_address;
           const startAddress = distanceTime.start_address;

           const distance = distanceTime.distance.text
           console.log('distance ' + distance);

           const time = distanceTime.duration.text
           console.log('time' + time);            

           let points = Polyline.decode(respJson.routes[0].overview_polyline.points);

           let coords = points.map((point, index) => {
               return  {
                   latitude : point[0],
                   longitude : point[1]
               }
           });
           const newCoords = [...this.state.coordinates, coords];
           this.setState({ coordinates: newCoords, time, destAddress, distance});
           return coords;
           
      } catch (error) {
        alert('error in getting direction ' + error);
      }
    }


    render () {
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
      return (
        <View style={{flex: 1}}>
     <View
    style={{
      width,
      paddingTop: 10,
      paddingLeft: 10,
      paddingBottom: 10,
      height: height * 0.15,
      backgroundColor: '#f9edcf',
      justifyContent: 'flex-end',
    }}>
    <Text style={{ fontWeight: 'bold'}}>Estimated Time: {time}</Text>
    <Text style={{ fontWeight: 'bold' }}>Estimated Distance: {distance}</Text>
    <Text style={{ fontWeight: 'bold' }}>Destination: {destAddress}</Text>

  </View>
          <Button >
           <Icon
           size={30}
           color={"#fff"}
           name={"ios-man"}
           onPress={
             this.handleGetDirections
             }/>
           </Button>
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

}


