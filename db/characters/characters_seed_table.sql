create table characters( characterid serial primary key, storyID serial REFERENCES stories(storyID), first_name VARCHAR(80), last_name varchar(80), gender varchar(30), hair_color varchar(80), eye_color varchar(80), hobby varchar(200), age SMALLINT, occupation varchar(100), dd_alignment varchar(100), special_abilities varchar(300))