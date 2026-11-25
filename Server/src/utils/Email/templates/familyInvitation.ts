export const familyInvitationTemplate = (invitationLink: string) => `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f7f7fb; color: #303046; padding: 20px; }
    .container { max-width: 600px; margin: auto; background: #fff; border-radius: 16px; padding: 32px; }
    .btn { display: inline-block; margin-top: 20px; padding: 12px 22px; background: #7656d0; color: #fff;
           text-decoration: none; border-radius: 10px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Запрошення до родини в FamilyFlow</h2>
    <p>Вас запросили приєднатися до сімейного простору.</p>
    <a href="${invitationLink}" class="btn">Створити акаунт та приєднатися</a>
  </div>
</body>
</html>
`;
