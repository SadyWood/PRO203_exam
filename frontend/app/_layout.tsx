import {useCallback, useEffect, useState} from "react";
import {Stack, useRouter, useSegments} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

let globalAuthRefresh:(() => Promise<void>) | null = null;

export function authRefresh(){
    return globalAuthRefresh?.();
}
export default function RootLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const segments = useSegments();
    const router = useRouter();

    async function checkAuth(){
        try{
            const token = await AsyncStorage.getItem("authToken");
            setIsAuthenticated(!!token);
        }catch (error){
            console.error("Error checking auth:", error);
            setIsAuthenticated(false);
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

        console.log("Auth state:", isAuthenticated, "Segments:", segments);

        if(!isAuthenticated && !inAuthGroup && segments[0] !== undefined){
            router.replace("/");
        }else if (isAuthenticated && inAuthGroup){
            router.replace("/home");
        }

    }, [isAuthenticated, segments]);

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