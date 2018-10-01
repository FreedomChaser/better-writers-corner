create table stories (storyID serial primary key, title VARCHAR(150),  userID serial REFERENCES users(userID))
