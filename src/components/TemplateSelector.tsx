
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Template } from './TemplateModal';
import { LayoutGrid, Mail, Printer } from 'lucide-react';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: string) => void;
}

// Define template categories and default templates
const EMAIL_TEMPLATES = [
  {
    id: 'email-newsletter',
    name: 'Newsletter',
    description: 'Clean newsletter layout with header, content sections, and footer',
    previewSrc: 'template-email-newsletter.png',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Newsletter</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #dee2e6;
    }
    .content {
      padding: 20px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 4px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Newsletter Title</h1>
    </div>
    <div class="content">
      <h2>Hello there!</h2>
      <p>Thank you for subscribing to our newsletter. We're excited to share the latest updates with you.</p>
      <p>Here are some highlights from this week:</p>
      <ul>
        <li>New product launch coming soon</li>
        <li>Exclusive discounts for subscribers</li>
        <li>Tips and tricks from our experts</li>
      </ul>
      <p>Don't miss out on our upcoming events!</p>
      <a href="#" class="button">Learn More</a>
    </div>
    <div class="footer">
      <p>© 2023 Your Company. All rights reserved.</p>
      <p>You're receiving this email because you signed up for our newsletter.</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">View in browser</a></p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'email-announcement',
    name: 'Announcement',
    description: 'Bold announcement layout for product launches or events',
    previewSrc: 'template-email-announcement.png',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Announcement Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      background-color: #4a148c;
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .subheader {
      background-color: #7b1fa2;
      color: white;
      padding: 10px;
      text-align: center;
      font-size: 18px;
    }
    .content {
      padding: 30px 20px;
      background-color: #ffffff;
    }
    .cta-button {
      display: block;
      background-color: #e91e63;
      color: white;
      text-decoration: none;
      padding: 15px 20px;
      margin: 30px auto;
      text-align: center;
      border-radius: 4px;
      font-weight: bold;
      width: 200px;
      text-transform: uppercase;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Big Announcement!</h1>
    </div>
    <div class="subheader">
      We're excited to share some amazing news
    </div>
    <div class="content">
      <h2>Introducing Our New Product</h2>
      <p>We are thrilled to announce the launch of our latest product that will revolutionize the way you work.</p>
      <p>After months of development and testing, it's finally here and ready for you to experience!</p>
      <p>Key features include:</p>
      <ul>
        <li>Innovative design for maximum efficiency</li>
        <li>Cutting-edge technology integration</li>
        <li>Seamless user experience</li>
        <li>Powerful performance capabilities</li>
      </ul>
      <a href="#" class="cta-button">Learn More</a>
      <p>The official launch is on <strong>October 15th</strong>, but as a valued customer, you get early access!</p>
    </div>
    <div class="footer">
      <p>© 2023 Your Company. All rights reserved.</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'email-promotional',
    name: 'Promotional',
    description: 'Effective promotional email design with clear call-to-action',
    previewSrc: 'template-email-promotional.png',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Promotional Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #ff6b6b;
      padding: 20px;
      text-align: center;
    }
    .logo {
      max-width: 150px;
    }
    .hero {
      position: relative;
      text-align: center;
    }
    .hero-image {
      width: 100%;
      max-width: 600px;
      height: auto;
    }
    .hero-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border-radius: 5px;
      width: 80%;
    }
    .content {
      padding: 20px;
    }
    .offer {
      background-color: #ffe066;
      padding: 15px;
      text-align: center;
      margin: 20px 0;
      border-radius: 5px;
    }
    .cta-button {
      display: inline-block;
      background-color: #ff6b6b;
      color: white;
      text-decoration: none;
      padding: 15px 25px;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      background-color: #333;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 12px;
    }
    .footer a {
      color: #ffe066;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://via.placeholder.com/150x50" alt="Company Logo" class="logo">
    </div>
    <div class="hero">
      <img src="https://via.placeholder.com/600x300" alt="Promotional Banner" class="hero-image">
      <div class="hero-content">
        <h1>Special Offer!</h1>
        <p>Limited time promotion just for you</p>
      </div>
    </div>
    <div class="content">
      <h2>Exclusive Summer Sale</h2>
      <p>Dear Valued Customer,</p>
      <p>Summer is here, and we're celebrating with our biggest sale of the season!</p>
      <div class="offer">
        <h2>Get 30% OFF</h2>
        <p>Use code: <strong>SUMMER30</strong> at checkout</p>
      </div>
      <p>Browse our collection of summer essentials and refresh your wardrobe with the latest trends. This offer is only available until June 30th.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="#" class="cta-button">Shop Now</a>
      </p>
    </div>
    <div class="footer">
      <p>© 2023 Your Company. All rights reserved.</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">View Online</a> | <a href="#">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>`
  }
];

