create table plot_trees (treeid serial primary key, storyid serial references stories(storyid) on delete cascade, title varchar(300))
