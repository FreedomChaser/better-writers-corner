create table plot_card (plotid serial primary key, treeid serial references plot_trees(treeid) on delete cascade, title varchar(300), summary varchar(700), plot_order int, done boolean)
