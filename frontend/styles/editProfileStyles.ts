import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { Shadows } from "./shadows";

export const EditProfileStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.textMuted,
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 10,
    ...Shadows.soft,
  },

  inputDisabled: {
    backgroundColor: "#F3F4F6",
    color: Colors.textMuted,
  },

  btnBase: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    marginTop: 10,
  },

  btnPrimary: {
    backgroundColor: Colors.primaryBlue,
  },

  btnDanger: {
    backgroundColor: "#DC2626",
  },

  btnTextDark: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  btnTextLight: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
