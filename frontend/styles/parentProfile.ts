import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { Shadows } from "./shadows";

export const ParentProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  profileCard: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
    ...Shadows.card,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: Colors.text,
  },

  infoBox: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    marginRight: 8,
  },

  infoText: {
    fontSize: 14,
    color: Colors.text,
  },

  childItem: {
    backgroundColor: Colors.primaryLightBlue,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  childName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
});
