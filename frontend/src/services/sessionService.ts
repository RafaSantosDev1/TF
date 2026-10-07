import AsyncStorage from "@react-native-async-storage/async-storage";

/*
 * SESSÃO LOCAL TEMPORÁRIA
 *
 * Enquanto não existe autenticação/JWT,
 * o ID do utilizador criado no registo
 * (devolvido pelo POST /users) é guardado
 * localmente e usado como identidade
 * atual da aplicação.
 */

const CURRENT_USER_ID_KEY = "@current_user_id";

/*
 * Guarda o ID do utilizador que acabou
 * de criar a conta como sessão atual.
 */
export async function setCurrentUserId(
    userId: string
): Promise<void> {
    await AsyncStorage.setItem(
        CURRENT_USER_ID_KEY,
        userId
    );
}

/*
 * Recupera o ID da sessão atual.
 * Devolve null quando não existe sessão.
 */
export async function getCurrentUserId(): Promise<string | null> {
    return await AsyncStorage.getItem(
        CURRENT_USER_ID_KEY
    );
}

/*
 * Remove a sessão atual (logout).
 */
export async function clearCurrentUserId(): Promise<void> {
    await AsyncStorage.removeItem(
        CURRENT_USER_ID_KEY
    );
}
