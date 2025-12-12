import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { Shadows } from "./shadows";

export const EmployeeProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },

  headerCard: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    backgroundColor: "#FFFFFF",
    ...Shadows.card,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },

  headerRight: {
    flex: 1,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: Colors.text,
  },

  infoBox: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.text,
  },
});
