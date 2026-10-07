import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";

import {
    getUserById,
    updateUser,
} from "../services/userService";

import {
    Area,
    UpdateUserRequest,
    User,
} from "../services/types";

const AVAILABLE_AREAS: Area[] = [
    "Voz",
    "Linguagem",
    "Fala",
    "Fluencia",
];

export default function Profile() {

    /*
     * ID enviado pelo _layout.tsx
     *
     * /profile?userId=ee9d8a19-...
     */
    const { userId } = useLocalSearchParams<{
        userId: string;
    }>();

    const [user, setUser] = useState<User | null>(null);

    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [areas, setAreas] = useState<Area[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editingName, setEditingName] =
        useState(false);

    const [editingBio, setEditingBio] =
        useState(false);

    const [showAreas, setShowAreas] =
        useState(false);

    /*
     * Buscar o utilizador quando o Profile abre
     */
    useEffect(() => {
        if (!userId) {
            return;
        }

        loadUser(userId);
    }, [userId]);

    /*
     * GET /api/users/{id}
     */
    const loadUser = async (id: string) => {
        try {
            setLoading(true);

            const data = await getUserById(id);

            /*
             * Guardar o objeto completo
             */
            setUser(data);

            /*
             * Preencher o perfil com os dados
             * que vieram do backend
             */
            setName(data.name);
            setBio(data.bio ?? "");
            setAreas(data.areas ?? []);
            setImage(data.profileImage ?? null);

        } catch (error) {
            console.error(
                "Erro ao carregar utilizador:",
                error
            );

            Alert.alert(
                "Erro",
                "Não foi possível carregar o perfil."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * PUT /api/users/{id}
     */
    const saveProfile = async (
        newName: string,
        newBio: string,
        newAreas: Area[],
        newImage: string | null
    ) => {

        if (!user) {
            return;
        }

        try {
            setSaving(true);

            /*
             * O backend exige:
             *
             * Name
             * ProfileImage
             * Bio
             * Areas
             */
            const data: UpdateUserRequest = {
                name: newName.trim(),
                profileImage: newImage,
                bio: newBio.trim() || null,
                areas: newAreas,
            };

            console.log(
                "PUT /users/",
                user.id,
                data
            );

            const updatedUser =
                await updateUser(
                    user.id,
                    data
                );

            /*
             * Atualizar o utilizador local
             * com a resposta do backend
             */
            setUser(updatedUser);

            setName(updatedUser.name);

            setBio(
                updatedUser.bio ?? ""
            );

            setAreas(
                updatedUser.areas ?? []
            );

            setImage(
                updatedUser.profileImage ?? null
            );

        } catch (error: any) {

            console.error(
                "Erro ao atualizar utilizador:",
                error
            );

            const message =
                error?.response?.data?.message ??
                "Não foi possível atualizar o perfil.";

            Alert.alert(
                "Erro",
                message
            );

            /*
             * Se falhar, voltar a buscar
             * os dados verdadeiros do backend.
             */
            if (userId) {
                await loadUser(userId);
            }

        } finally {
            setSaving(false);
        }
    };

    /*
     * Alterar NOME
     */
    const finishEditingName = async () => {

        setEditingName(false);

        if (!user) {
            return;
        }

        if (!name.trim()) {

            Alert.alert(
                "Nome inválido",
                "O nome não pode ficar vazio."
            );

            setName(user.name);

            return;
        }

        /*
         * Só faz PUT se realmente mudou
         */
        if (name.trim() !== user.name) {

            await saveProfile(
                name,
                bio,
                areas,
                image
            );
        }
    };

    /*
     * Alterar BIO
     */
    const finishEditingBio = async () => {

        setEditingBio(false);

        if (!user) {
            return;
        }

        const currentBio =
            user.bio ?? "";

        /*
         * Só faz PUT se realmente mudou
         */
        if (bio !== currentBio) {

            await saveProfile(
                name,
                bio,
                areas,
                image
            );
        }
    };

    /*
     * Escolher FOTO
     */
    const pickImage = async () => {

        const permission =
            await ImagePicker
                .requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {

            Alert.alert(
                "Permissão necessária",
                "Precisamos de acesso às tuas fotografias para escolher uma imagem."
            );

            return;
        }

        const result =
            await ImagePicker
                .launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });

        if (result.canceled) {
            return;
        }

        const uri =
            result.assets[0].uri;

        /*
         * Atualizar imediatamente a interface
         */
        setImage(uri);

        /*
         * Enviar PUT
         */
        await saveProfile(
            name,
            bio,
            areas,
            uri
        );
    };

    /*
     * ADICIONAR ÁREA
     */
    const addArea = async (
        area: Area
    ) => {

        if (areas.includes(area)) {
            return;
        }

        const newAreas = [
            ...areas,
            area,
        ];

        setAreas(newAreas);

        setShowAreas(false);

        await saveProfile(
            name,
            bio,
            newAreas,
            image
        );
    };

    /*
     * REMOVER ÁREA
     */
    const removeArea = async (
        area: Area
    ) => {

        const newAreas =
            areas.filter(
                currentArea =>
                    currentArea !== area
            );

        setAreas(newAreas);

        await saveProfile(
            name,
            bio,
            newAreas,
            image
        );
    };

    /*
     * Áreas ainda disponíveis
     */
    const availableAreas =
        AVAILABLE_AREAS.filter(
            area => !areas.includes(area)
        );

    /*
     * Loading inicial
     */
    if (loading) {

        return (
            <LinearGradient
                colors={[
                    "#bbc4e6ff",
                    "#181698ff",
                ]}
                start={{
                    x: 0,
                    y: 0,
                }}
                end={{
                    x: 0,
                    y: 1,
                }}
                style={styles.container}
            >
                <View
                    style={
                        styles.loadingContainer
                    }
                >
                    <ActivityIndicator
                        size="large"
                        color="#ffffff"
                    />

                    <Text
                        style={
                            styles.loadingText
                        }
                    >
                        A carregar perfil...
                    </Text>
                </View>
            </LinearGradient>
        );
    }

    /*
     * Se não encontrou utilizador
     */
    if (!user) {

        return (
            <LinearGradient
                colors={[
                    "#bbc4e6ff",
                    "#181698ff",
                ]}
                style={styles.container}
            >
                <View
                    style={
                        styles.loadingContainer
                    }
                >
                    <Text
                        style={
                            styles.loadingText
                        }
                    >
                        Utilizador não encontrado.
                    </Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={[
                "#bbc4e6ff",
                "#181698ff",
            ]}
            start={{
                x: 0,
                y: 0,
            }}
            end={{
                x: 0,
                y: 1,
            }}
            style={styles.container}
        >
            <View style={styles.content}>

                {/* ========================= */}
                {/* FOTO */}
                {/* ========================= */}

                <Pressable
                    style={
                        styles.profileImageContainer
                    }
                    onPress={pickImage}
                    disabled={saving}
                >
                    {image ? (

                        <Image
                            source={{
                                uri: image,
                            }}
                            style={
                                styles.profileImage
                            }
                        />

                    ) : (

                        <Text
                            style={
                                styles.addImage
                            }
                        >
                            +
                        </Text>

                    )}
                </Pressable>

                {/* ========================= */}
                {/* NOME */}
                {/* ========================= */}

                {editingName ? (

                    <TextInput
                        style={
                            styles.nameInput
                        }
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        editable={!saving}
                        onBlur={
                            finishEditingName
                        }
                        onSubmitEditing={
                            finishEditingName
                        }
                    />

                ) : (

                    <Pressable
                        onPress={() =>
                            setEditingName(true)
                        }
                    >
                        <Text
                            style={styles.name}
                        >
                            {name}
                        </Text>
                    </Pressable>

                )}

                {/* ========================= */}
                {/* INFORMAÇÕES */}
                {/* ========================= */}

                <View
                    style={
                        styles.infoContainer
                    }
                >

                    {/* BIO */}

                    <View
                        style={
                            styles.infoSection
                        }
                    >
                        <Text
                            style={styles.title}
                        >
                            Bio
                        </Text>

                        {editingBio ? (

                            <TextInput
                                style={
                                    styles.bioInput
                                }
                                value={bio}
                                onChangeText={
                                    setBio
                                }
                                multiline
                                autoFocus
                                editable={!saving}
                                onBlur={
                                    finishEditingBio
                                }
                            />

                        ) : (

                            <Pressable
                                style={
                                    styles.bioContainer
                                }
                                onPress={() =>
                                    setEditingBio(
                                        true
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.bio
                                    }
                                >
                                    {bio ||
                                        "Adicionar bio..."}
                                </Text>
                            </Pressable>

                        )}
                    </View>

                    {/* ÁREAS */}

                    <View
                        style={
                            styles.infoSection
                        }
                    >
                        <Text
                            style={styles.title}
                        >
                            Áreas
                        </Text>

                        <View
                            style={
                                styles.areasContainer
                            }
                        >

                            {areas.map(
                                area => (

                                    <Pressable
                                        key={area}
                                        style={
                                            styles.area
                                        }
                                        onPress={() =>
                                            removeArea(
                                                area
                                            )
                                        }
                                        disabled={
                                            saving
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.areaText
                                            }
                                        >
                                            {area} ×
                                        </Text>
                                    </Pressable>

                                )
                            )}

                            {/* + */}

                            {availableAreas.length >
                                0 && (

                                    <Pressable
                                        style={
                                            styles.addArea
                                        }
                                        onPress={() =>
                                            setShowAreas(
                                                true
                                            )
                                        }
                                        disabled={
                                            saving
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.addAreaText
                                            }
                                        >
                                            +
                                        </Text>
                                    </Pressable>

                                )}

                        </View>
                    </View>

                    {/* GUARDAR */}

                    {saving && (

                        <View
                            style={
                                styles.savingContainer
                            }
                        >
                            <ActivityIndicator
                                size="small"
                                color="#ffffff"
                            />

                            <Text
                                style={
                                    styles.savingText
                                }
                            >
                                A guardar...
                            </Text>
                        </View>

                    )}

                </View>
            </View>

            {/* ========================= */}
            {/* MODAL ÁREAS */}
            {/* ========================= */}

            <Modal
                visible={showAreas}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setShowAreas(false)
                }
            >
                <View
                    style={
                        styles.modalBackground
                    }
                >
                    <View
                        style={styles.modal}
                    >

                        <Text
                            style={
                                styles.modalTitle
                            }
                        >
                            Adicionar área
                        </Text>

                        {availableAreas.map(
                            area => (

                                <Pressable
                                    key={area}
                                    style={
                                        styles.areaOption
                                    }
                                    onPress={() =>
                                        addArea(
                                            area
                                        )
                                    }
                                >
                                    <Text
                                        style={
                                            styles.areaOptionText
                                        }
                                    >
                                        {area}
                                    </Text>
                                </Pressable>

                            )
                        )}

                        <Pressable
                            style={
                                styles.cancelButton
                            }
                            onPress={() =>
                                setShowAreas(false)
                            }
                        >
                            <Text
                                style={
                                    styles.cancelButtonText
                                }
                            >
                                Cancelar
                            </Text>
                        </Pressable>

                    </View>
                </View>
            </Modal>
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
        alignItems: "center",
    },

    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    loadingText: {
        marginTop: 12,
        color: "#ffffff",
        fontSize: 14,
    },

    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#ffeeeeff",
        borderWidth: 5,
        borderColor: "#20288aff",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginTop: 30,
    },

    profileImage: {
        width: "100%",
        height: "100%",
    },

    addImage: {
        fontSize: 48,
        color: "#888888",
        fontWeight: "300",
    },

    name: {
        marginTop: 50,
        fontSize: 40,
        fontWeight: "600",
        color: "#ffffffff",
    },

    nameInput: {
        marginTop: 35,
        minWidth: 220,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: "#ffffff",
        color: "#ffffff",
        fontSize: 32,
        fontWeight: "600",
        textAlign: "center",
    },

    infoContainer: {
        width: "100%",
        marginTop: 60,
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#2738a4ff",
        borderColor: "#888888",
        borderWidth: 3,
    },

    infoSection: {
        marginBottom: 18,
    },

    title: {
        fontSize: 17,
        fontWeight: "600",
        color: "#ffffffff",
        marginBottom: 15,
    },

    bioContainer: {
        width: "100%",
        minHeight: 50,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#888888",
        borderRadius: 12,
        justifyContent: "center",
    },

    bioInput: {
        width: "100%",
        minHeight: 80,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#ffeeeeff",
        borderRadius: 12,
        color: "#ffffffff",
        fontSize: 14,
        textAlignVertical: "top",
    },

    bio: {
        fontSize: 14,
        color: "#cccccc",
    },

    areasContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
    },

    area: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: "#ffeeeeff",
    },

    areaText: {
        fontSize: 13,
        color: "#464646ff",
    },

    addArea: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffeeeeff",
    },

    addAreaText: {
        fontSize: 24,
        fontWeight: "300",
        color: "#464646ff",
        marginTop: -2,
    },

    savingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },

    savingText: {
        marginLeft: 8,
        color: "#ffffff",
        fontSize: 12,
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
        padding: 24,
        borderRadius: 20,
        backgroundColor: "#3030a1ff",
        borderWidth: 2,
        borderColor: "#b7bccbff",
    },

    modalTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: "#ffffff",
        marginBottom: 20,
    },

    areaOption: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: "#4d49a7ff",
    },

    areaOptionText: {
        color: "#ffffff",
        fontSize: 15,
    },

    cancelButton: {
        marginTop: 10,
        alignItems: "center",
        paddingVertical: 12,
    },

    cancelButtonText: {
        color: "#cccccc",
        fontSize: 14,
    },
});