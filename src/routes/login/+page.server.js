/*import { fail, redirect } from "@sveltejs/kit";
import { authUserCredentials, newSession, SESSION_COOKIE_MAX_AGE } from "../../database";

export const actions = {
    default: async ({ cookies, request, getClientAddress, url }) => {
        const data = await request.formData(); 
        const username = data.get("username");
        const password = data.get("password");

        if (!username) 
            return fail(422, { error: "You must enter a username" });
        if (!password)
            return fail(422, { error: "You must enter a password "}); 

        // Check username and password correct 
        let dbResp = await authUserCredentials(username, password);
        if (dbResp.status !== 200) 
            return fail(dbResp.status, { error: dbResp.message });

        // Create a new session
        const ip = getClientAddress(); 
        dbResp = await newSession(username, ip, request.headers.get("user-agent"));

        if (dbResp.status !== 200) 
            return fail(dbResp.status, { error: dbResp.message });
        
        cookies.set("sessionID", dbResp.sessionID, { 
            maxAge: SESSION_COOKIE_MAX_AGE, 
            path: '/',
            sameSite: "strict",
            httpOnly: true,
        });

        if (url.searchParams.has("redirectTo")) 
            throw redirect(303, url.searchParams.get("redirectTo")); 

        throw redirect(303, "/");
    }
};
*/