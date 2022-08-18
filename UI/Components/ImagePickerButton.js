import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Text, Image } from "react-native";

import * as ImagePicker from "expo-image-picker";

export default function ImagePickerButton(props) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      props.changeWord(result.uri);
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#c4c4c4",
        paddingVertical: 8,
        alignItems: "center",
        marginTop: 15,
        borderRadius: 5,
      }}
      onPress={pickImage}
    >
      <Text style={{ fontWeight: "bold" }}>Attach photos here</Text>
    </TouchableOpacity>
  );
}
