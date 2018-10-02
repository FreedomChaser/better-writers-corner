insert into plot_trees( storyid, title)
values ($1, $2);

select title from plot_trees
where storyid = $1