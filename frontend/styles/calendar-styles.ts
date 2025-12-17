import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 26,
  },
  headerWrapper: {
    alignItems: "center",
    marginBottom: 8,
  },
  depText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  toggleRow: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 99,
    padding: 4,
    marginBottom: 12,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 99,
  },
  toggleButtonActivate: {
    backgroundColor: Colors.primaryBlue,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textMuted,
  },
  toggleButtonTextActivate: {
    color: Colors.text,
    fontWeight: "700",
  },

  listWrapper: {
    flex: 1,
    marginTop: 4,
  }, 
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLightBlue,
    backgroundColor: Colors.primaryBlue,
  },
  listRowAbsent: {
    backgroundColor: Colors.red
  },
  listRowSelected: {
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
  },
  listDayNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
    width: 30,
  },
  listAbsenceLabel: {
    marginTop: 4,
    fontSize: 10, 
    fontWeight: "600",
    color: Colors.text,
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
  },
  listEventText: {
    fontSize: 12,
    color: Colors.text,
  },
  actionRow: {
    marginTop: 16,
    gap: 8,
  },
  absenceButton: {
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: Colors.green,
    paddingHorizontal: 25,
    paddingVertical: 10, 
    borderRadius: 99,
  },
  absenceButtonText: {
    fontWeight: "600",
    fontSize: 12,
    color: "#111827"
  },
  secondaryButton: {
    marginTop: 8,
    alignSelf: "center",
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 20,
    paddingVertical: 8, 
    borderRadius: 99,
  },
  secondaryButtonText: {
    fontWeight: "600",
    fontSize: 12, 
    color: Colors.text,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "auto",
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    padding: 6,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 12,
    color: Colors.text,
  },
  modalBody: {
    fontSize: 8,
    color: Colors.textMuted,
    marginBottom: 18,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 6,
  },
  modalButton: {
    width: 60,
    height: 60,
    borderRadius: 12, 
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonConfirm: {
    backgroundColor: Colors.green,
  },
  modalButtonCancel: {
    backgroundColor: Colors.red,
  },
  modalButtonIcon: {
    fontSize: 28,
  },
  eventInput: {
    minHeight: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    color: Colors.text,
  },
  eventPreview: {
    marginTop: 12,
    marginHorizontal: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.primaryLightBlue,
  },
  eventPreviewTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  eventPreviewBody: {
    fontSize: 12,
    color: Colors.text,
  },
 });