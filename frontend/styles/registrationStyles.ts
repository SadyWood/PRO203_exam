import { StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

export const RegistrationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 8,
  },
  helpText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 8,
  },

  // Role selection
  roleButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primaryLightBlue,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: Colors.primaryBlue,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  roleButtonTextActive: {
    color: "#111827",
  },

  // Inputs
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderColor: Colors.primaryLightBlue,
    color: Colors.text,
    backgroundColor: "#fff",
  },

  // Date picker
  datePickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    borderColor: Colors.primaryLightBlue,
    backgroundColor: "#fff",
    justifyContent: "center",
    minHeight: 48,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  datePlaceholder: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  datePickerContainer: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 8,
    marginTop: 8,
    padding: 8,
  },

  // Kindergarten selection
  pickerContainer: {
    gap: 8,
  },
  kindergartenOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.primaryLightBlue,
    borderWidth: 2,
    borderColor: "transparent",
  },
  kindergartenOptionActive: {
    borderColor: Colors.primaryBlue,
    backgroundColor: "#fff",
  },
  kindergartenText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  kindergartenAddress: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },

  // Error and buttons
  error: {
    color: Colors.red,
    marginTop: 4,
    fontSize: 14,
  },
  button: {
    marginTop: 16,
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 16,
  },

  // Toggle for optional sections
  optionToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  optionToggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  optionToggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primaryLightBlue,
  },
  optionToggleButtonActive: {
    backgroundColor: Colors.green,
  },
  optionToggleButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },

  // Child form container
  childFormContainer: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },

  // Date input styles
  dateInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateInputWrapper: {
    flex: 1,
    alignItems: "center",
  },
  dateInputWrapperLarge: {
    flex: 1.5,
    alignItems: "center",
  },
  dateInputSmall: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderColor: Colors.primaryBlue,
    color: Colors.text,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  dateInputLarge: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderColor: Colors.primaryBlue,
    color: Colors.text,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  dateInputLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  dateSeparator: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  calendarButton: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarConfirmButton: {
    marginTop: 12,
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
