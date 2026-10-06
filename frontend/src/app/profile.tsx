import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
    const [image, setImage] = useState<string | null>(null);

    const [bio, setBio] = useState(
        "Estudante de terapia da fala Isto é um exemplo da bio dps pode ter mais ou menos texto a pessoa é que escreve."
    );

    const [editingBio, setEditingBio] = useState(false);

    const [areas, setAreas] = useState([
        "Linguagem",
        "Voz",
    ]);

    const pickImage = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                "Permissão necessária",
                "Precisamos de acesso às tuas fotografias para escolher uma imagem."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const addArea = () => {
        // Aqui mais tarde podemos ir buscar as áreas disponíveis
        // ao backend e mostrar uma lista para o utilizador escolher.

        Alert.alert(
            "Adicionar área",
            "Aqui vão aparecer as áreas disponíveis para adicionar."
        );
    };

    return (
        <LinearGradient
            colors={["#bbc4e6ff", "#181698ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>

                <Pressable
                    style={styles.profileImageContainer}
                    onPress={pickImage}
                >
                    {image ? (
                        <Image
                            source={{ uri: image }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <Text style={styles.addImage}>+</Text>
                    )}
                </Pressable>

                <Text style={styles.name}>
                    Maria Cruz
                </Text>

                <View style={styles.infoContainer}>

                    {/* BIO */}
                    <View style={styles.infoSection}>
                        <Text style={styles.title}>
                            Bio
                        </Text>

                        {editingBio ? (
                            <TextInput
                                style={styles.bioInput}
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                autoFocus
                                onBlur={() => setEditingBio(false)}
                            />
                        ) : (
                            <Pressable
                                style={styles.bioContainer}
                                onPress={() => setEditingBio(true)}
                            >
                                <Text style={styles.bio}>
                                    {bio}
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    {/* ÁREAS */}
                    <View style={styles.infoSection}>
                        <Text style={styles.title}>
                            Áreas
                        </Text>

                        <View style={styles.areasContainer}>

                            {areas.map((area, index) => (
                                <View
                                    key={`${area}-${index}`}
                                    style={styles.area}
                                >
                                    <Text style={styles.areaText}>
                                        {area}
                                    </Text>
                                </View>
                            ))}

                            {/* Botão + */}
                            <Pressable
                                style={styles.addArea}
                                onPress={addArea}
                            >
                                <Text style={styles.addAreaText}>
                                    +
                                </Text>
                            </Pressable>

                        </View>
                    </View>

                </View>

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
        alignItems: "center",
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

    infoContainer: {
        width: "100%",
        marginTop: 100,
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

    /* Caixa da Bio */
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
        minHeight: 50,

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

    /* Botão + das áreas */
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
});