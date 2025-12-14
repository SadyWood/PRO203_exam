import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { Shadows } from "./shadows";

export const ChildProfileStyles = StyleSheet.create({
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
  
  text: {
    fontSize: 14,
    color: Colors.text,
  },
  
  textMuted: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
    color: Colors.text,
  },
  
  btnBase: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    marginTop: 14,
  },
  
  btnNeutral: {
    backgroundColor: "#E5E7EB",
  },
  
  btnTextDark: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.card,
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
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
  },

  dateChip: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  dateText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.text,
  },

  sectionBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.soft,
  },

  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },

  listItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
