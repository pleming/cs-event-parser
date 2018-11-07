/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table cs_product
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cs_product`;

CREATE TABLE `cs_product` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cs_type` int(11) unsigned NOT NULL,
  `event_type` int(11) unsigned NOT NULL,
  `category_type` int(11) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `price` int(11) unsigned NOT NULL,
  `image` longblob,
  PRIMARY KEY (`id`),
  KEY `cs_type` (`cs_type`,`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table cs_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cs_type`;

CREATE TABLE `cs_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `cs_type` WRITE;
/*!40000 ALTER TABLE `cs_type` DISABLE KEYS */;

INSERT INTO `cs_type` (`id`, `name`)
VALUES
	(1,'CU'),
	(2,'GS25'),
	(3,'7-ELEVEN');

/*!40000 ALTER TABLE `cs_type` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table event_type
# ------------------------------------------------------------

DROP TABLE IF EXISTS `event_type`;

CREATE TABLE `event_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `event_type` WRITE;
/*!40000 ALTER TABLE `event_type` DISABLE KEYS */;

INSERT INTO `event_type` (`id`, `name`)
VALUES
	(1,'1+1'),
	(2,'2+1'),
	(3,'3+1');

/*!40000 ALTER TABLE `event_type` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
