import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { Shadows } from "./shadows";

export const ChildEditStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  scrollContent: {
    paddingBottom: 32,
  },

  backButton: {
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
    color: Colors.text,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 10,
    color: Colors.text,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.soft,
  },

  label: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
    marginTop: 6,
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  switchLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },

  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
  },

  errorText: {
    fontSize: 12,
    color: "#B91C1C",
    fontWeight: "600",
  },

  saveButton: {
    marginTop: 16,
    alignSelf: "center",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: Colors.primaryBlue,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: "900",
    color: Colors.text,
  },
});
