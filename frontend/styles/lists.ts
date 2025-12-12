import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

export const ListStyles = StyleSheet.create({
  item: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },

  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },

  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
