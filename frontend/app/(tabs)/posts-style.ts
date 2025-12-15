import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const postsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  backButton: {
    marginBottom: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 170,
  },

  textContainer: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  date: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textMuted,
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },

  arrow: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primaryBlue,
  },
});
