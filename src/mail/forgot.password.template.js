export const forgotPasswordTemplate = ({ resetLink }) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #0056b3;">Password Reset Request</h2>
    <p>Hi,</p>
    <p>You requested a password reset for your account. Please click the button below to reset your password. This link will be valid for 10 minutes.</p>
    <div style="text-align: center; margin-top: 10px;">
      <a 
        href="${resetLink}" 
        style="display: inline-block; background-color: #0056b3; color: white; text-decoration: none; padding: 10px 20px; font-size: 16px; border-radius: 4px;">
        Reset Password
      </a>
    </div>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p>Best regards,<br>Nexa Team</p>
  </div>
`;
