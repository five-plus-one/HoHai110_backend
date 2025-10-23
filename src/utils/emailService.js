const nodemailer = require('nodemailer');
const { SystemConfig } = require('../models');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  // 初始化邮件传输器
  async initTransporter() {
    try {
      const smtpConfig = await SystemConfig.getConfig(SystemConfig.KEYS.SMTP_CONFIG);

      if (!smtpConfig || !smtpConfig.host || !smtpConfig.user) {
        console.warn('SMTP配置未设置或不完整');
        return false;
      }

      this.transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port || 587,
        secure: smtpConfig.secure || false,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.password
        }
      });

      return true;
    } catch (error) {
      console.error('初始化邮件传输器失败:', error);
      return false;
    }
  }

  // 发送邮件
  async sendMail(to, subject, html) {
    try {
      if (!this.transporter) {
        const initialized = await this.initTransporter();
        if (!initialized) {
          throw new Error('邮件服务未配置');
        }
      }

      const smtpConfig = await SystemConfig.getConfig(SystemConfig.KEYS.SMTP_CONFIG);
      const fromName = smtpConfig.fromName || '河海大学110周年校庆';
      const fromEmail = smtpConfig.user;

      const info = await this.transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject,
        html
      });

      console.log('邮件发送成功:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('邮件发送失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 发送验证码邮件
  async sendVerificationCode(email, code, type = 'email_verification') {
    let subject = '';
    let title = '';
    let content = '';

    switch (type) {
      case 'email_verification':
        subject = '邮箱验证码';
        title = '验证您的邮箱';
        content = '您正在进行邮箱验证，验证码为：';
        break;
      case 'password_reset':
        subject = '密码重置验证码';
        title = '重置您的密码';
        content = '您正在重置密码，验证码为：';
        break;
      case 'email_change':
        subject = '邮箱更换验证码';
        title = '更换您的邮箱';
        content = '您正在更换邮箱，验证码为：';
        break;
      default:
        subject = '验证码';
        title = '验证码';
        content = '您的验证码为：';
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          .warning { color: #e74c3c; font-size: 14px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
            <p>河海大学110周年校庆</p>
          </div>
          <div class="content">
            <p>您好，</p>
            <p>${content}</p>
            <div class="code">${code}</div>
            <p>验证码有效期为 <strong>15分钟</strong>，请尽快使用。</p>
            <p class="warning">⚠ 如果这不是您本人的操作，请忽略此邮件。</p>
          </div>
          <div class="footer">
            <p>此邮件由系统自动发送，请勿直接回复。</p>
            <p>&copy; 2024 河海大学110周年校庆</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendMail(email, subject, html);
  }

  // 测试SMTP连接
  async testConnection() {
    try {
      const initialized = await this.initTransporter();
      if (!initialized) {
        return { success: false, message: 'SMTP配置未设置' };
      }

      await this.transporter.verify();
      return { success: true, message: 'SMTP连接测试成功' };
    } catch (error) {
      return { success: false, message: `SMTP连接测试失败: ${error.message}` };
    }
  }
}

// 导出单例
module.exports = new EmailService();
