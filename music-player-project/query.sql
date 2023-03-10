CREATE DATABASE music_player;

CREATE table alltracks (
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
path TINYTEXT NOT NULL,
playlist_id INT DEFAULT 1);

CREATE TABLE tracks(
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
path TINYTEXT NOT NULL,
playlist_id INT );

CREATE TABLE playlists(
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
title VARCHAR(50) NOT NULL,
system_rank TINYINT(1) DEFAULT 0);