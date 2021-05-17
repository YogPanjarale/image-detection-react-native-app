import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions'
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles';
import axios from 'axios';

export default class CameraPage extends React.Component {
  camera = null;

  state = {
    hasCameraPermission: null,
  };

  async componentDidMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');
    this.setState({ hasCameraPermission });
  };

  uploadImage = async (url) => {
    //Check if any file is selected or not

    //If file selected then create FormData
    const fileToUpload = url;
    const data = new FormData();
    data.append('name', 'Image Upload');
    data.append('digit', fileToUpload);
    let res = await axios(
      'http://yog1.ddns.net:5000/predict-image',
      {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
        body: data,

      }
    );
    let responseJson = await res.json();
    //   console.log(responseJson, "Pralhad")
    if (responseJson.status == 1) {
      alert('Upload Successful');
    }

  };

  takePicture = async () => {
    if (this.camera) {
      console.log("Taking Picture")
      let photo = await this.camera.takePictureAsync();
      var image = photo.uri
      this.uploadImage(image)
    }
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Access to camera has been denied.</Text>;
    } else {
      return (
        <View style={{ flex: 1, alignItems: 'flex-end' }}>

          <Camera
            style={styles.preview}
            ref={ref => { this.camera = ref }}
          />

          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'red',
              margin:10,
              marginTop:50
            }}
            onPress={() => this.takePicture()}
          >
            <FontAwesome
              name="camera"
              style={{ color: "#fff", fontSize: 40}}
            />
          </TouchableOpacity>
        </View>
      );

    };
  };
};