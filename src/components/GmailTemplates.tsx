
import React from 'react';

export interface GmailTemplate {
  id: string;
  name: string;
  html: string;
  thumbnail: string;
}

export const gmailSignatureTemplates: GmailTemplate[] = [
  {
    id: "gmail-1",
    name: "Professional Clean",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Gmail Signature</title>
  <style>
    .signature-container {
      font-family: Arial, sans-serif;
      max-width: 500px;
      padding: 10px 0;
      color: #333333;
    }
    .signature-name {
      font-weight: bold;
      font-size: 16px;
      margin: 0;
      color: #2c3e50;
    }
    .signature-title {
      font-size: 14px;
      margin: 2px 0 8px 0;
      color: #7f8c8d;
    }
    .signature-company {
      font-weight: bold;
      margin: 0;
      color: #3498db;
    }
    .signature-contact {
      margin-top: 8px;
      font-size: 13px;
    }
    .signature-divider {
      border-top: 1px solid #e0e0e0;
      margin: 10px 0;
      width: 100%;
      max-width: 400px;
    }
    .social-icons {
      margin-top: 10px;
    }
    .social-icons a {
      display: inline-block;
      margin-right: 8px;
    }
    .social-icons img {
      width: 18px;
      height: 18px;
    }
  </style>
</head>
<body>
  <div class="signature-container">
    <p class="signature-name">John Doe</p>
    <p class="signature-title">Marketing Director</p>
    <p class="signature-company">Acme Corporation</p>
    <div class="signature-contact">
      <p style="margin: 2px 0;">Email: john.doe@example.com</p>
      <p style="margin: 2px 0;">Phone: (123) 456-7890</p>
      <p style="margin: 2px 0;">Website: www.example.com</p>
    </div>
    <div class="signature-divider"></div>
    <div class="social-icons">
      <a href="https://linkedin.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn"></a>
      <a href="https://twitter.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" alt="Twitter"></a>
      <a href="https://instagram.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram"></a>
    </div>
  </div>
</body>
</html>`,
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23f8f9fa'/%3E%3Crect x='20' y='30' width='160' height='50' rx='2' fill='%23ffffff' stroke='%23e0e0e0'/%3E%3Ctext x='30' y='50' font-family='Arial' font-size='12' font-weight='bold' fill='%232c3e50'%3EJohn Doe%3C/text%3E%3Ctext x='30' y='65' font-family='Arial' font-size='10' fill='%237f8c8d'%3EMarketing Director%3C/text%3E%3Cline x1='20' y1='100' x2='180' y2='100' stroke='%23e0e0e0' stroke-width='1'/%3E%3Ccircle cx='30' cy='120' r='5' fill='%233498db'/%3E%3Ccircle cx='45' cy='120' r='5' fill='%231da1f2'/%3E%3Ccircle cx='60' cy='120' r='5' fill='%23e4405f'/%3E%3C/svg%3E"
  },
  {
    id: "gmail-2",
    name: "Modern with Photo",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Gmail Signature with Photo</title>
  <style>
    .signature-container {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      max-width: 500px;
      padding: 10px 0;
      display: flex;
      align-items: center;
      color: #333333;
    }
    .signature-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-right: 15px;
      object-fit: cover;
    }
    .signature-info {
      flex-grow: 1;
    }
    .signature-name {
      font-weight: bold;
      font-size: 16px;
      margin: 0;
      color: #2c3e50;
    }
    .signature-title {
      font-size: 14px;
      margin: 2px 0;
      color: #7f8c8d;
    }
    .signature-company {
      font-weight: bold;
      margin: 0;
      color: #3498db;
    }
    .signature-contact {
      margin-top: 8px;
      font-size: 13px;
    }
    .social-icons {
      margin-top: 10px;
    }
    .social-icons a {
      display: inline-block;
      margin-right: 8px;
    }
    .social-icons img {
      width: 18px;
      height: 18px;
    }
  </style>
</head>
<body>
  <div class="signature-container">
    <img class="signature-photo" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Profile Photo">
    <div class="signature-info">
      <p class="signature-name">Sarah Johnson</p>
      <p class="signature-title">UX Designer</p>
      <p class="signature-company">Design Studios Inc.</p>
      <div class="signature-contact">
        <p style="margin: 2px 0;">Email: sarah@example.com</p>
        <p style="margin: 2px 0;">Phone: (123) 456-7890</p>
      </div>
      <div class="social-icons">
        <a href="https://linkedin.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn"></a>
        <a href="https://dribbble.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174844.png" alt="Dribbble"></a>
        <a href="https://behance.net/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174837.png" alt="Behance"></a>
      </div>
    </div>
  </div>
</body>
</html>`,
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23ffffff'/%3E%3Ccircle cx='50' cy='80' r='30' fill='%23e0e0e0'/%3E%3Ctext x='100' y='70' font-family='Arial' font-size='12' font-weight='bold' fill='%232c3e50'%3ESarah Johnson%3C/text%3E%3Ctext x='100' y='90' font-family='Arial' font-size='10' fill='%237f8c8d'%3EUX Designer%3C/text%3E%3Crect x='100' y='100' width='80' height='3' rx='1' fill='%233498db'/%3E%3Ccircle cx='100' cy='120' r='5' fill='%233498db'/%3E%3Ccircle cx='115' cy='120' r='5' fill='%23ea4c89'/%3E%3Ccircle cx='130' cy='120' r='5' fill='%231769ff'/%3E%3C/svg%3E"
  },
  {
    id: "gmail-3",
    name: "Minimal Corporate",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minimal Corporate Signature</title>
  <style>
    .signature-container {
      font-family: 'Arial', sans-serif;
      max-width: 500px;
      padding: 10px 0;
      color: #333333;
    }
    .signature-logo {
      max-height: 40px;
      margin-bottom: 10px;
    }
    .signature-name {
      font-weight: bold;
      font-size: 16px;
      margin: 0;
      color: #2c3e50;
    }
    .signature-title {
      font-size: 14px;
      margin: 2px 0 8px 0;
      color: #7f8c8d;
    }
    .signature-company {
      font-weight: bold;
      margin: 0;
      color: #3498db;
    }
    .signature-contact {
      margin-top: 8px;
      font-size: 13px;
      display: flex;
      flex-wrap: wrap;
    }
    .signature-contact p {
      margin: 2px 15px 2px 0;
    }
    .signature-divider {
      border-top: 2px solid #3498db;
      margin: 10px 0;
      width: 50px;
    }
  </style>
</head>
<body>
  <div class="signature-container">
    <img class="signature-logo" src="https://via.placeholder.com/150x40/3498db/ffffff?text=ACME+INC" alt="Company Logo">
    <div class="signature-divider"></div>
    <p class="signature-name">Michael Smith</p>
    <p class="signature-title">Chief Financial Officer</p>
    <div class="signature-contact">
      <p>Email: michael@example.com</p>
      <p>Phone: (123) 456-7890</p>
      <p>Website: www.example.com</p>
      <p>Address: 123 Business Ave, Suite 100, New York, NY</p>
    </div>
  </div>
</body>
</html>`,
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23ffffff'/%3E%3Crect x='30' y='40' width='140' height='30' rx='2' fill='%233498db'/%3E%3Cline x1='30' y1='85' x2='80' y2='85' stroke='%233498db' stroke-width='2'/%3E%3Ctext x='30' y='110' font-family='Arial' font-size='12' font-weight='bold' fill='%232c3e50'%3EMichael Smith%3C/text%3E%3Ctext x='30' y='130' font-family='Arial' font-size='10' fill='%237f8c8d'%3EChief Financial Officer%3C/text%3E%3Ctext x='30' y='155' font-family='Arial' font-size='8' fill='%23333333'%3EEmail: michael@example.com%3C/text%3E%3Ctext x='30' y='170' font-family='Arial' font-size='8' fill='%23333333'%3EPhone: (123) 456-7890%3C/text%3E%3C/svg%3E"
  },
  {
    id: "gmail-4",
    name: "Creative Colorful",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Creative Colorful Signature</title>
  <style>
    .signature-container {
      font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
      max-width: 500px;
      padding: 15px;
      background: linear-gradient(to right, #f9f9f9, #ffffff);
      border-left: 4px solid #9b59b6;
      color: #333333;
    }
    .signature-name {
      font-weight: bold;
      font-size: 18px;
      margin: 0;
      color: #9b59b6;
    }
    .signature-title {
      font-size: 14px;
      margin: 2px 0 10px 0;
      color: #8e44ad;
    }
    .signature-contact {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      margin-right: 15px;
      margin-bottom: 5px;
      font-size: 13px;
    }
    .contact-icon {
      width: 14px;
      height: 14px;
      margin-right: 5px;
      display: inline-block;
    }
    .signature-quote {
      font-style: italic;
      font-size: 13px;
      color: #7f8c8d;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed #e0e0e0;
    }
    .social-icons {
      margin-top: 10px;
    }
    .social-icons a {
      display: inline-block;
      margin-right: 8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #9b59b6;
      text-align: center;
      line-height: 24px;
    }
    .social-icons img {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      filter: brightness(0) invert(1);
    }
  </style>
</head>
<body>
  <div class="signature-container">
    <p class="signature-name">Alex Rivera</p>
    <p class="signature-title">Creative Director & Illustrator</p>
    <div class="signature-contact">
      <div class="contact-item">
        <span class="contact-icon">📧</span>
        alex@example.com
      </div>
      <div class="contact-item">
        <span class="contact-icon">📱</span>
        (123) 456-7890
      </div>
      <div class="contact-item">
        <span class="contact-icon">🌐</span>
        www.alexrivera.com
      </div>
    </div>
    <div class="social-icons">
      <a href="https://instagram.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram"></a>
      <a href="https://behance.net/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174837.png" alt="Behance"></a>
      <a href="https://pinterest.com/" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174863.png" alt="Pinterest"></a>
    </div>
    <p class="signature-quote">"Creativity takes courage." - Henri Matisse</p>
  </div>
</body>
</html>`,
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23f9f9f9'/%3E%3Crect x='20' y='40' width='4' height='200' fill='%239b59b6'/%3E%3Ctext x='35' y='70' font-family='Trebuchet MS' font-size='14' font-weight='bold' fill='%239b59b6'%3EAlex Rivera%3C/text%3E%3Ctext x='35' y='90' font-family='Trebuchet MS' font-size='10' fill='%238e44ad'%3ECreative Director%3C/text%3E%3Ccircle cx='35' cy='110' r='5' fill='%239b59b6'/%3E%3Ccircle cx='50' cy='110' r='5' fill='%239b59b6'/%3E%3Ccircle cx='65' cy='110' r='5' fill='%239b59b6'/%3E%3Cline x1='35' y1='130' x2='165' y2='130' stroke='%23e0e0e0' stroke-width='1' stroke-dasharray='3'/%3E%3Ctext x='35' y='150' font-family='Trebuchet MS' font-size='8' font-style='italic' fill='%237f8c8d'%3E"Creativity takes courage." - Henri Matisse%3C/text%3E%3C/svg%3E"
  },
  {
    id: "gmail-5",
    name: "Simple Text Only",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple Text Only Signature</title>
  <style>
    .signature-container {
      font-family: Georgia, Times, 'Times New Roman', serif;
      max-width: 500px;
      padding: 10px 0;
      color: #333333;
    }
    .signature-name {
      font-weight: bold;
      font-size: 16px;
      margin: 0;
      color: #2c3e50;
    }
    .signature-title {
      font-style: italic;
      font-size: 14px;
      margin: 2px 0 8px 0;
      color: #7f8c8d;
    }
    .signature-divider {
      border-top: 1px solid #e0e0e0;
      margin: 10px 0;
      width: 200px;
    }
    .signature-contact {
      font-size: 13px;
    }
    .signature-contact p {
      margin: 2px 0;
    }
  </style>
</head>
<body>
  <div class="signature-container">
    <p class="signature-name">Elizabeth Chen</p>
    <p class="signature-title">Senior Editor</p>
    <div class="signature-divider"></div>
    <div class="signature-contact">
      <p>elizabeth.chen@example.com</p>
      <p>(123) 456-7890</p>
      <p>Literary Magazine Inc.</p>
    </div>
  </div>
</body>
</html>`,
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23ffffff'/%3E%3Ctext x='30' y='80' font-family='Georgia' font-size='14' font-weight='bold' fill='%232c3e50'%3EElizabeth Chen%3C/text%3E%3Ctext x='30' y='100' font-family='Georgia' font-size='12' font-style='italic' fill='%237f8c8d'%3ESenior Editor%3C/text%3E%3Cline x1='30' y1='120' x2='170' y2='120' stroke='%23e0e0e0' stroke-width='1'/%3E%3Ctext x='30' y='140' font-family='Georgia' font-size='10' fill='%23333333'%3Eelizabeth.chen@example.com%3C/text%3E%3Ctext x='30' y='160' font-family='Georgia' font-size='10' fill='%23333333'%3E(123) 456-7890%3C/text%3E%3Ctext x='30' y='180' font-family='Georgia' font-size='10' fill='%23333333'%3ELiterary Magazine Inc.%3C/text%3E%3C/svg%3E"
  }
];
