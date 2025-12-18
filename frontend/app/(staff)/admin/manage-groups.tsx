import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useCallback } from "react";
import { Colors } from "@/constants/colors";
import { getCurrentUser } from "@/services/authApi";
import { groupApi, staffApi, childrenApi } from "@/services/staffApi";
import { AdminStyles } from "@/styles";
import type { GroupResponseDto, StaffResponseDto, ChildResponseDto } from "@/services/types/staff";
import type { UserResponseDto } from "@/services/types/auth";

// Manage Groups Screen - Create, edit and delete groups, set child capacity limit for groups. Add/remove children from groups.

export default function ManageGroupsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffResponseDto | null>(null);
  const [groups, setGroups] = useState<GroupResponseDto[]>([]);
  const [allStaff, setAllStaff] = useState<StaffResponseDto[]>([]);
  const [allChildren, setAllChildren] = useState<ChildResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state for create/edit group
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupResponseDto | null>(null);
  const [groupName, setGroupName] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");

  // Members modal state
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupResponseDto | null>(null);
  const [membersTab, setMembersTab] = useState<"children" | "staff">("children");

  // Local state for members modal to enable dynamic updates
  const [modalChildren, setModalChildren] = useState<ChildResponseDto[]>([]);
  const [modalStaffIds, setModalStaffIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

 // Load all data needed for this screen
  async function loadData() {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Only BOSS can access this screen
      if (currentUser?.role !== "BOSS") {
        Alert.alert("Ingen tilgang", "Du har ikke tilgang til denne siden.");
        router.back();
        return;
      }

      if (currentUser?.profileId) {
        const staff = await staffApi.getCurrentStaff(currentUser.profileId);
        setStaffProfile(staff);

        if (staff.kindergartenId) {
          await loadGroupsAndMembers(staff.kindergartenId, currentUser.profileId);
        }
      }
    } catch (err) {
      console.log("Feil ved lasting av data:", err);
      Alert.alert("Feil", "Kunne ikke laste grupper.");
    } finally {
      setLoading(false);
    }
  }

// Load group and members data
  async function loadGroupsAndMembers(kindergartenId: string, bossProfileId: string) {
    try {
      const [groupsList, staffList, childrenList] = await Promise.all([
        groupApi.getGroupsByKindergarten(kindergartenId),
        staffApi.getAllStaffAtKindergarten(),
        childrenApi.getAllChildren(),
      ]);

      // Fetch staffIds for each group to show accurate counts
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
      // Filter out BOSS user - they should not be assigned to groups
      const nonBossStaff = (staffList || []).filter(s => s.id !== bossProfileId);
      setAllStaff(nonBossStaff);
      setAllChildren(childrenList || []);
    } catch (err) {
      console.log("Feil ved uthenting av data:", err);
      setGroups([]);
    }
  }

  // Open modal to create a new group
  function openCreateModal() {
    setEditingGroup(null);
    setGroupName("");
    setMaxCapacity("");
    setShowModal(true);
  }

  // Open modal to edit an existing group
  function openEditModal(group: GroupResponseDto) {
    setEditingGroup(group);
    setGroupName(group.name);
    setMaxCapacity(group.maxCapacity?.toString() || "");
    setShowModal(true);
  }

  /** Delete a group with confirmation */
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

  // save group
    async function handleSaveGroup() {
        if (!groupName.trim()) {
            Alert.alert("Feil", "Gruppenavn er påkrevd.");
            return;
        }

        if (!staffProfile?.kindergartenId) {
            Alert.alert("Feil", "Kunne ikke finne barnehage.");
            return;
        }

        // Parse maxCapacity
        const capacity = maxCapacity.trim() ? parseInt(maxCapacity.trim(), 10) : undefined;
        if (maxCapacity.trim() && (isNaN(capacity!) || capacity! < 1)) {
            Alert.alert("Feil", "Kapasitet må være et positivt tall.");
            return;
        }

        setSaving(true);
        try {
            if (editingGroup) {
                await groupApi.updateGroup(editingGroup.id, {
                    name: groupName.trim(),
                    maxCapacity: capacity,
                });
                Alert.alert("Suksess", "Gruppen er oppdatert.");
            } else {
                await groupApi.createGroup({
                    name: groupName.trim(),
                    kindergartenId: staffProfile.kindergartenId,
                    maxCapacity: capacity,
                });
                Alert.alert("Suksess", "Gruppen er opprettet.");
            }
            setShowModal(false);
            loadData();
        } catch (err: any) {
            console.log("Feil ved lagring:", err);
            Alert.alert("Feil", err?.message || "Kunne ikke lagre gruppen.");
        } finally {
            setSaving(false);
        }
    }

  // Open members modal for a group
  async function openMembersModal(group: GroupResponseDto) {
    setSelectedGroup(group);
    setMembersTab("children");

    // Initialize local state with current data
    setModalChildren([...allChildren]);

    // Fetch fresh staff IDs for this group
    try {
      const staffIds = await groupApi.getStaffInGroup(group.id);
      setModalStaffIds(staffIds || []);
    } catch {
      setModalStaffIds(group.staffIds || []);
    }

    setShowMembersModal(true);
  }

  // Assign child to group - updates local state immediately
  async function handleAssignChild(childId: string) {
    if (!selectedGroup) return;

    // Check capacity before assigning
    const currentCount = modalChildren.filter(c => c.groupId === selectedGroup.id).length;
    if (selectedGroup.maxCapacity && currentCount >= selectedGroup.maxCapacity) {
      Alert.alert("Kapasitet full", `Gruppen har nådd maks kapasitet (${selectedGroup.maxCapacity} barn).`);
      return;
    }

    try {
      await groupApi.assignChildToGroup(selectedGroup.id, childId);
      // Update local state immediately for dynamic feedback
      setModalChildren(prev =>
        prev.map(c => c.id === childId ? { ...c, groupId: selectedGroup.id } : c)
      );
    } catch (err: any) {
      Alert.alert("Feil", err?.message || "Kunne ikke legge til barnet.");
    }
  }

