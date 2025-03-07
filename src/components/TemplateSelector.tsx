
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { GmailTemplate, gmailSignatureTemplates } from './GmailTemplates';

interface TemplateData {
  id: string;
  name: string;
  html: string;
  category: string;
  thumbnail: string;
}

const emailTemplates: TemplateData[] = [
  {
    id: "email-1",
    name: "Simple Newsletter",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
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
      <h1>Welcome to Our Newsletter</h1>
    </div>
    <div class="content">
      <h2>Hello there!</h2>
      <p>Thank you for subscribing to our newsletter. We're excited to share the latest updates with you.</p>
      <p>Here are some highlights from this week:</p>
      <ul>
        <li>New product launch coming soon</li>
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
</html>`,
    category: "email",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23ffffff'/%3E%3Crect x='20' y='20' width='160' height='40' fill='%23f8f9fa'/%3E%3Ctext x='100' y='45' font-family='Arial' font-size='12' text-anchor='middle' fill='%23333333'%3ENewsletter Header%3C/text%3E%3Crect x='20' y='60' width='160' height='180' fill='%23ffffff'/%3E%3Ctext x='30' y='80' font-family='Arial' font-size='10' fill='%23333333'%3EHello there!%3C/text%3E%3Cline x1='30' y1='90' x2='170' y2='90' stroke='%23eeeeee' stroke-width='1'/%3E%3Crect x='30' y='100' width='140' height='2' fill='%23eeeeee'/%3E%3Crect x='30' y='110' width='140' height='2' fill='%23eeeeee'/%3E%3Crect x='30' y='120' width='140' height='2' fill='%23eeeeee'/%3E%3Crect x='30' y='140' width='5' height='5' fill='%23333333'/%3E%3Crect x='30' y='155' width='5' height='5' fill='%23333333'/%3E%3Crect x='30' y='170' width='5' height='5' fill='%23333333'/%3E%3Crect x='30' y='200' width='70' height='20' rx='4' fill='%23007bff'/%3E%3Ctext x='65' y='214' font-family='Arial' font-size='10' text-anchor='middle' fill='%23ffffff'%3ELearn More%3C/text%3E%3Crect x='20' y='240' width='160' height='40' fill='%23f8f9fa'/%3E%3Ctext x='100' y='265' font-family='Arial' font-size='8' text-anchor='middle' fill='%236c757d'%3E© 2023 Your Company%3C/text%3E%3C/svg%3E"
  },
  {
    id: "email-2",
    name: "Product Announcement",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Announcement Email</title>
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
    .product-image {
      max-width: 100%;
      height: auto;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      background-color: #28a745;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 4px;
      margin-top: 10px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Introducing Our New Product!</h1>
    </div>
    <div class="content">
      <h2>Check out the latest innovation</h2>
      <img src="https://via.placeholder.com/600x300" alt="Product Image" class="product-image">
      <p>We're excited to announce the launch of our new product, designed to make your life easier and more efficient.</p>
      <p>Here are some key features:</p>
      <ul>
        <li>Feature 1: Solves problem A</li>
        <li>Feature 2: Improves efficiency by X%</li>
        <li>Feature 3: Integrates seamlessly with your workflow</li>
      </ul>
      <a href="#" class="button">Learn More</a>
    </div>
    <div class="footer">
      <p>© 2023 Your Company. All rights reserved.</p>
      <p>You're receiving this email because you're a valued customer.</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">View in browser</a></p>
    </div>
  </div>
</body>
</html>`,
    category: "email",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23ffffff'/%3E%3Crect x='20' y='20' width='160' height='40' fill='%23f8f9fa'/%3E%3Ctext x='100' y='45' font-family='Arial' font-size='12' text-anchor='middle' fill='%23333333'%3EProduct Announcement%3C/text%3E%3Crect x='20' y='60' width='160' height='120' fill='%23ffffff'/%3E%3Crect x='30' y='70' width='140' height='60' fill='%23dddddd'/%3E%3Ctext x='100' y='95' font-family='Arial' font-size='10' text-anchor='middle' fill='%23555555'%3EProduct Image%3C/text%3E%3Crect x='30' y='140' width='5' height='5' fill='%23333333'/%3E%3Crect x='30' y='155' width='5' height='5' fill='%23333333'/%3E%3Crect x='30' y='170' width='5' height='5' fill='%23333333'/%3E%3Crect x='30' y='200' width='70' height='20' rx='4' fill='%2328a745'/%3E%3Ctext x='65' y='214' font-family='Arial' font-size='10' text-anchor='middle' fill='%23ffffff'%3ELearn More%3C/text%3E%3Crect x='20' y='240' width='160' height='40' fill='%23f8f9fa'/%3E%3Ctext x='100' y='265' font-family='Arial' font-size='8' text-anchor='middle' fill='%236c757d'%3E© 2023 Your Company%3C/text%3E%3C/svg%3E"
  },
  {
    id: "email-3",
    name: "Event Invitation",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Invitation Email</title>
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
      background-color: #ffc107;
      padding: 20px;
      text-align: center;
      color: #fff;
    }
    .content {
      padding: 20px;
    }
    .event-details {
      margin-bottom: 20px;
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
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You're Invited!</h1>
      <p>Join us for our annual event</p>
    </div>
    <div class="content">
      <h2>Annual Networking Event</h2>
      <div class="event-details">
        <p><strong>Date:</strong> February 24, 2023</p>
        <p><strong>Time:</strong> 6:00 PM - 9:00 PM</p>
        <p><strong>Location:</strong> The Grand Ballroom</p>
      </div>
      <p>We're excited to invite you to our annual networking event, where you'll have the opportunity to connect with industry leaders and learn about the latest trends.</p>
      <a href="#" class="button">Register Now</a>
    </div>
    <div class="footer">
      <p>© 2023 Your Company. All rights reserved.</p>
      <p>You're receiving this email because you're a valued member of our community.</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">View in browser</a></p>
    </div>
  </div>
</body>
</html>`,
    category: "email",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23ffffff'/%3E%3Crect x='20' y='20' width='160' height='40' fill='%23ffc107'/%3E%3Ctext x='100' y='45' font-family='Arial' font-size='12' text-anchor='middle' fill='%23ffffff'%3EEvent Invitation%3C/text%3E%3Crect x='20' y='60' width='160' height='120' fill='%23ffffff'/%3E%3Ctext x='30' y='80' font-family='Arial' font-size='10' fill='%23333333'%3EDate: February 24, 2023%3C/text%3E%3Ctext x='30' y='95' font-family='Arial' font-size='10' fill='%23333333'%3ETime: 6:00 PM - 9:00 PM%3C/text%3E%3Ctext x='30' y='110' font-family='Arial' font-size='10' fill='%23333333'%3ELocation: The Grand Ballroom%3C/text%3E%3Crect x='30' y='140' width='70' height='20' rx='4' fill='%23007bff'/%3E%3Ctext x='65' y='154' font-family='Arial' font-size='10' text-anchor='middle' fill='%23ffffff'%3ERegister Now%3C/text%3E%3Crect x='20' y='240' width='160' height='40' fill='%23f8f9fa'/%3E%3Ctext x='100' y='265' font-family='Arial' font-size='8' text-anchor='middle' fill='%236c757d'%3E© 2023 Your Company%3C/text%3E%3C/svg%3E"
  },
];

const printTemplates: TemplateData[] = [
  {
    id: "print-1",
    name: "Business Letter",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Business Letter</title>
  <style>
    @page {
      size: letter;
      margin: 1in;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    .letterhead {
      text-align: center;
      margin-bottom: 1in;
    }
    .date {
      margin-bottom: 0.5in;
    }
    .inside-address {
      margin-bottom: 0.25in;
    }
    .salutation {
      margin-bottom: 0.25in;
    }
    .body {
      margin-bottom: 0.5in;
    }
    .closing {
      margin-bottom: 0.5in;
    }
    .signature {
      margin-bottom: 0.25in;
      height: 0.5in;
    }
  </style>
</head>
<body>
  <div class="letterhead">
    <h1>Your Company Name</h1>
    <p>123 Main Street, Anytown, ST 12345</p>
    <p>Phone: (123) 456-7890 | Email: info@example.com</p>
  </div>
  
  <div class="date">
    <p>January 1, 2023</p>
  </div>
  
  <div class="inside-address">
    <p>John Smith<br>
    Acme Corporation<br>
    456 Business Ave<br>
    Businesstown, ST 67890</p>
  </div>
  
  <div class="salutation">
    <p>Dear Mr. Smith:</p>
  </div>
  
  <div class="body">
    <p>I am writing to express my interest in the position of Marketing Manager that was advertised on your company website. With over five years of experience in digital marketing and a proven track record of successful campaigns, I believe I would be a valuable addition to your team.</p>
    
    <p>Throughout my career, I have developed expertise in social media marketing, content creation, and analytics. I have consistently exceeded KPIs and helped my previous employers increase their online presence and customer engagement.</p>
    
    <p>I am particularly impressed with Acme Corporation's innovative approach to product development and your commitment to sustainability. I am confident that my skills and experience align well with your company's values and objectives.</p>
    
    <p>I have attached my resume for your review and would welcome the opportunity to discuss my application further in an interview. Thank you for your time and consideration.</p>
  </div>
  
  <div class="closing">
    <p>Sincerely,</p>
  </div>
  
  <div class="signature">
    <!-- Signature space -->
  </div>
  
  <div class="printed-name">
    <p>Your Name<br>
    Your Title</p>
  </div>
</body>
</html>`,
    category: "print",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23ffffff'/%3E%3Ctext x='100' y='30' font-family='Times New Roman' font-size='12' text-anchor='middle' fill='%23000000'%3EYour Company Name%3C/text%3E%3Ctext x='100' y='42' font-family='Times New Roman' font-size='8' text-anchor='middle' fill='%23000000'%3E123 Main Street, Anytown, ST 12345%3C/text%3E%3Ctext x='20' y='70' font-family='Times New Roman' font-size='8' fill='%23000000'%3EJanuary 1, 2023%3C/text%3E%3Ctext x='20' y='90' font-family='Times New Roman' font-size='8' fill='%23000000'%3EJohn Smith%3C/text%3E%3Ctext x='20' y='100' font-family='Times New Roman' font-size='8' fill='%23000000'%3EAcme Corporation%3C/text%3E%3Ctext x='20' y='130' font-family='Times New Roman' font-size='8' fill='%23000000'%3EDear Mr. Smith:%3C/text%3E%3Crect x='20' y='140' width='160' height='2' fill='%23eeeeee'/%3E%3Crect x='20' y='150' width='160' height='2' fill='%23eeeeee'/%3E%3Crect x='20' y='160' width='160' height='2' fill='%23eeeeee'/%3E%3Crect x='20' y='170' width='160' height='2' fill='%23eeeeee'/%3E%3Crect x='20' y='190' width='160' height='2' fill='%23eeeeee'/%3E%3Ctext x='20' y='240' font-family='Times New Roman' font-size='8' fill='%23000000'%3ESincerely,%3C/text%3E%3Ctext x='20' y='270' font-family='Times New Roman' font-size='8' fill='%23000000'%3EYour Name%3C/text%3E%3C/svg%3E"
  },
];

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: string) => void;
}

