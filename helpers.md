curl --location --request POST 'https://YOUR_AUTH0_DOMAIN/oauth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=YOUR_AUTH0_CLIENT_ID' \
--data-urlencode 'username=YOUR_USERNAME' \
--data-urlencode 'password=YOUR_PASSWORD' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'scope=openid'
