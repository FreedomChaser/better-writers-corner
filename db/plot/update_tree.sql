update plot_trees
set title = $2
where storyid = $1 and treeid = $3;

select title from plot_trees
where storyid = $1 and treeid = $3

