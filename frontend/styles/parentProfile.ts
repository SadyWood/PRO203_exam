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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.card,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
  },

  nameContainer: {
    flex: 1,
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
    color: Colors.text,
  },

  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.soft,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    marginRight: 10,
  },

  infoText: {
    fontSize: 14,
    color: Colors.text,
  },

  childItem: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.soft,
  },

  childName: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
  },
  primaryBtn: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.soft,
  },
  
  primaryBtnNeutral: {
    backgroundColor: "#E5E7EB",
  },
  
  primaryBtnDanger: {
    backgroundColor: "#FEE2E2",
  },
  
  primaryBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  
  primaryBtnTextDanger: {
    color: "#B91C1C",
  },

  addButton: {
    backgroundColor: Colors.green,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },

  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },

  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },

  buttonMarginTop: {
    marginTop: 10,
  },
});