const TemplateSelector = ({ isOpen, onClose, onSelect }: TemplateSelectorProps) => {
  const [activeTab, setActiveTab] = useState("email");

  const handleTemplateSelect = (template: TemplateData | GmailTemplate) => {
    onSelect(template.html);
    onClose();
  };

  const copyToClipboard = (html: string) => {
    navigator.clipboard.writeText(html)
      .then(() => {
        toast.success("Gmail signature copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] h-[80vh] max-h-[700px] animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl">Choose a Template</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email Templates</TabsTrigger>
            <TabsTrigger value="print">Print Templates</TabsTrigger>
            <TabsTrigger value="gmail">Gmail Signatures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="mt-4">
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                {emailTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="relative pb-[150%] overflow-hidden bg-muted">
                      <div 
                        className="absolute inset-0 hover:scale-105 transition-transform duration-200"
                        style={{
                          backgroundImage: `url(${template.thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium">{template.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="print" className="mt-4">
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                {printTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="relative pb-[150%] overflow-hidden bg-muted">
                      <div 
                        className="absolute inset-0 hover:scale-105 transition-transform duration-200"
                        style={{
                          backgroundImage: `url(${template.thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium">{template.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="gmail" className="mt-4">
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                {gmailSignatureTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    <div className="relative pb-[150%] overflow-hidden bg-muted">
                      <div 
                        className="absolute inset-0 hover:scale-105 transition-transform duration-200"
                        style={{
                          backgroundImage: `url(${template.thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                        onClick={() => handleTemplateSelect(template)}
                      />
                    </div>
                    <CardContent className="p-3 flex justify-between items-center">
                      <h3 className="font-medium">{template.name}</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(template.html);
                        }}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </CardContent>
                  </Card>
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
