import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const ParentCheckinStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 16,
  },

  childCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  childTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMuted,
    marginBottom: 6,
  },
  childHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  childName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillIn: {
    backgroundColor: "#DCFCE7",
  },
  statusPillOut: {
    backgroundColor: "#FEE2E2",
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

  lastChangeText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 6,
    marginBottom: 10,
  },

  checkButton: {
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: "center",
    marginBottom: 8,
  },
  checkButtonIn: {
    backgroundColor: Colors.primaryBlue,
  },
  checkButtonOut: {
    backgroundColor: Colors.red,
  },
  checkButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  checkButtonTextIn: {
    color: "#111827",
  },
  checkButtonTextOut: {
    color: "#FFFFFF",
  },

  infoText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },

  errorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: "#B91C1C",
    fontWeight: "600",
  },
});