// Close members modal and refresh main data
    function closeMembersModal() {
        setShowMembersModal(false);
        setSelectedGroup(null);
        loadData(); // Refresh to get updated counts
    }

// Remove child from group - updates local state immediately
  async function handleRemoveChild(childId: string) {
    if (!selectedGroup) return;
    try {
      await groupApi.removeChildFromGroup(selectedGroup.id, childId);
      // Update local state immediately for dynamic feedback
      setModalChildren(prev =>
        prev.map(c => c.id === childId ? { ...c, groupId: undefined } : c)
      );
    } catch (err: any) {
      Alert.alert("Feil", err?.message || "Kunne ikke fjerne barnet.");
    }
  }

// Assign staff to group - updates local state immediately
  async function handleAssignStaff(staffId: string) {
    if (!selectedGroup) return;
    try {
      await groupApi.assignStaffToGroup(selectedGroup.id, staffId, false);
      // Update local state immediately for dynamic feedback
      setModalStaffIds(prev => [...prev, staffId]);
    } catch (err: any) {
      Alert.alert("Feil", err?.message || "Kunne ikke legge til ansatt.");
    }
  }

// Remove staff from group - updates local state immediately
  async function handleRemoveStaff(staffId: string) {
    if (!selectedGroup) return;
    try {
      await groupApi.removeStaffFromGroup(selectedGroup.id, staffId);
      // Update local state immediately for dynamic feedback
      setModalStaffIds(prev => prev.filter(id => id !== staffId));
    } catch (err: any) {
      Alert.alert("Feil", err?.message || "Kunne ikke fjerne ansatt.");
    }
  }

  // Computed values for members modal
  const childrenInGroup = modalChildren.filter(c => c.groupId === selectedGroup?.id);
  const childrenNotInGroup = modalChildren.filter(c => !c.groupId || c.groupId !== selectedGroup?.id);
  const staffInGroup = allStaff.filter(s => modalStaffIds.includes(s.id));
  const staffNotInGroup = allStaff.filter(s => !modalStaffIds.includes(s.id));

  if (loading) {
    return (
      <View style={[AdminStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={AdminStyles.container}>
      {/* Header with back button and add button */}
      <View style={AdminStyles.header}>
        <Pressable onPress={() => router.replace("/(staff)/admin/administration")} style={AdminStyles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={AdminStyles.title}>Administrer grupper</Text>
        <Pressable onPress={openCreateModal} style={AdminStyles.addButton}>
          <Ionicons name="add" size={24} color={Colors.primaryBlue} />
        </Pressable>
      </View>

      {/* Groups List */}
      <ScrollView style={AdminStyles.listContainer}>
        {groups.length === 0 ? (
          <View style={AdminStyles.emptyState}>
            <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
            <Text style={AdminStyles.emptyText}>Ingen grupper funnet</Text>
            <Text style={AdminStyles.emptySubtext}>Trykk + for å opprette en gruppe</Text>
          </View>
        ) : (
          groups.map((group) => {
            const childCount = allChildren.filter(c => c.groupId === group.id).length;
            const staffCount = group.staffIds?.length ?? 0;
            const capacityText = group.maxCapacity
              ? `${childCount}/${group.maxCapacity} barn`
              : `${childCount} barn`;
            const isAtCapacity = group.maxCapacity != null && group.maxCapacity > 0 && childCount >= group.maxCapacity;

            return (
              <View key={group.id} style={[AdminStyles.card, { justifyContent: "space-between" }]}>
                <View style={AdminStyles.cardInfo}>
                  <Text style={AdminStyles.cardTitle}>{group.name}</Text>
                  <Text style={[
                    AdminStyles.cardSubtitle,
                    isAtCapacity ? { color: "#B91C1C" } : null
                  ]}>
                    {capacityText}, {staffCount} ansatte
                  </Text>
                </View>
                <View style={AdminStyles.cardActions}>
                  {/* Members button */}
                  <Pressable
                    onPress={() => openMembersModal(group)}
                    style={AdminStyles.actionButton}
                  >
                    <Ionicons name="people-outline" size={20} color={Colors.primaryBlue} />
                  </Pressable>
                  {/* Edit button */}
                  <Pressable
                    onPress={() => openEditModal(group)}
                    style={AdminStyles.actionButton}
                  >
                    <Ionicons name="pencil-outline" size={20} color={Colors.primaryBlue} />
                  </Pressable>
                  {/* Delete button */}
                  <Pressable
                    onPress={() => handleDeleteGroup(group)}
                    style={AdminStyles.actionButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#B91C1C" />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Create/Edit Group Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={AdminStyles.modalOverlay}>
          <View style={AdminStyles.modalContent}>
            <View style={AdminStyles.modalHeader}>
              <Text style={AdminStyles.modalTitle}>
                {editingGroup ? "Rediger gruppe" : "Ny gruppe"}
              </Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </Pressable>
            </View>

            <Text style={AdminStyles.label}>Gruppenavn *</Text>
            <TextInput
              style={AdminStyles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="F.eks. Avdeling Bjørn"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={AdminStyles.label}>Maks antall barn (valgfritt)</Text>
            <TextInput
              style={AdminStyles.input}
              value={maxCapacity}
              onChangeText={setMaxCapacity}
              placeholder="F.eks. 18"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
            />

            <Pressable
              style={[AdminStyles.saveButton, saving && AdminStyles.saveButtonDisabled]}
              onPress={handleSaveGroup}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={AdminStyles.saveButtonText}>
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
        onRequestClose={closeMembersModal}
      >
        <View style={AdminStyles.modalOverlay}>
          <View style={[AdminStyles.modalContent, { maxHeight: "80%" }]}>
            <View style={AdminStyles.modalHeader}>
              <Text style={AdminStyles.modalTitle}>
                {selectedGroup?.name} - Medlemmer
              </Text>
              <Pressable onPress={closeMembersModal}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </Pressable>
            </View>

            {/* Capacity indicator */}
            {selectedGroup?.maxCapacity && (
              <View style={{
                backgroundColor: childrenInGroup.length >= selectedGroup.maxCapacity
                  ? "#FEE2E2"
                  : Colors.primaryLightBlue,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                marginBottom: 12,
              }}>
                <Text style={{
                  fontSize: 13,
                  color: childrenInGroup.length >= selectedGroup.maxCapacity
                    ? "#B91C1C"
                    : Colors.text,
                  textAlign: "center",
                }}>
                  Kapasitet: {childrenInGroup.length}/{selectedGroup.maxCapacity} barn
                </Text>
              </View>
            )}

            {/* Tab buttons */}
            <View style={AdminStyles.tabRow}>
              <Pressable
                style={[AdminStyles.tabButton, membersTab === "children" && AdminStyles.tabButtonActive]}
                onPress={() => setMembersTab("children")}
              >
                <Text style={[AdminStyles.tabButtonText, membersTab === "children" && AdminStyles.tabButtonTextActive]}>
                  Barn
                </Text>
              </Pressable>
              <Pressable
                style={[AdminStyles.tabButton, membersTab === "staff" && AdminStyles.tabButtonActive]}
                onPress={() => setMembersTab("staff")}
              >
                <Text style={[AdminStyles.tabButtonText, membersTab === "staff" && AdminStyles.tabButtonTextActive]}>
                  Ansatte
                </Text>
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {membersTab === "children" ? (
                <>
                  {/* Children in group */}
                  <Text style={AdminStyles.sectionLabel}>I gruppen:</Text>
                  {childrenInGroup.length === 0 ? (
                    <Text style={AdminStyles.emptyListText}>Ingen barn i gruppen</Text>
                  ) : (
                    childrenInGroup.map((child) => (
                      <View key={child.id} style={AdminStyles.memberRow}>
                        <Text style={AdminStyles.memberName}>
                          {child.firstName} {child.lastName}
                        </Text>
                        <Pressable onPress={() => handleRemoveChild(child.id)}>
                          <Ionicons name="remove-circle-outline" size={24} color="#B91C1C" />
                        </Pressable>
                      </View>
                    ))
                  )}

                  {/* Children not in group */}
                  <Text style={[AdminStyles.sectionLabel, { marginTop: 16 }]}>Legg til:</Text>
                  {childrenNotInGroup.length === 0 ? (
                    <Text style={AdminStyles.emptyListText}>Alle barn er allerede i en gruppe</Text>
                  ) : (
                    childrenNotInGroup.map((child) => (
                      <View key={child.id} style={AdminStyles.memberRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={AdminStyles.memberName}>
                            {child.firstName} {child.lastName}
                          </Text>
                          {child.groupName && (
                            <Text style={{ fontSize: 11, color: Colors.textMuted }}>
                              Nå i: {child.groupName}
                            </Text>
                          )}
                        </View>
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
                  <Text style={AdminStyles.sectionLabel}>I gruppen:</Text>
                  {staffInGroup.length === 0 ? (
                    <Text style={AdminStyles.emptyListText}>Ingen ansatte i gruppen</Text>
                  ) : (
                    staffInGroup.map((staff) => (
                      <View key={staff.id} style={AdminStyles.memberRow}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <Text style={AdminStyles.memberName}>
                            {staff.firstName} {staff.lastName}
                          </Text>
                          {staff.isAdmin && (
                            <View style={AdminStyles.adminBadge}>
                              <Text style={AdminStyles.adminBadgeText}>Admin</Text>
                            </View>
                          )}
                        </View>
                        <Pressable onPress={() => handleRemoveStaff(staff.id)}>
                          <Ionicons name="remove-circle-outline" size={24} color="#B91C1C" />
                        </Pressable>
                      </View>
                    ))
                  )}

                  {/* Staff not in group */}
                  <Text style={[AdminStyles.sectionLabel, { marginTop: 16 }]}>Legg til:</Text>
                  {staffNotInGroup.length === 0 ? (
                    <Text style={AdminStyles.emptyListText}>Alle ansatte er allerede i gruppen</Text>
                  ) : (
                    staffNotInGroup.map((staff) => (
                      <View key={staff.id} style={AdminStyles.memberRow}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <Text style={AdminStyles.memberName}>
                            {staff.firstName} {staff.lastName}
                          </Text>
                          {staff.isAdmin && (
                            <View style={AdminStyles.adminBadge}>
                              <Text style={AdminStyles.adminBadgeText}>Admin</Text>
                            </View>
                          )}
                        </View>
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
