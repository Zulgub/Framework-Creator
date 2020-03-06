-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.6-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para proyecto_final
CREATE DATABASE IF NOT EXISTS `proyecto_final` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `proyecto_final`;

-- Volcando estructura para tabla proyecto_final.frameworks
CREATE TABLE IF NOT EXISTS `frameworks` (
  `cod` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`cod`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla proyecto_final.frameworks: ~1 rows (aproximadamente)
DELETE FROM `frameworks`;
/*!40000 ALTER TABLE `frameworks` DISABLE KEYS */;
INSERT INTO `frameworks` (`cod`, `name`) VALUES
	(1, 'Laravel');
/*!40000 ALTER TABLE `frameworks` ENABLE KEYS */;

-- Volcando estructura para tabla proyecto_final.frameworks_options
CREATE TABLE IF NOT EXISTS `frameworks_options` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `editable` int(11) NOT NULL DEFAULT 0 COMMENT 'Editable: 0 = no, 1 = si',
  `type` varchar(255) DEFAULT NULL COMMENT 'Texto, check....',
  PRIMARY KEY (`id`,`name`),
  CONSTRAINT `FK_frameworks_options_frameworks` FOREIGN KEY (`id`) REFERENCES `frameworks` (`cod`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Volcando datos para la tabla proyecto_final.frameworks_options: ~0 rows (aproximadamente)
DELETE FROM `frameworks_options`;
/*!40000 ALTER TABLE `frameworks_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `frameworks_options` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
