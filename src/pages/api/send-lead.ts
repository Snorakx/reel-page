import type { APIRoute } from 'astro';
import type { LeadData } from '../../types/ProjectCalculator';

// Email configuration (in production, use environment variables)
const EMAIL_CONFIG = {
  to: 'kontakt@coderno.pl',
  from: 'noreply@coderno.pl',
  subject: 'Nowe zapytanie z Kalkulatora Projektowego'
};

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const POST: APIRoute = async ({ request }) => {
  try {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Rate limiting (simple implementation)
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const limit = rateLimitStore.get(clientIP);
    
    if (limit) {
      if (now < limit.resetTime) {
        if (limit.count >= 5) { // Max 5 requests per hour
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Too many requests. Please try again later.' 
            }),
            {
              status: 429,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              },
            }
          );
        }
        limit.count++;
      } else {
        // Reset counter after 1 hour
        rateLimitStore.set(clientIP, { count: 1, resetTime: now + 3600000 });
      }
    } else {
      rateLimitStore.set(clientIP, { count: 1, resetTime: now + 3600000 });
    }

    // Parse and validate request body
    let leadData: LeadData;
    try {
      leadData = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON format' 
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validate required fields
    const validationError = validateLeadData(leadData);
    if (validationError) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: validationError 
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Generate email content
    const emailContent = generateEmailContent(leadData);

    // In production, integrate with email service (e.g., SendGrid, Mailgun, etc.)
    // For now, we'll simulate sending email and log the content
    const emailSent = await sendEmail(emailContent, leadData.contactData.email);

    if (emailSent) {
      // Log successful lead for analytics
      console.log(`Lead received: ${leadData.contactData.email} - ${leadData.projectType} - ${formatPrice(leadData.totalCost)}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Lead submitted successfully' 
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      throw new Error('Failed to send email');
    }

  } catch (error) {
    console.error('Error processing lead:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error. Please try again later.' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
};

// Validation function
function validateLeadData(data: any): string | null {
  if (!data.projectType || typeof data.projectType !== 'string') {
    return 'Project type is required';
  }

  if (!['website', 'ecommerce', 'ai_tools', 'erp_systems'].includes(data.projectType)) {
    return 'Invalid project type';
  }

  if (!data.contactData || typeof data.contactData !== 'object') {
    return 'Contact data is required';
  }

  const { firstName, email, phone, gdprConsent } = data.contactData;

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    return 'First name is required';
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Valid email is required';
  }

  if (!phone || typeof phone !== 'string' || !/^[+]?[\d\s\-\(\)]{9,}$/.test(phone)) {
    return 'Valid phone number is required';
  }

  if (gdprConsent !== true) {
    return 'GDPR consent is required';
  }

  if (typeof data.totalCost !== 'number' || data.totalCost < 0) {
    return 'Invalid total cost';
  }

  if (!Array.isArray(data.selectedAddons)) {
    return 'Selected addons must be an array';
  }

  return null;
}

// Generate email content
function generateEmailContent(leadData: LeadData): string {
  const projectTypeNames = {
    website: 'Strona wizytówkowa typu klasycznego',
    ecommerce: 'Strona dla urzędu lub instytucji',
    ai_tools: 'Narzędzia AI i Automatyzacja',
    erp_systems: 'Systemy ERP'
  };

  const addonsText = leadData.selectedAddons.length > 0 
    ? leadData.selectedAddons.map(addon => `• ${addon.label} - ${formatPrice(addon.price)}`).join('\n')
    : 'Brak wybranych dodatków';

  return `
🆕 NOWE ZAPYTANIE Z KALKULATORA PROJEKTOWEGO

👤 DANE KONTAKTOWE:
Imię: ${leadData.contactData.firstName}
Email: ${leadData.contactData.email}
Telefon: ${leadData.contactData.phone}

📋 SZCZEGÓŁY PROJEKTU:
Typ projektu: ${projectTypeNames[leadData.projectType]}
Całkowity koszt: ${formatPrice(leadData.totalCost)}

🔧 WYBRANE DODATKI:
${addonsText}

📝 DODATKOWE UWAGI:
${leadData.notes || 'Brak dodatkowych uwag'}

📅 DATA ZGŁOSZENIA:
${new Date(leadData.timestamp).toLocaleString('pl-PL')}

---
To wiadomość została wygenerowana automatycznie przez Kalkulator Projektowy na stronie coderno.pl
  `.trim();
}

// Email sending function (placeholder - integrate with actual email service)
async function sendEmail(content: string, replyTo: string): Promise<boolean> {
  try {
    // In production, replace this with actual email service integration
    // Example with SendGrid, Mailgun, or SMTP
    
    console.log('Email Content:', content);
    console.log('Reply To:', replyTo);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // For development, always return true
    // In production, return the actual result of email sending
    return true;
    
    /*
    // Example SendGrid integration:
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: EMAIL_CONFIG.to,
      from: EMAIL_CONFIG.from,
      replyTo: replyTo,
      subject: EMAIL_CONFIG.subject,
      text: content,
      html: content.replace(/\n/g, '<br>')
    };
    
    await sgMail.send(msg);
    return true;
    */
    
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// Price formatting function
function formatPrice(price: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

// Handle OPTIONS method for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}; 