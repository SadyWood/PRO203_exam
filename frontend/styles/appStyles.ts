import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { Shadows } from "./shadows";

export const AppStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,    
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
    color: Colors.text,
  },

  textMuted: {
    fontSize: 12,
    color: Colors.textMuted,
  },

  card: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  cardWhite: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    marginBottom: 12,
    ...Shadows.card,
  },
});
