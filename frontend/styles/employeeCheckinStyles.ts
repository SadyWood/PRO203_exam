import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const EmployeeCheckinStyles = StyleSheet.create({
  /* Layout */
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },

  /* Header */
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },

  grid: {
    paddingBottom: 40,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  
  childCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
  
    width: "31%",
  },
  
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLightBlue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  avatarInitial: {
    fontWeight: "700",
    color: Colors.primaryBlue,
  },

  childName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },

  statusLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },

  /* Overlay / popup */
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "85%",
  },

  popupHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  popupName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },

  popupAvatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLightBlue,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  popupAvatarInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primaryBlue,
  },

  popupButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  popupButton: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.primaryLightBlue,
    marginBottom: 8,
    flexBasis: "48%",
    alignItems: "center",
  },

  popupButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
  },
});
