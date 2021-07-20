/*
SQLyog Community v13.1.6 (64 bit)
MySQL - 10.4.19-MariaDB : Database - sdesign
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sdesign` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;

USE `sdesign`;

/*Table structure for table `admin` */

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `admin` */

insert  into `admin`(`email`,`password`,`status`) values 
('info.sdesignstudio@gmail.com','$2b$10$wDdjA4qHi/nCv3kNZtl4V.eNIlhxHW1r3u.gv5VrsZ3zPWNNDHTQG',0);

/*Table structure for table `notifications` */

DROP TABLE IF EXISTS `notifications`;

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender-name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sender-email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `content` varchar(1023) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `notifications` */

insert  into `notifications`(`id`,`sender-name`,`sender-email`,`content`) values 
(94,'ArmenYoMen','armen.demirchyan.ait@gmail.com','a'),
(95,'ArmenYoMen','armen.demirchyan.ait@gmail.com','a'),
(96,'UrishAnun','armen.demirchyan.ait@gmail.com','a'),
(97,'UrishAnun','jaksasjk@email.com','a'),
(98,'UrishAnun','aramjamalyan.fantasy@gmail.com','a');

/*Table structure for table `partners` */

DROP TABLE IF EXISTS `partners`;

CREATE TABLE `partners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `img` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `partners` */

insert  into `partners`(`id`,`img`) values 
(4,'ey.png'),
(5,'fibo.png'),
(6,'idbank.png'),
(8,'maple.png'),
(9,'nest.png'),
(10,'sosvilages.png');

/*Table structure for table `project-types` */

DROP TABLE IF EXISTS `project-types`;

CREATE TABLE `project-types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `project-types` */

insert  into `project-types`(`id`,`label`) values 
(1,'Դիզայն'),
(2,'Արտաքին գովազդ'),
(3,'Տպագրություն'),
(4,'Լազերային և ֆրեզերային փորագրություն');

/*Table structure for table `projects` */

DROP TABLE IF EXISTS `projects`;

CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cover-img` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `order` int(11) NOT NULL,
  `img` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `title-hy` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `title-en` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `project-type` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_fk0` (`project-type`),
  CONSTRAINT `projects_fk0` FOREIGN KEY (`project-type`) REFERENCES `project-types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `projects` */

insert  into `projects`(`id`,`cover-img`,`order`,`img`,`title-hy`,`title-en`,`project-type`) values 
(18,'branch 21626538221858.jpg',1,'brunch1626538221854.png','Բռունչ','Brunch',2),
(19,'everest1626538282604.jpg',1,'everest1626538282602.png','էվերեստ','Everest',2),
(20,'branch 21626538308699.jpg',1,'brunch1626538308696.png','Բռունչ','Brunch',2),
(22,'marifos1626538342813.jpg',1,'marifos1626538342811.png','Մարիֆոս','Marifos',2),
(23,'ritox1626538402584.jpg',1,'ritox1626538402582.png','Ռիտոքս','Ritox',2),
(24,'vanardi1626538418051.jpg',1,'vanardi1626538418046.png','Վանարդի','Vanardi',2),
(25,'everest1626538575300.jpg',1,'everest1626538575298.png','էվերեստ','Everest',1),
(26,'branch 21626538590756.jpg',1,'brunch1626538590752.png','Բռունչ','Brunch',1),
(27,'ritox1626538607766.jpg',1,'ritox1626538607764.png','Ռիտոքս','Ritox',1),
(28,'vanardi1626538633160.jpg',1,'vanardi1626538633155.png','Վանարդի','Vanardi',1),
(29,'marifos1626538652283.jpg',1,'marifos1626538652280.png','Մարիֆոս','Marifos',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
