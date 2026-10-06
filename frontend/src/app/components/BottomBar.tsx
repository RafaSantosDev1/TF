import { StyleSheet, View } from "react-native";
import BottomBarItem from "./BottomBarItem";
import { router, usePathname } from "expo-router";

import HomeIcon from "../assets/icons/home.svg";
import QuestionIcon from "../assets/icons/file-question-mark.svg";
import NotificationIcon from "../assets/icons/bell.svg";
import UserCircleIcon from "../assets/icons/user-circle.svg";

export default function BottomBar() {
    const pathname = usePathname();

    return (
        <View style={styles.container}>

            <BottomBarItem
                icon={HomeIcon}
                label="Início"
                active={pathname === "/"}
                onPress={() => router.push("/")}
            />

            <BottomBarItem
                icon={QuestionIcon}
                label="Minhas Questões"
                active={pathname === "/questions"}
                onPress={() => router.push("/questions")}
            />

            <BottomBarItem
                icon={NotificationIcon}
                label="Notificações"
                active={pathname === "/notifications"}
                onPress={() => router.push("/notifications")}
            />

            <BottomBarItem
                icon={UserCircleIcon}
                label="Perfil"
                active={pathname === "/profile"}
                onPress={() => router.push("/profile")}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 72,
        marginHorizontal: 20,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#ffeeeeff",
        borderRadius: 36,
        paddingHorizontal: 8,

        shadowColor: "#565656ff",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,

        elevation: 5,
    },
});