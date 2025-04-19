import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { 
  FaDiscord, 
  FaFacebook, 
  FaYoutube,
  FaTwitch,
  FaTiktok
} from 'react-icons/fa';
import { Mail, MapPin } from 'lucide-react';

const SimpleContactForm = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.name.trim() || formState.name.length < 2) {
      newErrors.name = 'Numele trebuie să conțină cel puțin 2 caractere';
    }
    
    if (!formState.email.trim() || !/^\S+@\S+\.\S+$/.test(formState.email)) {
      newErrors.email = 'Adresa de email nu este validă';
    }
    
    if (!formState.subject) {
      newErrors.subject = 'Vă rugăm să selectați un subiect';
    }
    
    if (!formState.message.trim() || formState.message.length < 10) {
      newErrors.message = 'Mesajul trebuie să conțină cel puțin 10 caractere';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data being submitted:', formState);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Trimitem datele la server prin API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      
      if (!response.ok) {
        throw new Error('Eroare la trimiterea formularului');
      }
      
      toast({
        title: 'Succes!',
        description: 'Mesajul a fost trimis cu succes!',
      });
      
      console.log('Form data sent to the server:', formState);
      
      // Reset form after successful submission
      setFormState({
        name: '',
        email: '',
        subject: 'general',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Eroare',
        description: 'A apărut o eroare. Încercați din nou mai târziu.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Social media links
  const socialLinks = [
    { 
      name: 'Discord', 
      url: 'https://discord.gg/Ek4qvWE5qB', 
      icon: <FaDiscord className="mr-2 text-xl" />,
      className: 'bg-[#5865F2]/10 hover:bg-[#5865F2]/30 border-[#5865F2]/30 hover:border-[#5865F2]/50'
    },
    { 
      name: 'Twitch', 
      url: 'https://twitch.tv/MoldovaProLeague', 
      icon: <FaTwitch className="mr-2 text-xl" />,
      className: 'bg-[#9146FF]/10 hover:bg-[#9146FF]/30 border-[#9146FF]/30 hover:border-[#9146FF]/50'
    },
    { 
      name: 'YouTube', 
      url: 'https://www.youtube.com/@MoldovaProLeague', 
      icon: <FaYoutube className="mr-2 text-xl" />,
      className: 'bg-[#FF0000]/10 hover:bg-[#FF0000]/30 border-[#FF0000]/30 hover:border-[#FF0000]/50'
    },
    { 
      name: 'TikTok', 
      url: 'https://www.tiktok.com/@domnukrot', 
      icon: <FaTiktok className="mr-2 text-xl" />,
      className: 'bg-[#000000]/10 hover:bg-[#000000]/30 border-[#000000]/30 hover:border-[#000000]/50'
    }
  ];

  // Contact info
  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: 'Email',
      content: 'proleaguemoldova@gmail.com',
      link: 'mailto:proleaguemoldova@gmail.com'
    },
    {
      icon: <MapPin className="w-5 h-5 text-secondary" />,
      title: 'Locație',
      content: 'Chișinău, Republica Moldova',
      link: null
    },
    {
      icon: <FaDiscord className="w-5 h-5 text-[#5865F2]" />,
      title: 'Discord',
      content: 'discord.gg/moldovaproleague',
      link: 'https://discord.gg/Ek4qvWE5qB'
    }
  ];

  return (
    <section id="contact" className="py-16 md:py-24 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-darkBg/0 via-primary/5 to-darkBg/0"></div>
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-secondary/5 to-transparent"></div>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(139, 92, 246, 0.15) 2%, transparent 0%)', backgroundSize: '50px 50px' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div data-aos="fade-up" className="text-center mb-16">
          <h2 className="font-rajdhani font-bold text-3xl md:text-4xl text-white mb-4">
            Contactează-<span className="text-secondary">ne</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mx-auto"></div>
          <p className="mt-4 max-w-2xl mx-auto">Ai întrebări sau sugestii? Completează formularul sau alătură-te comunității noastre pe Discord.</p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Left Side - Contact Info */}
            <div className="md:col-span-5" data-aos="fade-right" data-aos-delay="100">
              <div className="sticky top-24 space-y-8">
                {/* Discord CTA */}
                <div className="bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg overflow-hidden transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]">
                  <div className="relative h-40 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/80 to-[#4752C4]/80"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaDiscord className="text-7xl text-white opacity-20" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-darkGray/90 to-transparent">
                      <h3 className="font-rajdhani font-bold text-2xl text-white">Alătură-te comunității</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="mb-6">Fii parte din cea mai mare comunitate de esports din Moldova. Discuții, turnee, evenimente și multe altele.</p>
                    <button
                      className="flex w-full items-center justify-center bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 px-4 rounded-md font-medium transition-all"
                      onClick={() => window.open('https://discord.gg/Ek4qvWE5qB', '_blank')}
                    >
                      <FaDiscord className="mr-2 text-xl" />
                      Discord MPL
                    </button>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6 space-y-4">
                  <h3 className="font-rajdhani font-bold text-xl text-white mb-4">Informații de contact</h3>
                  
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="mt-1 p-2 bg-darkBg/70 rounded-full">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{info.title}</h4>
                        {info.link ? (
                          <a 
                            href={info.link} 
                            className="text-gray-400 hover:text-primary transition-colors"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-400">{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Social Media Links */}
                <div className="bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
                  <h3 className="font-rajdhani font-bold text-xl text-white mb-4">Urmărește-ne</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social, index) => (
                      <a 
                        key={index}
                        href={social.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center ${social.className} text-white py-3 px-4 rounded-md font-medium transition-all border`}
                      >
                        {social.icon}
                        {social.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Contact Form */}
            <div className="md:col-span-7" data-aos="fade-left" data-aos-delay="200">
              <div className="bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg p-8">
                <h3 className="font-rajdhani font-bold text-2xl text-white mb-6">Trimite-ne un mesaj</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2">Nume</label>
                      <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="Numele tău"
                        style={{ color: 'white', backgroundColor: '#1a1a2e', borderColor: 'purple' }}
                        className="w-full border rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors placeholder-gray-500"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-white mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="emailul@tau.com"
                        style={{ color: 'white', backgroundColor: '#1a1a2e', borderColor: 'purple' }}
                        className="w-full border rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors placeholder-gray-500"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Subiect</label>
                    <select
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      style={{ color: 'white', backgroundColor: '#1a1a2e', borderColor: 'purple' }}
                      className="w-full border rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                    >
                      <option value="general">Întrebare generală</option>
                      <option value="tournaments">Informații turnee</option>
                      <option value="partnership">Parteneriat</option>
                      <option value="other">Altele</option>
                    </select>
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Mesaj</label>
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Mesajul tău..."
                      style={{ color: 'white', backgroundColor: '#1a1a2e', borderColor: 'purple' }}
                      className="w-full border rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors placeholder-gray-500"
                      rows={5}
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 px-4 rounded-md font-medium transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Se trimite...' : 'Trimite mesajul'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleContactForm;