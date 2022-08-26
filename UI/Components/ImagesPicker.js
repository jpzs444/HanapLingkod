import React, { useState } from 'react'
import { FlatList, View, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker';

export default function ImagesPicker() {

    const [image, setImage] = useState([]);

    useEffect(() => {
        (async () => {
          if (Platform.OS !== "web") {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              alert("Sorry, we need camera roll permissions to make this work!");
            } else {pickImage}
          }
        })();
      }, []);
  
      const pickImage = async () => {
  
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          allowsMultipleSelection: true,
          selectionLimit: 10,
          // aspect: [4,3],
          quality: 0.8,
          // base64: true,
        });
  
        console.log(result);
  
        if (!result.cancelled) {
          // setImage(result.uri);
          // setImageW(result.width);
          // setImageH(result.height);
  
          setImage([result.uri])
        }
        // console.log("Image state: ", image)
      };

  return (
    <FlatList 
    style={{width: '100%', backgroundColor: 'pink', flex: 1}}
        data={image}
        renderItem={({item}) => {
            <Image source={{uri: item.uri}} 
                style={{width: item.width/3, height: item.height /3 }}
            />
        }}
        contentContainerStyle={{marginVertical: 50,paddingBottom: 100, flex: 1, backgroundColor: 'pink'}}
        keyExtractor={(item) => item.uri}
    />
  )
}
