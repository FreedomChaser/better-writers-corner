insert into users (email, authID)
values ($1, $2)
RETURNING *;