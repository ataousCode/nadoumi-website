# 1. Install dependencies
cd functions
npm install

# 2. Configure your email
firebase functions:config:set email.user="almouslecka@gmail.com"
firebase functions:config:set email.password="xipd yipd wnef suti"
firebase functions:config:set email.admin_emails="almouslecka@gmail.com"

# 3. Deploy
firebase deploy --only functions