Quick script to update your `[mfa]` in `~/.aws/credentials`

## Setup

Either set these environment variables, or create a `~/.env` file like `.env.example`

```
AWS_ACCOUNT_ID = 226001234567
AWS_USERNAME = philihp
```

## Usage

Run with `npx`

```
❯ npx aws-2fa-credential-updator
```

and you should see

```
⠋ Ask for 2FA token
◼ Get session from AWS
◼ Save AccessKeyId
◼ Save SecretAccessKey
◼ Save SessionToken

? Authenticator Token (philihp@226001234567)
```
