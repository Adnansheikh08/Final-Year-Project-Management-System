export function generateEmailTemplate(resetPasswordUrl) {
      return `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
      <h2>Password Reset Request</h2>


      <p>
        We received a request to reset your password. 
        Click the button below to create a new password.
      </p>

      <a href="${resetPasswordUrl}" 
         style="
           display:inline-block;
           padding:10px 20px;
           margin:20px 0;
           background-color:#2563eb;
           color:white;
           text-decoration:none;
           border-radius:5px;
         ">
         Reset Password
      </a>

      <p>If you did not request a password reset, you can safely ignore this email.</p>

      <p>This link will expire in 15 minutes.</p>

      <br/>

      <p>Thanks,<br/>Your Team</p>
    </div>
  `;
}