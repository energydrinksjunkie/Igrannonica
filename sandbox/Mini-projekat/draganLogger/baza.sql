create database logger

create table logs(
	id int primary key identity(1,1),
	naziv varchar(30),
	opis varchar(100),
	datum varchar(30)
)
drop table logs
insert into logs(naziv,opis,datum) values ('Pokvarena klima','Na prvom spratu',GETDATE())
