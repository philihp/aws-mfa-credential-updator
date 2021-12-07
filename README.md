Quick script to update your `[mfa]` in `~/.aws/credentials`

## Setup

Create a `.env` file like `.env.example`

## Usage

```
❯ node index.js

⠋ Ask for 2FA token
◼ Get session from AWS
◼ Save AccessKeyId
◼ Save SecretAccessKey
◼ Save SessionToken

? Authenticator Token (philihp@...)
```
