import { LinearGradient } from "expo-linear-gradient";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Pressable,
} from "react-native";

const notifications = [
    {
        id: "1",
        title: "A tua questão foi respondida",
        message:
            "A tua questão \"O que é a terapia da fala?\" recebeu uma resposta.",
        date: "Hoje, 14:32",
        read: false,
        icon: "💬",
    },
    {
        id: "2",
        title: "Nova resposta",
        message:
            "Recebeste uma nova resposta numa das tuas questões.",
        date: "Ontem, 18:45",
        read: false,
        icon: "🔔",
    },
    {
        id: "3",
        title: "Perfil atualizado",
        message:
            "As informações do teu perfil foram atualizadas com sucesso.",
        date: "04/10/2026",
        read: true,
        icon: "👤",
    },
    {
        id: "4",
        title: "Bem-vinda à aplicação",
        message:
            "Agora podes colocar questões e acompanhar as respostas.",
        date: "03/10/2026",
        read: true,
        icon: "✨",
    },
];

export default function Notifications() {
    return (
        <LinearGradient
            colors={["#bbc4e6ff", "#181698ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>

                {/* Título */}
                <View style={styles.header}>
                    <Text style={styles.pageTitle}>
                        Notificações
                    </Text>

                    <Pressable>
                        <Text style={styles.markAll}>
                            Marcar como lidas
                        </Text>
                    </Pressable>
                </View>

                {/* Lista de notificações */}
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[
                                styles.notification,
                                !item.read && styles.unread,
                            ]}
                        >
                            {/* Ícone */}
                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>
                                    {item.icon}
                                </Text>
                            </View>

                            {/* Conteúdo */}
                            <View style={styles.notificationContent}>

                                <View style={styles.titleRow}>
                                    <Text style={styles.title}>
                                        {item.title}
                                    </Text>

                                    {!item.read && (
                                        <View style={styles.unreadDot} />
                                    )}
                                </View>

                                <Text style={styles.message}>
                                    {item.message}
                                </Text>

                                <Text style={styles.date}>
                                    {item.date}
                                </Text>

                            </View>
                        </Pressable>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>
                                🔔
                            </Text>

                            <Text style={styles.emptyTitle}>
                                Não tens notificações
                            </Text>

                            <Text style={styles.emptyText}>
                                Quando receberes uma nova notificação,
                                ela vai aparecer aqui.
                            </Text>
                        </View>
                    }
                />

            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flex: 1,
        padding: 24,
    },

    /* Cabeçalho */

    header: {
        marginTop: 30,
        marginBottom: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    pageTitle: {
        fontSize: 30,
        fontWeight: "600",
        color: "#ffffffff",
    },

    markAll: {
        fontSize: 12,
        color: "#eeeeee",
    },

    /* Lista */

    list: {
        paddingBottom: 120,
    },

    /* Notificação */

    notification: {
        width: "100%",
        minHeight: 100,
        marginBottom: 14,
        padding: 16,

        flexDirection: "row",
        alignItems: "flex-start",

        borderRadius: 18,
        borderWidth: 2,
        borderColor: "#888888",

        backgroundColor: "#2738a4ff",
    },

    /* Notificação não lida */

    unread: {
        borderColor: "#bbc4e6ff",
        backgroundColor: "#2738a4ff",
    },

    /* Ícone */

    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#bbc4e6ff",

        marginRight: 14,
    },

    icon: {
        fontSize: 20,
    },

    /* Conteúdo */

    notificationContent: {
        flex: 1,
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },

    title: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: "#ffffffff",
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#bbc4e6ff",
        marginLeft: 8,
    },

    message: {
        fontSize: 13,
        lineHeight: 19,
        color: "#cccccc",
    },

    date: {
        marginTop: 8,
        fontSize: 11,
        color: "#999999",
    },

    /* Sem notificações */

    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
        paddingHorizontal: 30,
    },

    emptyIcon: {
        fontSize: 42,
        marginBottom: 15,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#ffffffff",
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: "center",
        color: "#cccccc",
    },
});