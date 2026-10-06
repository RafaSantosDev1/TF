import { LinearGradient } from "expo-linear-gradient";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
} from "react-native";

const questions = [
    {
        id: "1",
        question: "O que é a terapia da fala?",
        questionDate: "06/10/2026",
        answer:
            "A terapia da fala é uma área da saúde que trabalha a comunicação, linguagem, voz, fala e deglutição.",
        answerDate: "06/10/2026",
    },
    {
        id: "2",
        question: "Como posso melhorar a minha voz?",
        questionDate: "05/10/2026",
        answer: null,
        answerDate: null,
    },
    {
        id: "3",
        question: "O que é uma alteração da linguagem?",
        questionDate: "03/10/2026",
        answer:
            "É uma dificuldade que pode afetar a compreensão ou a utilização da linguagem.",
        answerDate: "04/10/2026",
    },
];

export default function Questions() {
    return (
        <LinearGradient
            colors={["#bbc4e6ff", "#181698ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>

                {/* Título */}
                <Text style={styles.pageTitle}>
                    Minhas Questões
                </Text>

                {/* Lista de questões */}
                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={styles.questionContainer}>

                            {/* Questão */}
                            <View style={styles.questionBox}>

                                <Text style={styles.questionTitle}>
                                    Questão
                                </Text>

                                <Text style={styles.date}>
                                    {item.questionDate}
                                </Text>

                                <Text style={styles.question}>
                                    {item.question}
                                </Text>

                            </View>

                            {/* Resposta */}
                            <View style={styles.answerBox}>

                                <Text style={styles.answerTitle}>
                                    Resposta
                                </Text>

                                {item.answerDate && (
                                    <Text style={styles.date}>
                                        {item.answerDate}
                                    </Text>
                                )}

                                <Text
                                    style={[
                                        styles.answer,
                                        !item.answer && styles.noAnswer,
                                    ]}
                                >
                                    {item.answer
                                        ? item.answer
                                        : "Sem resposta"}
                                </Text>

                            </View>

                        </View>
                    )}
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

    pageTitle: {
        marginTop: 30,
        marginBottom: 25,

        fontSize: 30,
        fontWeight: "600",

        color: "#ffffffff",
    },

    list: {
        paddingBottom: 120,
    },

    questionContainer: {
        width: "100%",
        marginBottom: 20,

        padding: 20,

        borderRadius: 20,

        backgroundColor: "#2738a4ff",

        borderColor: "#888888",
        borderWidth: 3,
    },

    questionBox: {
        width: "100%",

        paddingHorizontal: 14,
        paddingVertical: 12,

        borderWidth: 1,
        borderColor: "#414141ff",
        borderRadius: 12,
    },

    questionTitle: {
        fontSize: 17,
        fontWeight: "600",

        color: "#ffffffff",

        marginBottom: 5,
    },

    date: {
        fontSize: 11,
        color: "#888888",

        marginBottom: 8,
    },

    question: {
        fontSize: 14,
        lineHeight: 21,

        color: "#cccccc",
    },

    answerBox: {
        width: "100%",

        marginTop: 14,

        paddingHorizontal: 14,
        paddingVertical: 12,

        borderWidth: 1,
        borderColor: "#414141ff",
        borderRadius: 12,
    },

    answerTitle: {
        fontSize: 17,
        fontWeight: "600",

        color: "#ffffffff",

        marginBottom: 5,
    },

    answer: {
        fontSize: 14,
        lineHeight: 21,

        color: "#cccccc",
    },

    noAnswer: {
        color: "#888888",
        fontStyle: "italic",
    },
});