const PRINT_TEMPLATES = [
  {
    id: 'flyer-event',
    name: 'Event Flyer',
    description: 'Perfect for promoting upcoming events and gatherings',
    previewSrc: 'template-print-event.png',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Flyer</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      color: #333;
      /* Print-specific settings */
      width: 8.5in;
      height: 11in;
    }
    .flyer {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background-color: #f0f4ff;
    }
    .header {
      background-color: #3b82f6;
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .title {
      font-size: 48px;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .subtitle {
      font-size: 24px;
      margin-top: 10px;
      font-weight: normal;
    }
    .content {
      padding: 40px;
      text-align: center;
    }
    .date-time {
      background-color: #dbeafe;
      padding: 20px;
      margin: 30px auto;
      max-width: 80%;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .date-time h2 {
      margin-top: 0;
      color: #1e40af;
    }
    .details {
      margin: 40px 0;
      font-size: 18px;
      line-height: 1.6;
    }
    .cta {
      background-color: #3b82f6;
      color: white;
      font-size: 24px;
      padding: 15px 30px;
      border-radius: 50px;
      display: inline-block;
      margin: 20px 0;
      text-decoration: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .footer {
      background-color: #1e40af;
      color: white;
      padding: 30px;
      text-align: center;
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
    }
    .contact {
      margin-top: 20px;
    }
    .qr-code {
      background-color: white;
      padding: 10px;
      display: inline-block;
      margin-top: 20px;
    }
    .tear-off {
      border-top: 1px dashed #999;
      margin-top: 30px;
      padding-top: 20px;
      display: flex;
      justify-content: space-around;
    }
    .tear-off-item {
      text-align: center;
      width: 100px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="flyer">
    <div class="header">
      <h1 class="title">Community Event</h1>
      <h2 class="subtitle">Join us for a day of fun and learning</h2>
    </div>
    
    <div class="content">
      <div class="date-time">
        <h2>Saturday, August 15, 2023</h2>
        <p>1:00 PM - 5:00 PM</p>
        <p>Community Center, 123 Main Street</p>
      </div>
      
      <div class="details">
        <p>Join us for an exciting community event featuring:</p>
        <ul style="text-align: left; display: inline-block;">
          <li>Interactive workshops</li>
          <li>Guest speakers</li>
          <li>Networking opportunities</li>
          <li>Refreshments and snacks</li>
        </ul>
        <p>This event is free and open to all community members!</p>
      </div>
      
      <a href="#" class="cta">Register Now</a>
      
      <div class="contact">
        <p>For more information, contact us at:</p>
        <p>info@communityevent.com | (555) 123-4567</p>
        
        <div class="qr-code">
          <img src="https://via.placeholder.com/150" alt="QR Code">
          <p>Scan to register</p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Organized by Your Community Organization</p>
      <p>www.communityorg.com</p>
      
      <div class="tear-off">
        <div class="tear-off-item">
          <strong>Event Info</strong>
          <p>Aug 15, 1-5PM</p>
        </div>
        <div class="tear-off-item">
          <strong>Contact</strong>
          <p>(555) 123-4567</p>
        </div>
        <div class="tear-off-item">
          <strong>Website</strong>
          <p>communityorg.com</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'flyer-business',
    name: 'Business Flyer',
    description: 'Professional layout for business services and promotions',
    previewSrc: 'template-print-business.png',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Business Flyer</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      color: #333;
      /* Print-specific settings */
      width: 8.5in;
      height: 11in;
    }
    .flyer {
      width: 100%;
      height: 100%;
      position: relative;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
    }
    .header {
      background-color: #0f172a;
      color: white;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .tagline {
      font-size: 16px;
      font-style: italic;
    }
    .hero {
      background-color: #e2e8f0;
      padding: 50px 30px;
      text-align: center;
    }
    .hero h1 {
      font-size: 36px;
      margin: 0 0 20px 0;
      color: #0f172a;
    }
    .hero p {
      font-size: 18px;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.5;
    }
    .services {
      display: flex;
      padding: 30px;
      justify-content: space-between;
      background-color: #ffffff;
      flex: 1;
    }
    .service {
      flex: 1;
      margin: 0 15px;
      text-align: center;
      padding: 20px;
      border-radius: 8px;
      background-color: #f8fafc;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .service h3 {
      color: #0f172a;
      margin-top: 0;
    }
    .testimonial {
      background-color: #0f172a;
      color: white;
      padding: 30px;
      text-align: center;
      font-style: italic;
    }
    .testimonial p {
      font-size: 18px;
      max-width: 700px;
      margin: 0 auto 20px auto;
    }
    .contact {
      background-color: #e2e8f0;
      padding: 30px;
      text-align: center;
    }
    .cta-button {
      display: inline-block;
      background-color: #0f172a;
      color: white;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 30px;
      font-weight: bold;
      margin-top: 15px;
    }
    .footer {
      background-color: #0f172a;
      color: white;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }
    .qr-container {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="flyer">
    <div class="header">
      <div class="logo">Business Name</div>
      <div class="tagline">Professional Services & Solutions</div>
    </div>
    
    <div class="hero">
      <h1>Elevate Your Business</h1>
      <p>We provide innovative solutions to help your business grow and thrive in today's competitive market.</p>
    </div>
    
    <div class="services">
      <div class="service">
        <h3>Strategic Consulting</h3>
        <p>Expert advice tailored to your industry and specific business challenges.</p>
      </div>
      
      <div class="service">
        <h3>Digital Marketing</h3>
        <p>Comprehensive marketing strategies to boost your online presence.</p>
      </div>
      
      <div class="service">
        <h3>Business Analytics</h3>
        <p>Data-driven insights to optimize your operations and increase profitability.</p>
      </div>
    </div>
    
    <div class="testimonial">
      <p>"Working with Business Name transformed our operations and increased our revenue by 35% in just six months."</p>
      <strong>— Jane Smith, CEO of Client Company</strong>
    </div>
    
    <div class="contact">
      <h2>Ready to Take Your Business to the Next Level?</h2>
      <p>Contact us today for a free consultation</p>
      <a href="#" class="cta-button">Get Started</a>
      <p>info@businessname.com | (555) 987-6543</p>
    </div>
    
    <div class="footer">
      <div>
        <p>Business Name LLC</p>
        <p>123 Business Avenue, Suite 200</p>
        <p>City, State 12345</p>
      </div>
      
      <div class="qr-container">
        <img src="https://via.placeholder.com/100" alt="QR Code">
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'flyer-product',
    name: 'Product Showcase',
    description: 'Highlight product features with visual emphasis',
    previewSrc: 'template-print-product.png',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Showcase Flyer</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      color: #333;
      /* Print-specific settings */
      width: 8.5in;
      height: 11in;
    }
    .flyer {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background-color: #ffffff;
    }
    .product-header {
      background-color: #4f46e5;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .product-name {
      font-size: 42px;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .product-tagline {
      font-size: 20px;
      margin-top: 10px;
      font-weight: normal;
    }
    .product-image {
      text-align: center;
      padding: 30px;
      background-color: #f5f5f5;
    }
    .product-image img {
      max-width: 80%;
      height: auto;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
    .features {
      display: flex;
      flex-wrap: wrap;
      padding: 20px;
      justify-content: space-around;
    }
    .feature {
      width: 45%;
      margin: 10px;
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    .feature h3 {
      color: #4f46e5;
      margin-top: 0;
    }
    .specifications {
      background-color: #ede9fe;
      padding: 30px;
      margin: 20px;
      border-radius: 8px;
    }
    .specifications h2 {
      color: #4f46e5;
      text-align: center;
      margin-top: 0;
    }
    .specs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .spec-item {
      display: flex;
    }
    .spec-label {
      font-weight: bold;
      width: 40%;
    }
    .pricing {
      text-align: center;
      padding: 30px;
      background-color: #4f46e5;
      color: white;
    }
    .price {
      font-size: 36px;
      font-weight: bold;
      margin: 10px 0;
    }
    .contact-info {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
    }
    .cta-button {
      display: inline-block;
      background-color: #4f46e5;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: bold;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="flyer">
    <div class="product-header">
      <h1 class="product-name">Product Name</h1>
      <h2 class="product-tagline">The Next Generation Solution</h2>
    </div>
    
    <div class="product-image">
      <img src="https://via.placeholder.com/600x400" alt="Product Image">
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>Key Feature 1</h3>
        <p>Detailed description of this amazing feature and how it benefits the user.</p>
      </div>
      
      <div class="feature">
        <h3>Key Feature 2</h3>
        <p>Detailed description of this amazing feature and how it benefits the user.</p>
      </div>
      
      <div class="feature">
        <h3>Key Feature 3</h3>
        <p>Detailed description of this amazing feature and how it benefits the user.</p>
      </div>
      
      <div class="feature">
        <h3>Key Feature 4</h3>
        <p>Detailed description of this amazing feature and how it benefits the user.</p>
      </div>
    </div>
    
    <div class="specifications">
      <h2>Technical Specifications</h2>
      <div class="specs-grid">
        <div class="spec-item">
          <div class="spec-label">Dimensions:</div>
          <div>10" × 8" × 2"</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Weight:</div>
          <div>2.5 lbs</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Material:</div>
          <div>Premium aluminum</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Battery Life:</div>
          <div>Up to 12 hours</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Warranty:</div>
          <div>2-year limited</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Connectivity:</div>
          <div>Bluetooth 5.0, WiFi</div>
        </div>
      </div>
    </div>
    
    <div class="pricing">
      <h2>Special Introductory Price</h2>
      <div class="price">$299.99</div>
      <p>Limited time offer - Regular price $349.99</p>
    </div>
    
    <div class="contact-info">
      <h3>For more information or to place an order:</h3>
      <p>sales@productcompany.com | (555) 123-4567</p>
      <p>www.productcompany.com</p>
      <a href="#" class="cta-button">Order Now</a>
    </div>
  </div>
</body>
</html>`
  }
];

const TemplateSelector = ({ isOpen, onClose, onSelect }: TemplateSelectorProps) => {
  const [activeTab, setActiveTab] = useState<string>('email');
  
  const handleSelect = (html: string) => {
    onSelect(html);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Template Gallery
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Templates
            </TabsTrigger>
            <TabsTrigger value="print" className="flex items-center">
              <Printer className="h-4 w-4 mr-2" />
              Print Templates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="mt-6">
            <ScrollArea className="h-[450px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                {EMAIL_TEMPLATES.map((template) => (
                  <div 
                    key={template.id}
                    className="border rounded-lg overflow-hidden hover:border-primary transition-all cursor-pointer hover:shadow-md"
                    onClick={() => handleSelect(template.html)}
                  >
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      {/* In a real app, use actual preview images */}
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                        <Mail className="h-12 w-12 opacity-20" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="print" className="mt-6">
            <ScrollArea className="h-[450px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                {PRINT_TEMPLATES.map((template) => (
                  <div 
                    key={template.id}
                    className="border rounded-lg overflow-hidden hover:border-primary transition-all cursor-pointer hover:shadow-md"
                    onClick={() => handleSelect(template.html)}
                  >
                    <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                      {/* In a real app, use actual preview images */}
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                        <Printer className="h-12 w-12 opacity-20" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;
