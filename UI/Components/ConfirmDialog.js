import React, { useState } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";

export default function ConfirmDialog(props) {
    // const [showBox, setShowBox] = useState(true);
  return Alert.alert(
      "Create Account?",
      "By clicking confirm, your account will be registered and no further changes can be made upon registration",
      [
        // The "Yes" button
        {
          text: "Confirm",
          onPress: () => {
            // props.showDialog(false);
            console.log("create account: confirm")
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "Cancel",
          onPress: () => {
            // props.setShowBox(false);
            console.log("create account: cancel")
          },
        },
      ]
    );
}
