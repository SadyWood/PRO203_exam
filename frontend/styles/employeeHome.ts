import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const  EmployeeHomeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  headerWrapper: {
    alignSelf: "center",
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 24,
  },
  appButtonText: {
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 0.5,
  },

  bhgTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: Colors.text,
  },

  primaryBtnDanger: {
    backgroundColor: "#FEE2E2",
  },
  
  primaryBtnTextDanger: {
    color: "#B91C1C",
  },
  
  primaryBtnNeutral: {
    backgroundColor: "#E5E7EB",
  },
  
  primaryBtnPrimary: {
    backgroundColor: "#DBEAFE",
  },
  
  employeeCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  employeeGreeting: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  employeeSub: {
    fontSize: 13,
    color: Colors.textMuted,
  },

  quickActionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  primaryBtn: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexBasis: "48%",
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    color: Colors.text,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  statusPillIn: {
    backgroundColor: "#DCFCE7",
  },
  statusPillOut: {
    backgroundColor: "#FEE2E2",
  },
  statusPillSick: {
    backgroundColor: "#FEE2E2",
  },
  statusPillVacation: {
    backgroundColor: "#E0F2FE",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotIn: {
    backgroundColor: "#16A34A",
  },
  statusDotOut: {
    backgroundColor: "#DC2626",
  },
  statusDotSick: {
    backgroundColor: "#DC2626",
  },
  statusDotVacation: {
    backgroundColor: "#0284C7",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusTextIn: {
    color: "#15803D",
  },
  statusTextOut: {
    color: "#B91C1C",
  },
  statusTextSick: {
    color: "#B91C1C",
  },
  statusTextVacation: {
    color: "#0369A1",
  },

  lastChangeText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },

  agendaCard: {
    marginBottom: 18,
  },
  agendaTitle: {
    fontWeight: "700",
    marginBottom: 4,
    color: Colors.text,
  },
  agendaBox: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  agendaDate: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    color: Colors.text,
  },
  agendaItem: {
    fontSize: 12,
    marginBottom: 2,
    color: Colors.text,
  },
});
