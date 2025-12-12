import { StyleSheet } from "react-native";

export const ChatStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerBox: {
    flex: 1,
    paddingVertical: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
    marginTop: 2,
  },

  messagesBox: {
    flex: 1,
    marginTop: 12,
  },

  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 24,
  },

  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    marginVertical: 6,
  },

  staffBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#4A6CF7",
  },

  parentBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#E9EDF5",
  },

  bubbleText: {
    fontSize: 14,
    lineHeight: 18,
  },

  staffText: { color: "white" },
  parentText: { color: "#111" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },

  chatInput: {
    flex: 1,
    minHeight: 44,
    borderRadius: 999,
    paddingHorizontal: 14,
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4A6CF7",
  },
});
