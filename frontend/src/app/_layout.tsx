import { useState } from "react";
import { router, Stack } from "expo-router";
import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import BottomBar from "./components/BottomBar";

import { createUser } from "../services/userService";
import { setCurrentUserId } from "../services/sessionService";
import { CreateUserRequest } from "../services/types";

export default function Layout() {
    const [showRegister, setShowRegister] = useState(true);

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");

    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim()) {
            Alert.alert(
                "Campo obrigatório",
                "Preenche o teu nome."
            );
            return;
        }

        try {
            setLoading(true);

            const data: CreateUserRequest = {
                name: name.trim(),
                profileImage: null,
                bio: bio.trim() || null,
                areas: [],
            };

            /*
             * POST /api/users
             *
             * O backend devolve o utilizador criado,
             * incluindo o ID.
             */
            const user = await createUser(data);

            console.log("Utilizador criado:", user);

            /*
             * Guardar o ID do utilizador que acabou
             * de criar a conta como sessão atual.
             *
             * Este ID é a identidade da aplicação
             * até fazer logout.
             */
            await setCurrentUserId(user.id);

            console.log("Sessão atual:", user.id);

            /*
             * Fechar modal
             */
            setShowRegister(false);

            /*
             * Limpar formulário
             */
            setName("");
            setBio("");

            /*
             * Ir para o perfil.
             *
             * O ID da sessão fica disponível
             * em toda a aplicação, sem ser
             * necessário passar o userId
             * em todas as rotas.
             */
            router.push("/profile");

        } catch (error: any) {
            console.error(
                "Erro ao criar utilizador:",
                error
            );

            const message =
                error?.response?.data?.message ??
                "Não foi possível criar a conta.";

            Alert.alert(
                "Erro",
                message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />

            <View style={styles.bottomBar}>
                <BottomBar />
            </View>

            <Modal
                visible={showRegister}
                transparent
                animationType="fade"
            >
                <View style={styles.modalBackground}>

                    <View style={styles.modal}>

                        <Text style={styles.title}>
                            Bem-vindo!
                        </Text>

                        <Text style={styles.subtitle}>
                            Cria a tua conta para começares
                            a utilizar a aplicação.
                        </Text>

                        {/* NOME */}
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            placeholderTextColor="#888888"
                            value={name}
                            onChangeText={setName}
                            editable={!loading}
                            autoCapitalize="words"
                        />

                        {/* BIO */}
                        <TextInput
                            style={[
                                styles.input,
                                styles.bioInput,
                            ]}
                            placeholder="Bio (opcional)"
                            placeholderTextColor="#888888"
                            value={bio}
                            onChangeText={setBio}
                            editable={!loading}
                            multiline
                            textAlignVertical="top"
                        />

                        {/* CRIAR CONTA */}
                        <Pressable
                            style={[
                                styles.registerButton,
                                loading &&
                                styles.disabledButton,
                            ]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            <Text
                                style={
                                    styles.registerButtonText
                                }
                            >
                                {loading
                                    ? "A criar conta..."
                                    : "Criar conta"}
                            </Text>
                        </Pressable>

                        {/* LOGIN */}
                        <Pressable
                            style={styles.loginButton}
                            onPress={() =>
                                setShowRegister(false)
                            }
                            disabled={loading}
                        >
                            <Text style={styles.loginText}>
                                Já tenho uma conta
                            </Text>
                        </Pressable>

                        <Text style={styles.privacyText}>
                            Ao criar uma conta, concordas com
                            a nossa{" "}
                            <Text
                                style={styles.privacyLink}
                            >
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

    modalBackground: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: "rgba(0, 0, 0, 0.60)",
    },

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

    bioInput: {
        height: 90,
        paddingTop: 14,
    },

    registerButton: {
        width: "100%",
        height: 52,
        marginTop: 8,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0037ffff",
    },

    disabledButton: {
        opacity: 0.6,
    },

    registerButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#ffffffff",
    },

    loginButton: {
        alignItems: "center",
        marginTop: 18,
    },

    loginText: {
        fontSize: 13,
        color: "#eeeeee",
    },

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