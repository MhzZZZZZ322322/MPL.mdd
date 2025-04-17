import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { insertContactSchema, type InsertContact } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  FaDiscord, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube,
  FaTwitch
} from 'react-icons/fa';
import { Mail, MapPin, Phone } from 'lucide-react';

// Extended schema with validation
const formSchema = insertContactSchema.extend({
  name: z.string().min(2, { message: 'Numele trebuie să conțină cel puțin 2 caractere' }),
  email: z.string().email({ message: 'Adresa de email nu este validă' }),
  subject: z.string().min(1, { message: 'Vă rugăm să selectați un subiect' }),
  message: z.string().min(10, { message: 'Mesajul trebuie să conțină cel puțin 10 caractere' }),
});

const Contact = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: 'Succes!',
        description: 'Mesajul a fost trimis cu succes!',
      });
      form.reset();
    },
    onError: (error: Error) => {
      console.error('Error submitting form:', error);
      toast({
        title: 'Eroare',
        description: 'A apărut o eroare. Încercați din nou mai târziu.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    mutation.mutate(data);
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
      url: '#', 
      icon: <FaYoutube className="mr-2 text-xl" />,
      className: 'bg-[#FF0000]/10 hover:bg-[#FF0000]/30 border-[#FF0000]/30 hover:border-[#FF0000]/50'
    },
    { 
      name: 'Instagram', 
      url: '#', 
      icon: <FaInstagram className="mr-2 text-xl" />,
      className: 'bg-gradient-to-r from-[#405DE6]/10 to-[#E1306C]/10 hover:from-[#405DE6]/30 hover:to-[#E1306C]/30 border-[#E1306C]/30 hover:border-[#E1306C]/50'
    }
  ];

  // Contact info
  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: 'Email',
      content: 'info@moldovaproleague.md',
      link: 'mailto:info@moldovaproleague.md'
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
                    <Button
                      className="flex w-full items-center justify-center bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 px-4 rounded-md font-medium transition-all"
                      onClick={() => window.open('https://discord.gg/Ek4qvWE5qB', '_blank')}
                    >
                      <FaDiscord className="mr-2 text-xl" />
                      Discord MPL
                    </Button>
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
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nume</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Numele tău"
                                className="w-full bg-darkBg/70 border border-primary/30 rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="emailul@tau.com"
                                className="w-full bg-darkBg/70 border border-primary/30 rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subiect</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-darkBg/70 border border-primary/30 rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors">
                                <SelectValue placeholder="Selectează un subiect" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">Întrebare generală</SelectItem>
                              <SelectItem value="tournaments">Informații turnee</SelectItem>
                              <SelectItem value="partnership">Parteneriat</SelectItem>
                              <SelectItem value="other">Altele</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mesaj</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Mesajul tău..."
                              className="w-full bg-darkBg/70 border border-primary/30 rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 px-4 rounded-md font-medium transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? 'Se trimite...' : 'Trimite mesajul'}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;