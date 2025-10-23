-- Create verification_codes table
-- This table stores email verification codes for various purposes

CREATE TABLE IF NOT EXISTS `verification_codes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱地址',
  `code` VARCHAR(10) NOT NULL COMMENT '验证码',
  `type` ENUM('email_verification', 'password_reset', 'email_change') NOT NULL COMMENT '验证码类型：邮箱验证、密码重置、邮箱更换',
  `expiresAt` DATETIME NOT NULL COMMENT '过期时间',
  `used` TINYINT(1) DEFAULT 0 COMMENT '是否已使用',
  `ipAddress` VARCHAR(45) DEFAULT NULL COMMENT '请求IP地址',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email_type_used` (`email`, `type`, `used`),
  INDEX `idx_expiresAt` (`expiresAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='邮箱验证码表';
