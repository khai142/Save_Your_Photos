import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import React from 'react';
import { StyleSheet, Text, View, Button, Image, Platform, ActivityIndicator, TouchableOpacity, FlatList, Dimensions, ImageBackground } from 'react-native';
import firebase from './FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { BlurView } from 'expo-blur';
// import * as Progress from 'expo-progress';
import BackgroundHome from '../img/bg.jpg';
import BackgroundNav from '../img/nav.jpg';
import PlusIcon from '../img/plus.png';
import CloseIcon from '../img/close.jpg';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class HomeScreen extends React.Component{
  state = { 
    displayEmail: firebase.auth().currentUser.email,
    uid: firebase.auth().currentUser.uid,
    image: firebase.storage().ref().child('images').listAll(),
    uploading: false,
    transferred: 0,
    profileImg: null,
    showFunc: false,
    listImg: []
  }

  signOut = () => {
    firebase.auth().signOut()
    .then(() => {
      this.props.navigation.navigate('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }  

  _pickImage = async (name) => {
    try {
      // let result = await ImagePicker.launchCameraAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.uploadImage(result.uri, name); 
      }
    } catch (E) {
      console.log(E);
    }
  };

  uploadImage = async(uri, name) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var uploadTask = firebase.storage().ref().child(this.state.displayEmail + '/' + name).put(blob);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        this.setState({uploading: true, transferred: (snapshot.bytesTransferred / snapshot.totalBytes) * 100});
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;      
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL()
        .then((downloadURL) => {          
          this.setState({uploading: false});
          if (name === "profile"){
            this.setState({profileImg: downloadURL});
          }
          else{
            this.setState({listImg: [...this.state.listImg, {"fileName": name, uri: downloadURL}]});
          }
        });
      }
    );    
  }

  AddImg = () =>{
    let fileName = new Date().getTime().toString();
    this._pickImage("images/" + fileName);
  }

  getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  getProfileImg = () => {
    firebase.storage().ref().child(this.state.displayEmail + '/' + "profile").getDownloadURL()
    .then(downloadURL => {
      this.setState({profileImg: downloadURL});
    })
    .catch(()=>{
      firebase.storage().ref().child("Anonymous user.png").getDownloadURL()
      .then(downloadURL => {
        this.setState({profileImg: downloadURL});
      });
    });
  }

  getAllImg = () =>{
    firebase.storage().ref().child(this.state.displayEmail + '/' + "images").listAll()
    .then((res) => {
      if (res) {
        res.items.forEach((itemRef) =>{
          let fileName = itemRef.location.path_.slice(itemRef.location.path_.lastIndexOf("/")+1);
          itemRef.getDownloadURL()
          .then(downloadURL => {
            // Add new Item
            let newItem = {"fileName": fileName, uri: downloadURL};
            this.setState({listImg: [...this.state.listImg, newItem]});          
            //sort
            this.state.listImg.sort(function(a, b) {
              return parseInt(a.fileName) - parseInt(b.fileName);
            });
          });
        });
      }

    }).catch(function(error) {
      console.log(error);
    });
  }

  renderItem(item) {
    return (
      <TouchableOpacity style={{width: (windowWidth-16)/3, height: (windowWidth-16)/3, margin: 2}}>
        <Image style={{width: "100%", height: "100%"}} resizeMode='cover' source={{ uri:  item.uri}}></Image>
      </TouchableOpacity>
    )
  }

  componentDidMount() {
    this.getPermissionAsync();
    this.getProfileImg();
    this.getAllImg();
  }

  render(){
    return (
      <View style={{flex: 1, zIndex: 1, elevation: 1}}>
        {/* Status bar */}
        <View style={{height: Constants.statusBarHeight}}>          
          <StatusBar backgroundColor="white"></StatusBar>
        </View>
        {/* Show or hide right nav */}
        {this.state.showFunc ? (
          <View style={styles.rightNav}>
            {/* Blur View */}
            <TouchableOpacity style={{flex:1, cursor: "default"}} onPress={()=>{this.setState({showFunc: false})}}>
              <BlurView intensity={100} style={StyleSheet.absoluteFill}>
              </BlurView>
            </TouchableOpacity>
            {/* Right nav */}
            <ImageBackground source={BackgroundNav} style={{flex: 2, alignItems: "center", maxWidth: 300}}>
              <View style={{width: "100%", marginBottom: 10, alignItems: 'center'}}>
                <TouchableOpacity style={{alignSelf: "flex-start"}} onPress={()=>{this.setState({showFunc: false})}}>
                  <Image source={CloseIcon} style={{width: 30, height: 30}}/>
                </TouchableOpacity>
                <Image source={{ uri: this.state.profileImg}} style={{ width: 40, height: 40, borderRadius: 40, }} />
                <Text style={{color: "#fff"}}>{this.state.displayEmail}</Text>
              </View>
              <View style={{height: 1, width: "100%", backgroundColor: "#fc7b03"}}></View>
              <View style={{width: "100%", marginVertical: 30, alignItems: 'center'}}>
                <TouchableOpacity style ={{width: "100%", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#fff"}} onPress={()=>{this._pickImage("profile")}}>
                  <Text style={{color: "white", textAlign: "center"}}>Change Profile Image</Text>
                </TouchableOpacity>
                <TouchableOpacity style ={{width: "100%", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#fff"}} onPress={()=>this.signOut()}>
                  <Text style={{color: "white", textAlign: "center"}}>LOGOUT</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        ) : (
          <View></View>
        )}

        {/* Header */}
        <View style={{flexDirection: "row", alignItems: "center", paddingVertical: 10, backgroundColor: "#555"}}>
          <View style={{flex:1, alignItems: "center"}}>
            <Text style={{color: "white", fontSize: 20, fontWeight: "bold", textAlignVertical: "center"}}>YOUR ALBUM</Text>       
          </View> 
          <TouchableOpacity style={{alignSelf: "flex-end", marginHorizontal: 10}} onPress={()=>{this.setState({showFunc: true})}}>
            <Image source={{ uri: this.state.profileImg}} style={{ width: 40, height: 40, borderRadius: 40, }} />
          </TouchableOpacity>            
        </View>        
        {/* Main content */}
        <ImageBackground source={BackgroundHome} style={styles.bgimg}>
          {/* View for list img */}
          {!this.state.listImg.length ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: "center"}}>
              <Text style={{color: "white", fontSize: 16, width: "80%"}}>Look like you have no photo here, add some photos by press the (+) button</Text>
            </View>
          ) : (
            <FlatList
              numColumns={3}
              data={this.state.listImg}
              keyExtractor={(item, index) => item.fileName}
              renderItem={({ item }) => this.renderItem(item)}
            />
          )}
        </ImageBackground>
        {/* Add image button*/}
        <View style={{width: 80, height: 80, position: 'absolute', bottom: 20, right: 20, borderRadius: 50, backgroundColor: "#fff", justifyContent: 'center', alignItems: "center"}}>
          {this.state.uploading ? (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {/* <Progress.Bar color="blue" progress={this.state.transferred}/> */}
              <ActivityIndicator size="large"></ActivityIndicator>
            </View>
          ) : (
            <TouchableOpacity style={{width: "100%", height: "100%"}} onPress={()=>{this.AddImg()}}>
              {/* <Button title="ADD IMAGE" onPress={()=>{this.AddImg()}} /> */}
              {/* <Text style={{color: "white", fontSize: 55}}>+</Text> */}
              <Image source={PlusIcon} style={{width: "100%", height: "100%"}}/>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  bgimg: {
    flex: 1,
    resizeMode: "contain",
  },
  textStyle: {
    fontSize: 15,
    marginBottom: 20
  },
  rightNav: {
    position: "absolute", 
    marginTop: Constants.statusBarHeight, 
    width: windowWidth, 
    height: windowHeight, 
    flexDirection: "row", 
    zIndex: 2, 
    elevation: 2
  }
});
