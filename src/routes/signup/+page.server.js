import { fail, redirect } from "@sveltejs/kit";
import { createUser } from "../../database.js";

const usernameIsInvalid = (username) => {
  // Uni style usernames aren't allowed
  const universityRegex = /^\w\d{2}\w{3}$/;

  if (universityRegex.test(username))
    return "Please avoid University of Manchester style usernames (e.g. a12bcd)";

  return null;
};

// TODO: Implement password strength check.
const passwordIsInvalid = (password) => null;

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();

    const username = data.get("username");
    const password = data.get("password");
    const confirmPassword = data.get("confirm-password");

    // In case user manages to send request w/out these 3 required fields
    if (!username) return fail(422, { error: "You must enter a username" });
    if (!password) return fail(422, { error: "You must enter a password" });
    if (!confirmPassword)
      return fail(422, { error: "You must confirm your entered password" });

    // Check password confirmed correctly
    if (password !== confirmPassword)
      return fail(422, {
        error: "Password confirmation does not match entered password",
      });

    // Validate username
    let errorMessage = usernameIsInvalid(username);
    if (errorMessage) return fail(422, { error: errorMessage });

    // Validate password
    errorMessage = passwordIsInvalid(password);
    if (errorMessage) return fail(422, { error: errorMessage });

    // User must have entered a valid username and password, so sign them up.
    const dbResp = await createUser(username, password);
    console.log(dbResp);

    // In the case creation wasn't successful:
    if (dbResp.error !== undefined && dbResp.error === true) return fail(dbResp.http, { error: dbResp.info });
    if (!dbResp)
      return fail(500, {
        error: "Something went wrong, please try again later",
      });

    // If creation was successful, send them to the login page.
    throw redirect(303, `/login?signup=${username}`);
  },
};
