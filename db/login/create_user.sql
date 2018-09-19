insert into users (username, email, authID)
values ($1, $2, $3)
RETURNING *;