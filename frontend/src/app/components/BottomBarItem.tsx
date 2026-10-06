import { Pressable, StyleSheet, Text, View } from "react-native";
import type { SvgProps } from "react-native-svg";

type BottomBarItemProps = {
    icon: React.FC<SvgProps>;
    label: string;
    active?: boolean;
    onPress: () => void;
};

export default function BottomBarItem({
    icon: Icon,
    label,
    active = false,
    onPress,
}: BottomBarItemProps) {
    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
        >
            <View
                style={[
                    styles.iconContainer,
                    active && styles.activeIcon,
                ]}
            >
                <Icon
                    width={24}
                    height={24}
                    color={active ? "#3c3c3cff" : "#888888"} // cor do icone do bottom bar
                />
            </View>

            <Text
                style={[
                    styles.label,
                    active && styles.activeLabel,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    iconContainer: {
        width: 42,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    activeIcon: {
        backgroundColor: "#ffeeeeff", // cor de fundo do icone do bottom bar quando está ativo
    },

    label: {
        marginTop: 3,
        fontSize: 11,
        color: "#888888",
    },

    activeLabel: {
        color: "#464646ff",
        fontWeight: "600",
    },
});