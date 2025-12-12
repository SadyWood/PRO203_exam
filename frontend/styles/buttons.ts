import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

export const ButtonStyles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  primary: {
    backgroundColor: Colors.primaryBlue,
  },

  danger: {
    backgroundColor: Colors.red,
  },

  neutral: {
    backgroundColor: "#E5E5E5",
  },

  textDark: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  textLight: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
