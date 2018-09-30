-- delete from characters
-- using stories
-- where characters.storyid = stories.storyid and stories.userid = $1

delete from characters
where storyid = $1