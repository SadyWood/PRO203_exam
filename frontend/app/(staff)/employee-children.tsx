import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { EmployeeChildrenStyles } from "@/styles";
import { getCurrentUser } from "@/services/authApi";
import {
  staffApi,
  groupApi,
  childrenApi,
  GroupResponseDto,
  ChildResponseDto,
  StaffResponseDto,
} from "@/services/staffApi";
import type { UserResponseDto } from "@/services/types/auth";

type GroupWithMembers = GroupResponseDto & {
  children: ChildResponseDto[];
  staff: StaffResponseDto[];
};

export default function EmployeeChildrenScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffResponseDto | null>(null);
  const [groups, setGroups] = useState<GroupWithMembers[]>([]);
  const [myGroupIds, setMyGroupIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (!currentUser?.profileId) return;

      const staff = await staffApi.getCurrentStaff(currentUser.profileId);
      setStaffProfile(staff);

      if (!staff.kindergartenId) return;

      // Fetch groups, children, and all staff
      const [groupsList, childrenList, staffList] = await Promise.all([
        groupApi.getGroupsByKindergarten(staff.kindergartenId),
        childrenApi.getAllChildren(),
        staffApi.getAllStaffAtKindergarten(),
      ]);

      // Fetch staff assignments for each group and my groups
      const groupsWithMembers: GroupWithMembers[] = await Promise.all(
        (groupsList || []).map(async (group) => {
          let staffIds: string[] = [];
          try {
            staffIds = await groupApi.getStaffInGroup(group.id);
          } catch {
            staffIds = [];
          }

          const childrenInGroup = childrenList.filter(c => c.groupId === group.id);
          const staffInGroup = staffList.filter(s => staffIds.includes(s.id));

          return {
            ...group,
            children: childrenInGroup,
            staff: staffInGroup,
            staffIds,
          };
        })
      );

      setGroups(groupsWithMembers);

      // Find which groups the current staff belongs to
      const myGroups = groupsWithMembers
        .filter(g => g.staffIds?.includes(staff.id))
        .map(g => g.id);
      setMyGroupIds(myGroups);

      // Auto-expand user's groups
      const expanded: Record<string, boolean> = {};
      myGroups.forEach(id => { expanded[id] = true; });
      setExpandedGroups(expanded);

    } catch (err) {
      console.log("Feil ved lasting av data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const calculateAge = (birthDate?: string): string => {
    if (!birthDate) return "";
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} år`;
  };

  if (loading) {
    return (
      <View style={[EmployeeChildrenStyles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={EmployeeChildrenStyles.screen}>
      <View style={EmployeeChildrenStyles.container}>
        {/* Header */}
        <View style={EmployeeChildrenStyles.headerRow}>
          <Pressable onPress={() => router.back()} style={EmployeeChildrenStyles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </Pressable>
          <Text style={EmployeeChildrenStyles.title}>Avdelinger</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={EmployeeChildrenStyles.scrollContent}>
          {groups.length === 0 ? (
            <View style={EmployeeChildrenStyles.emptyState}>
              <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
              <Text style={EmployeeChildrenStyles.emptyText}>Ingen avdelinger funnet</Text>
            </View>
          ) : (
            groups.map((group) => {
              const isMyGroup = myGroupIds.includes(group.id);
              const isExpanded = expandedGroups[group.id];

              return (
                <View key={group.id} style={EmployeeChildrenStyles.groupCard}>
                  {/* Group Header */}
                  <Pressable
                    style={EmployeeChildrenStyles.groupHeader}
                    onPress={() => toggleGroup(group.id)}
                  >
                    <View style={EmployeeChildrenStyles.groupHeaderLeft}>
                      <Text style={EmployeeChildrenStyles.groupName}>{group.name}</Text>
                      {isMyGroup && (
                        <View style={EmployeeChildrenStyles.myGroupBadge}>
                          <Text style={EmployeeChildrenStyles.myGroupBadgeText}>Min avdeling</Text>
                        </View>
                      )}
                    </View>
                    <View style={EmployeeChildrenStyles.groupHeaderRight}>
                      <Text style={EmployeeChildrenStyles.groupCount}>
                        {group.children.length} barn, {group.staff.length} ansatte
                      </Text>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={Colors.textMuted}
                      />
                    </View>
                  </Pressable>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <View style={EmployeeChildrenStyles.groupContent}>
                      {/* Children Section */}
                      <Text style={EmployeeChildrenStyles.sectionLabel}>Barn</Text>
                      {group.children.length === 0 ? (
                        <Text style={EmployeeChildrenStyles.emptyListText}>Ingen barn i denne avdelingen</Text>
                      ) : (
                        group.children.map((child) => (
                          <Pressable
                            key={child.id}
                            style={EmployeeChildrenStyles.memberRow}
                            onPress={() => router.push(`/(staff)/child-detail/${child.id}`)}
                          >
                            <View style={EmployeeChildrenStyles.memberInfo}>
                              <Text style={EmployeeChildrenStyles.memberName}>
                                {child.firstName} {child.lastName}
                              </Text>
                              <Text style={EmployeeChildrenStyles.memberSubtext}>
                                {calculateAge(child.birthDate)}
                              </Text>
                            </View>
                            <View style={EmployeeChildrenStyles.memberRight}>
                              <View style={[
                                EmployeeChildrenStyles.statusPill,
                                child.checkedIn ? EmployeeChildrenStyles.statusPillIn : EmployeeChildrenStyles.statusPillOut
                              ]}>
                                <View style={[
                                  EmployeeChildrenStyles.statusDot,
                                  child.checkedIn ? EmployeeChildrenStyles.statusDotIn : EmployeeChildrenStyles.statusDotOut
                                ]} />
                                <Text style={[
                                  EmployeeChildrenStyles.statusText,
                                  child.checkedIn ? EmployeeChildrenStyles.statusTextIn : EmployeeChildrenStyles.statusTextOut
                                ]}>
                                  {child.checkedIn ? "Inne" : "Ute"}
                                </Text>
                              </View>
                              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                            </View>
                          </Pressable>
                        ))
                      )}

                      {/* Staff Section */}
                      <Text style={[EmployeeChildrenStyles.sectionLabel, { marginTop: 16 }]}>Ansatte</Text>
                      {group.staff.length === 0 ? (
                        <Text style={EmployeeChildrenStyles.emptyListText}>Ingen ansatte i denne avdelingen</Text>
                      ) : (
                        group.staff.map((staffMember) => (
                          <Pressable
                            key={staffMember.id}
                            style={EmployeeChildrenStyles.memberRow}
                            onPress={() => router.push(`/(staff)/staff-detail/${staffMember.id}`)}
                          >
                            <View style={EmployeeChildrenStyles.memberInfo}>
                              <Text style={EmployeeChildrenStyles.memberName}>
                                {staffMember.firstName} {staffMember.lastName}
                              </Text>
                              <Text style={EmployeeChildrenStyles.memberSubtext}>
                                {staffMember.position || "Ansatt"}
                              </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                          </Pressable>
                        ))
                      )}
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}
