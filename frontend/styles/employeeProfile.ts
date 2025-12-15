import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const EmployeeProfileStyles = StyleSheet.create({
  /* Layout */
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  /* Header */
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    marginBottom: 20,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
  },

  headerRight: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },

  /* Seksjoner */
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    color: Colors.text,
  },

  /* Kontaktinfo */
  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    padding: 14,
    marginBottom: 24,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.text,
  },

  /* Knapper (samme mønster som employeeHome) */
  primaryBtn: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  primaryBtnPrimary: {
    backgroundColor: "#DBEAFE",
  },

  primaryBtnDanger: {
    backgroundColor: "#FEE2E2",
  },

  primaryBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },

  primaryBtnTextDanger: {
    color: "#B91C1C",
  },
});
