import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const ChildProfileStyles = StyleSheet.create({
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },

  headerTextBox: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
  },

  dateChip: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },

  sectionBox: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  listItem: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
});
