"use strict";

async function syncUser(ctx) {
  try {
    const strapi = global.strapi;
    const providedSecret = ctx.request.headers["x-auth-sync-secret"];

    if (!providedSecret || providedSecret !== process.env.AUTH_SYNC_SECRET) {
      return ctx.unauthorized("Invalid auth sync secret");
    }

    const { googleId, email, name, picture } = ctx.request.body;

    if (!googleId || !email) {
      return ctx.badRequest("googleId and email are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userQuery = strapi.db.query("plugin::users-permissions.user");

    const existingUser =
      (await userQuery.findOne({ where: { googleId } })) ||
      (await userQuery.findOne({ where: { email: normalizedEmail } }));

    const isNitk = normalizedEmail.endsWith("@nitk.edu.in");

    if (existingUser) {
      const updatedUser = await userQuery.update({
        where: { id: existingUser.id },
        data: {
          googleId,
          email: normalizedEmail,
          name: name || existingUser.name,
          googlePicture: picture || existingUser.googlePicture || null,
          isNitk,
          appRole: existingUser.appRole || "user",
          provider: "google",
        },
      });

      return ctx.send({
        success: true,
        created: false,
        user: updatedUser,
      });
    }

    const authenticatedRole = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "authenticated" } });

    if (!authenticatedRole) {
      return ctx.internalServerError("Authenticated role not found");
    }

    // old username which include name of person
    // const username = `${normalizedEmail.split("@")[0]}-${googleId
    //   .slice(-6)}`
    //   .toLowerCase()
    //   .replace(/[^a-z0-9-_]/g, "-");

    const emailNumbers = normalizedEmail.split("@")[0].replace(/\D/g, "");
    const randomText = Math.random().toString(36).slice(2, 6);
    const username = `${emailNumbers}-${randomText}`;

    const newUser = await userQuery.create({
      data: {
        username,
        email: normalizedEmail,
        name: name || normalizedEmail,
        googleId,
        googlePicture: picture || null,
        isNitk,
        appRole: "user",
        provider: "google",
        confirmed: true,
        blocked: false,
        role: authenticatedRole.id,
      },
    });

    return ctx.send({
      success: true,
      created: true,
      user: newUser,
    });
  } catch (error) {
    console.error("AUTH SYNC ERROR:", error);
    return ctx.internalServerError("Failed to synchronize user");
  }
}

module.exports = { syncUser };
