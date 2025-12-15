import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { Shadows } from "./shadows";

export const ParentMessagesStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 12,
  },

  listContent: {
    paddingBottom: 24,
  },

  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Shadows.soft,
  },

  itemLeft: {
    flex: 1,
    paddingRight: 10,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
  },

  itemSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },

  preview: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },

  badge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primaryBlue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  badgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
});
