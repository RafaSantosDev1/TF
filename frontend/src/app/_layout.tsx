import { useState } from "react";
import { Stack } from "expo-router";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import BottomBar from "./components/BottomBar";

export default function Layout() {
    const [showRegister, setShowRegister] = useState(true);

    return (
        <View style={styles.container}>

            {/* Páginas da aplicação */}
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <BottomBar />
            </View>

            {/* Modal inicial */}
            <Modal
                visible={showRegister}
                transparent
                animationType="fade"
            >
                <View style={styles.modalBackground}>

                    <View style={styles.modal}>

                        {/* Título */}
                        <Text style={styles.title}>
                            Bem-vindo!
                        </Text>

                        <Text style={styles.subtitle}>
                            Cria a tua conta para começares a utilizar
                            a aplicação.
                        </Text>

                        {/* Nome */}
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            placeholderTextColor="#888888"
                        />

                        {/* Email */}
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#888888"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        {/* Palavra-passe */}
                        <TextInput
                            style={styles.input}
                            placeholder="Palavra-passe"
                            placeholderTextColor="#888888"
                            secureTextEntry
                        />

                        {/* Criar conta */}
                        <Pressable
                            style={styles.registerButton}
                            onPress={() => setShowRegister(false)}
                        >
                            <Text style={styles.registerButtonText}>
                                Criar conta
                            </Text>
                        </Pressable>

                        {/* Já tenho conta */}
                        <Pressable
                            style={styles.loginButton}
                            onPress={() => setShowRegister(false)}
                        >
                            <Text style={styles.loginText}>
                                Já tenho uma conta
                            </Text>
                        </Pressable>

                        {/* Política de privacidade */}
                        <Text style={styles.privacyText}>
                            Ao criar uma conta, concordas com a nossa{" "}
                            <Text style={styles.privacyLink}>
                                Política de Privacidade
                            </Text>
                            .
                        </Text>

                    </View>

                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },

    /* Fundo do modal */

    modalBackground: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

        padding: 24,

        backgroundColor: "rgba(0, 0, 0, 0.60)",
    },

    /* Caixa */

    modal: {
        width: "100%",
        maxWidth: 420,

        padding: 26,

        borderRadius: 24,

        backgroundColor: "#3030a1ff",

        borderWidth: 2,
        borderColor: "#b7bccbff",

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 15,

        elevation: 10,
    },

    /* Título */

    title: {
        fontSize: 30,
        fontWeight: "600",
        color: "#ffffffff",

        marginBottom: 8,
    },

    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: "#cccccc",

        marginBottom: 24,
    },

    /* Inputs */

    input: {
        width: "100%",
        height: 50,

        paddingHorizontal: 16,

        marginBottom: 12,

        borderRadius: 12,

        borderWidth: 1,
        borderColor: "#888888",

        backgroundColor: "#4d49a7ff",

        color: "#ffffffff",

        fontSize: 14,
    },

    /* Botão criar conta */

    registerButton: {
        width: "100%",
        height: 52,

        marginTop: 8,

        borderRadius: 26,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#0037ffff",
    },

    registerButtonText: {
        fontSize: 15,
        fontWeight: "600",

        color: "#ffffffff",
    },

    /* Login */

    loginButton: {
        alignItems: "center",

        marginTop: 18,
    },

    loginText: {
        fontSize: 13,
        color: "#eeeeee",
    },

    /* Política */

    privacyText: {
        marginTop: 22,

        fontSize: 11,
        lineHeight: 17,

        textAlign: "center",

        color: "#999999",
    },

    privacyLink: {
        color: "#bbc4e6ff",
        textDecorationLine: "underline",
    },
});