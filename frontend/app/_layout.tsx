import {useEffect, useState} from "react";
import {Stack, useRouter, useSegments} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserResponseDto } from "@/services/types/auth";

let globalAuthRefresh:(() => Promise<void>) | null = null;

export function authRefresh(){
    return globalAuthRefresh?.();
}
export default function RootLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const segments = useSegments();
    const router = useRouter();

    async function checkAuth(){
        try{
            const token = await AsyncStorage.getItem("authToken");
            const userStr = await AsyncStorage.getItem("currentUser");

            if (token && userStr) {
                const user: UserResponseDto = JSON.parse(userStr);
                setUserRole(user.role);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(!!token);
                setUserRole(null);
            }
        }catch (error){
            console.error("Error checking auth:", error);
            setIsAuthenticated(false);
            setUserRole(null);
        }
    }

    useEffect(() => {
        globalAuthRefresh = checkAuth;
        return () => {
            globalAuthRefresh = null;
        };
    }, [checkAuth]);

    useEffect(() => {
        void checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isAuthenticated === null) return;
        const inAuthGroup = segments[0] === "(auth)";
        const isRegistrationScreen = segments.includes("registration");
        const isPersonvernScreen = segments.includes("personvern");
        const inStaffGroup = segments[0] === "(staff)";
        const inTabsGroup = segments[0] === "(tabs)";

        console.log("Auth state:", isAuthenticated, "Role:", userRole, "Segments:", segments);

        // Don't redirect if on registration or personvern screens
        if(isRegistrationScreen || isPersonvernScreen){
            return;
        }

        if(!isAuthenticated && !inAuthGroup && segments[0] !== undefined){
            router.replace("/");
        } else if (isAuthenticated && inAuthGroup && !isRegistrationScreen && !isPersonvernScreen){
            // Route based on role after authentication - but only if not on registration/personvern
            if (userRole === "STAFF" || userRole === "BOSS") {
                router.replace("/(staff)/employee-home");
            } else {
                router.replace("/(tabs)/home");
            }
        } else if (isAuthenticated && userRole && !inAuthGroup) {
            // If authenticated user is in wrong section, redirect them
            if ((userRole === "STAFF" || userRole === "BOSS") && inTabsGroup) {
                router.replace("/(staff)/employee-home");
            } else if (userRole === "PARENT" && inStaffGroup) {
                router.replace("/(tabs)/home");
            }
        }

    }, [isAuthenticated, userRole, segments]);

    if(isAuthenticated === null){
        return null;
    }

    return (
        <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen name="index" options={{ headerShown: false}}/>
            <Stack.Screen name="(auth)" options={{ headerShown: false}}/>
            <Stack.Screen name="(tabs)" options={{ headerShown: false}}/>
        </Stack>
    );
}