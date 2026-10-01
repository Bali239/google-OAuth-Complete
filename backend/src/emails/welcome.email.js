export const welcomeEmail = (name) => {
  const safeName = String(name);
  const safeHtmlName = safeName.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

  return {
    subject: "Welcome to MyApp!",
    text: `Hi ${safeName},\n\nWelcome to MyApp. Your account is ready, and we're glad you're here. Sign in any time to continue to your dashboard.\n\nThe MyApp team`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Welcome to MyApp</title>
        </head>

        <body style="margin:0; padding:32px 16px; background-color:#f4f7f5; font-family:Arial,sans-serif; color:#20312a;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; margin:0 auto; background-color:#ffffff; border:1px solid #dce7e0;">
            <tr>
              <td style="padding:36px 32px 20px;">
                <p style="margin:0 0 12px; color:#28704f; font-size:13px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">MyApp</p>
                <h1 style="margin:0 0 20px; font-size:28px; line-height:1.3;">Welcome, ${safeHtmlName}!</h1>
                <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">Your account is ready. We're glad you're here.</p>
                <p style="margin:0 0 24px; font-size:16px; line-height:1.6;">Sign in any time to continue to your dashboard and pick up where you left off.</p>
                <p style="margin:0; font-size:15px; line-height:1.6;">Thanks,<br />The MyApp team</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };
};