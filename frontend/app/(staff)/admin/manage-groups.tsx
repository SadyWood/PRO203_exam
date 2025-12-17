import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/colors";
import { getCurrentUser } from "@/services/authApi";
import { groupApi, staffApi, childrenApi } from "@/services/staffApi";
import type { GroupResponseDto, StaffResponseDto, ChildResponseDto } from "@/services/types/staff";
import type { UserResponseDto } from "@/services/types/auth";

export default function ManageGroupsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffResponseDto | null>(null);
  const [groups, setGroups] = useState<GroupResponseDto[]>([]);
  const [allStaff, setAllStaff] = useState<StaffResponseDto[]>([]);
  const [allChildren, setAllChildren] = useState<ChildResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupResponseDto | null>(null);
  const [groupName, setGroupName] = useState("");

  // Members modal state
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupResponseDto | null>(null);
  const [membersTab, setMembersTab] = useState<"children" | "staff">("children");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Check if user is BOSS
      if (currentUser?.role !== "BOSS") {
        Alert.alert("Ingen tilgang", "Du har ikke tilgang til denne siden.");
        router.back();
        return;
      }

      if (currentUser?.profileId) {
        const staff = await staffApi.getCurrentStaff(currentUser.profileId);
        setStaffProfile(staff);

        if (staff.kindergartenId) {
          try {
            const [groupsList, staffList, childrenList] = await Promise.all([
              groupApi.getGroupsByKindergarten(staff.kindergartenId),
              staffApi.getAllStaffAtKindergarten(),
              childrenApi.getAllChildren(),
            ]);

            // Fetch staffIds for each group
            const groupsWithStaff = await Promise.all(
              (groupsList || []).map(async (group) => {
                try {
                  const staffIds = await groupApi.getStaffInGroup(group.id);
                  return { ...group, staffIds };
                } catch {
                  return { ...group, staffIds: [] };
                }
              })
            );

            setGroups(groupsWithStaff);
            setAllStaff(staffList || []);
            setAllChildren(childrenList || []);
          } catch (err) {
            console.log("Feil ved uthenting av data:", err);
            setGroups([]);
          }
        }
      }
    } catch (err) {
      console.log("Feil ved lasting av data:", err);
      Alert.alert("Feil", "Kunne ikke laste grupper.");
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingGroup(null);
    setGroupName("");
    setShowModal(true);
  }

  function openEditModal(group: GroupResponseDto) {
    setEditingGroup(group);
    setGroupName(group.name);
    setShowModal(true);
  }

  async function handleSaveGroup() {
    if (!groupName.trim()) {
      Alert.alert("Feil", "Gruppenavn er påkrevd.");
      return;
    }

    if (!staffProfile?.kindergartenId) {
      Alert.alert("Feil", "Kunne ikke finne barnehage.");
      return;
    }

    setSaving(true);
    try {
      if (editingGroup) {
        // Update existing group
        await groupApi.updateGroup(editingGroup.id, { name: groupName.trim() });
        Alert.alert("Suksess", "Gruppen er oppdatert.");
      } else {
        // Create new group
        await groupApi.createGroup({
          name: groupName.trim(),
          kindergartenId: staffProfile.kindergartenId,
        });
        Alert.alert("Suksess", "Gruppen er opprettet.");
      }
      setShowModal(false);
      loadData(); // Reload groups
    } catch (err: any) {
      console.log("Feil ved lagring:", err);
      Alert.alert("Feil", err?.message || "Kunne ikke lagre gruppen.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteGroup(group: GroupResponseDto) {
    Alert.alert(
      "Slett gruppe",
      `Er du sikker på at du vil slette "${group.name}"?`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Slett",
          style: "destructive",
          onPress: async () => {
            try {
              await groupApi.deleteGroup(group.id);
              Alert.alert("Suksess", "Gruppen er slettet.");
              loadData();
            } catch (err: any) {
              Alert.alert("Feil", err?.message || "Kunne ikke slette gruppen.");
            }
          },
        },
      ]
    );
  }

  function openMembersModal(group: GroupResponseDto) {
    setSelectedGroup(group);
    setMembersTab("children");
    setShowMembersModal(true);
  }

  async function handleAssignChild(childId: string) {
    if (!selectedGroup) return;
    try {
      await groupApi.assignChildToGroup(selectedGroup.id, childId);
      loadData();
    } catch (err: any) {
      Alert.alert("Feil", err?.message || "Kunne ikke legge til barnet.");
    }
  }

  async function handleRemoveChild(childId: string) {
    if (!selectedGroup) return;
    try {
      await groupApi.removeChildFromGroup(selectedGroup.id, childId);
      loadData();
    } catch (err: any) {
      Alert.alert("Feil", err?.message || "Kunne ikke fjerne barnet.");
    }
  }

  async function handleAssignStaff(staffId: string) {
    if (!selectedGroup) return;
    try {
      await groupApi.assignStaffToGroup(selectedGroup.id, staffId, false);
      loadData();
    } catch (err: any) {
      Alert.alert("Feil", err?.message || "Kunne ikke legge til ansatt.");
    }
  }

  async function handleRemoveStaff(staffId: string) {
    if (!selectedGroup) return;
    try {
      await groupApi.removeStaffFromGroup(selectedGroup.id, staffId);
      loadData();
    } catch (err: any) {
      Alert.alert("Feil", err?.message || "Kunne ikke fjerne ansatt.");
    }
  }

  // Get children assigned to current group
  const childrenInGroup = allChildren.filter(c => c.groupId === selectedGroup?.id);
  const childrenNotInGroup = allChildren.filter(c => c.groupId !== selectedGroup?.id);

  // Get staff assigned to current group (from group's staffIds)
  const staffInGroup = allStaff.filter(s => selectedGroup?.staffIds?.includes(s.id));
  const staffNotInGroup = allStaff.filter(s => !selectedGroup?.staffIds?.includes(s.id));

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Administrer grupper</Text>
        <Pressable onPress={openCreateModal} style={styles.addButton}>
          <Ionicons name="add" size={24} color={Colors.primaryBlue} />
        </Pressable>
      </View>

      {/* Groups List */}
      <ScrollView style={styles.listContainer}>
        {groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Ingen grupper funnet</Text>
            <Text style={styles.emptySubtext}>Trykk + for å opprette en gruppe</Text>
          </View>
        ) : (
          groups.map((group) => {
            const childCount = allChildren.filter(c => c.groupId === group.id).length;
            const staffCount = group.staffIds?.length ?? 0;
            return (
              <View key={group.id} style={styles.groupCard}>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupStats}>
                    {childCount} barn, {staffCount} ansatte
                  </Text>
                </View>
                <View style={styles.groupActions}>
                  <Pressable
                    onPress={() => openMembersModal(group)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="people-outline" size={20} color={Colors.primaryBlue} />
                  </Pressable>
                  <Pressable
                    onPress={() => openEditModal(group)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="pencil-outline" size={20} color={Colors.primaryBlue} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteGroup(group)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#B91C1C" />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingGroup ? "Rediger gruppe" : "Ny gruppe"}
              </Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </Pressable>
            </View>

            <Text style={styles.label}>Gruppenavn *</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="F.eks. Avdeling Bjørn"
              placeholderTextColor={Colors.textMuted}
            />

            <Pressable
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSaveGroup}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editingGroup ? "Oppdater" : "Opprett"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Members Modal */}
      <Modal
        visible={showMembersModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMembersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: "80%" }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedGroup?.name} - Medlemmer
              </Text>
              <Pressable onPress={() => setShowMembersModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </Pressable>
            </View>

            {/* Tab buttons */}
            <View style={styles.tabRow}>
              <Pressable
                style={[styles.tabButton, membersTab === "children" && styles.tabButtonActive]}
                onPress={() => setMembersTab("children")}
              >
                <Text style={[styles.tabButtonText, membersTab === "children" && styles.tabButtonTextActive]}>
                  Barn
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tabButton, membersTab === "staff" && styles.tabButtonActive]}
                onPress={() => setMembersTab("staff")}
              >
                <Text style={[styles.tabButtonText, membersTab === "staff" && styles.tabButtonTextActive]}>
                  Ansatte
                </Text>
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {membersTab === "children" ? (
                <>
                  {/* Children in group */}
                  <Text style={styles.sectionLabel}>I gruppen:</Text>
                  {childrenInGroup.length === 0 ? (
                    <Text style={styles.emptyListText}>Ingen barn i gruppen</Text>
                  ) : (
                    childrenInGroup.map((child) => (
                      <View key={child.id} style={styles.memberRow}>
                        <Text style={styles.memberName}>
                          {child.firstName} {child.lastName}
                        </Text>
                        <Pressable onPress={() => handleRemoveChild(child.id)}>
                          <Ionicons name="remove-circle-outline" size={24} color="#B91C1C" />
                        </Pressable>
                      </View>
                    ))
                  )}

                  {/* Children not in group */}
                  <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Legg til:</Text>
                  {childrenNotInGroup.length === 0 ? (
                    <Text style={styles.emptyListText}>Alle barn er allerede i en gruppe</Text>
                  ) : (
                    childrenNotInGroup.map((child) => (
                      <View key={child.id} style={styles.memberRow}>
                        <Text style={styles.memberName}>
                          {child.firstName} {child.lastName}
                        </Text>
                        <Pressable onPress={() => handleAssignChild(child.id)}>
                          <Ionicons name="add-circle-outline" size={24} color={Colors.primaryBlue} />
                        </Pressable>
                      </View>
                    ))
                  )}
                </>
              ) : (
                <>
                  {/* Staff in group */}
                  <Text style={styles.sectionLabel}>I gruppen:</Text>
                  {staffInGroup.length === 0 ? (
                    <Text style={styles.emptyListText}>Ingen ansatte i gruppen</Text>
                  ) : (
                    staffInGroup.map((staff) => (
                      <View key={staff.id} style={styles.memberRow}>
                        <Text style={styles.memberName}>
                          {staff.firstName} {staff.lastName}
                        </Text>
                        <Pressable onPress={() => handleRemoveStaff(staff.id)}>
                          <Ionicons name="remove-circle-outline" size={24} color="#B91C1C" />
                        </Pressable>
                      </View>
                    ))
                  )}

                  {/* Staff not in group */}
                  <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Legg til:</Text>
                  {staffNotInGroup.length === 0 ? (
                    <Text style={styles.emptyListText}>Alle ansatte er allerede i gruppen</Text>
                  ) : (
                    staffNotInGroup.map((staff) => (
                      <View key={staff.id} style={styles.memberRow}>
                        <Text style={styles.memberName}>
                          {staff.firstName} {staff.lastName}
                        </Text>
                        <Pressable onPress={() => handleAssignStaff(staff.id)}>
                          <Ionicons name="add-circle-outline" size={24} color={Colors.primaryBlue} />
                        </Pressable>
                      </View>
                    ))
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  addButton: {
    padding: 4,
  },
  listContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  groupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  groupStats: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  groupActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    color: Colors.text,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primaryLightBlue,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: Colors.primaryBlue,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  tabButtonTextActive: {
    color: "#fff",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyListText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: "italic",
    marginBottom: 8,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
  },
  memberName: {
    fontSize: 14,
    color: Colors.text,
  },
});
