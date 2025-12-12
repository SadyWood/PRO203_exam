import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

export const InputStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 14,
  },

  disabled: {
    backgroundColor: "#F3F4F6",
    color: Colors.textMuted,
  },
  

  
});
