import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

// Shared calendar styles used by both parent and staff calendar views.
export const CalendarStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 26,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerWrapper: {
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  depText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  backButton: {
    padding: 4,
  },
  addButton: {
    padding: 4,
  },

  // Month navigation
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    textTransform: "capitalize",
    minWidth: 150,
    textAlign: "center",
  },

  // View mode toggle
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
  toggleButtonActive: {
    backgroundColor: Colors.primaryBlue,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textMuted,
  },
  toggleButtonTextActive: {
    color: Colors.text,
    fontWeight: "700",
  },

  // Selected date events preview
  selectedDateEvents: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  selectedDateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedDateTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    textTransform: "capitalize",
  },
  noEventsText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: "italic",
  },

  // Event items
  eventItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBlue,
  },
  eventItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  eventItemTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text,
  },
  eventItemTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  eventItemDesc: {
    fontSize: 11,
    color: Colors.text,
    marginTop: 2,
  },

  // List view
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
  listRowWithEvents: {
    backgroundColor: Colors.green,
  },
  listRowSpecial: {
    backgroundColor: Colors.yellow,
  },
  listRowAbsent: {
    backgroundColor: Colors.red,
  },
  listRowSelected: {
    borderWidth: 2,
    borderColor: Colors.text,
  },
  listDayNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    width: 30,
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
  },
  listEventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  listEventText: {
    fontSize: 12,
    color: Colors.text,
  },
  listAbsenceLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "600",
    color: Colors.text,
  },

  // Modal shared styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 16,
    textTransform: "capitalize",
  },
  modalBody: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 18,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 20,
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

  // Form inputs
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
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
  timeRow: {
    flexDirection: "row",
  },

  // Group selector
  groupSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  groupOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
  },
  groupOptionSelected: {
    backgroundColor: Colors.primaryBlue,
  },
  groupOptionText: {
    fontSize: 12,
    color: Colors.text,
  },

  // Switch row
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 8,
  },
  switchHint: {
    fontSize: 10,
    color: Colors.textMuted,
  },

  // Buttons
  deleteButton: {
    backgroundColor: Colors.red,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primaryBlue,
  },
  cancelButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.green,
  },
  saveButtonText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primaryBlue,
  },
  closeButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
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
    color: "#111827",
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

  // Template items
  templateItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLightBlue,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  templateDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Event preview (used in parent calendar)
  eventPreview: {
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.primaryLightBlue,
  },
  eventPreviewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
    textTransform: "capitalize",
  },
  eventPreviewBody: {
    fontSize: 12,
    color: Colors.text,
  },

  // Action row
  actionRow: {
    marginTop: 16,
    gap: 8,
  },
});

// Legacy export for backwards compatibility with parent calendar
export const styles = CalendarStyles;
