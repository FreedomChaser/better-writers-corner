create table plot_trees (treeid serial primary key, storyid serial references stories(storyid), title varchar(300))
