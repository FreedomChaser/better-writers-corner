insert into plot_trees( storyid, title)
values ($1, $2);

select title, treeid from plot_trees
where storyid = $1
order by treeid desc