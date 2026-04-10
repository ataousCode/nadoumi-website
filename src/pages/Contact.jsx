import React from 'react';
import ContactHero from '../features/contact/components/ContactHero.jsx';
import ContactForm from '../features/contact/components/ContactForm.jsx';
import ContactInfo from '../features/contact/components/ContactInfo.jsx';
import Container from '../components/common/Container.jsx';

function Contact() {
  return (
    <div className="flex flex-col bg-white">
      <ContactHero />
      
      <div className="bg-gray-50/50 pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Form - Left Side (8 cols) */}
            <div className="lg:col-span-8">
              <ContactForm className="!bg-transparent !py-0" />
            </div>
            
            {/* Contact Info - Right Side (4 cols) */}
            <div className="lg:col-span-4 sticky top-32">
              <ContactInfo className="!bg-transparent !py-0" />
              
              {/* Additional Office Hours / Support Note */}
              <div className="mt-8 p-8 rounded-3xl border border-gray-100 bg-white shadow-premium">
                <h3 className="text-lg font-black text-gray-900 mb-4 tracking-tight">Support Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Monday — Friday</span>
                    <span className="text-gray-900 font-bold">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Saturday</span>
                    <span className="text-gray-900 font-bold">10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Sunday</span>
                    <span className="text-orange-600 font-bold uppercase tracking-widest text-[9px] flex items-center">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Contact;
