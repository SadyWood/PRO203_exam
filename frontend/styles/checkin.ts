import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

const CARD_BG = "#BACEFF";

export const CheckinStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },

  grid: {
    paddingBottom: 32,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  childCard: {
    width: "30%",
    backgroundColor: CARD_BG,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    marginBottom: 12,
  },

  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  avatarInitial: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },

  childName: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 2,
  },

  statusLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupCard: {
    width: "80%",
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
  },

  popupHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  popupName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },

  popupAvatarCircle: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  popupAvatarInitial: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text,
  },

  popupButtons: {
    gap: 8,
  },

  popupButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },

  popupButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
});