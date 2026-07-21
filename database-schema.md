# Database Schema Overview

## Collections
- **users**: uid, email, displayName, role, balances (main, pending, bonus, referral), level, streak, createdAt
- **tasks**: id, advertiserId, title, category, reward, instructions, timeLimit, slots, remainingSlots, status, createdAt
- **taskSubmissions**: id, taskId, workerId, advertiserId, proofText, proofImageUrl, status, submittedAt
- **withdrawals**: id, userId, amount, method, accountDetails, status, requestedAt
- **deposits**: id, userId, amount, method, transactionId, status, timestamp
- **notifications**: id, userId, title, message, read, createdAt
- **settings**: siteName, minWithdrawal, maintenanceMode, referralCommission
