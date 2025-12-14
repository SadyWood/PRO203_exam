import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import { Shadows } from "./shadows";

export const EmployeeChildrenStyles = StyleSheet.create({
  /* Layout */
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 12,
  },

  listContent: {
    paddingBottom: 40,
  },

  /* Child card */
  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
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
  },  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  statusPillIn: { backgroundColor: "#DCFCE7" },
  statusPillOut: { backgroundColor: "#FEE2E2" },
  statusPillVacation: { backgroundColor: "#E0F2FE" },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusDotIn: { backgroundColor: "#16A34A" },
  statusDotOut: { backgroundColor: "#DC2626" },
  statusDotVacation: { backgroundColor: "#0284C7" },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  statusTextIn: { color: "#15803D" },
  statusTextOut: { color: "#B91C1C" },
  statusTextVacation: { color: "#0369A1" },

  statusPillNone: { backgroundColor: "#F3F4F6" },

  statusDotNone: { backgroundColor: "#9CA3AF" },

  statusTextNone: { color: "#6B7280" },

  arrow: {
    fontSize: 16,
    color: Colors.textMuted,
  },
});
