export const resetPasswordTemplate = (resetLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body {font-family: Arial, sans-serif; background-color: #f9f9fb; color: #333; padding: 20px;}
    .container {max-width: 600px; margin: auto; background: #fff; border-radius: 8px; 
                padding: 30px;box-shadow: 0 2px 8px rgba(0,0,0,0.05);}
    h2 {color: #6a0dad;}
    .btn {display: inline-block; margin-top: 20px; padding: 12px 20px; background: #6a0dad;
          color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .footer {margin-top: 30px; font-size: 12px; color: #777; text-align: center;}
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>Click the button below to reset your password. The link is valid for 15 minutes.</p>
    <a href="${resetLink}" class="btn">Reset Password</a>
    <div class="footer">
      If you didn’t request this, just ignore this email.
    </div>
  </div>
</body>
</html>
`;
