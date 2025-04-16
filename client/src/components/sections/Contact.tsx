import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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
import { FaDiscord, FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

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
      const response = await apiRequest('POST', '/api/contact', data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Succes!',
        description: data.message || 'Mesajul a fost trimis cu succes!',
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Eroare',
        description: error.message || 'A apărut o eroare. Încercați din nou mai târziu.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    mutation.mutate(data);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 transform skew-y-1"></div>
      
      <motion.div 
        className="container mx-auto px-4 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="font-rajdhani font-bold text-3xl md:text-4xl text-white mb-4">
            Contactează-<span className="text-secondary">ne</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mx-auto"></div>
          <p className="mt-4 max-w-2xl mx-auto">Ai întrebări sau sugestii? Completează formularul sau alătură-te comunității noastre pe Discord.</p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto"
          variants={itemVariants}
        >
          <div className="bg-darkGray/50 border border-primary/20 rounded-lg p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nume</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Numele tău"
                          className="w-full bg-darkBg border border-primary/30 rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
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
                          className="w-full bg-darkBg border border-primary/30 rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                          <SelectTrigger className="w-full bg-darkBg border border-primary/30 rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors">
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
                          className="w-full bg-darkBg border border-primary/30 rounded-md p-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
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
                  className="w-full bg-primary hover:bg-primary/80 text-white py-3 px-4 rounded-md font-medium transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Se trimite...' : 'Trimite mesajul'}
                </Button>
              </form>
            </Form>
          </div>
          
          <div>
            <div className="bg-darkGray/50 border border-primary/20 rounded-lg p-6 mb-6">
              <h3 className="font-rajdhani font-bold text-xl text-white mb-4">Alătură-te comunității</h3>
              <p className="mb-6">Fii parte din cea mai mare comunitate de esports din Moldova. Discuții, turnee, evenimente și multe altele.</p>
              <Button
                className="flex w-full items-center justify-center bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 px-4 rounded-md font-medium transition-all"
              >
                <FaDiscord className="mr-2 text-xl" />
                Discord MPL
              </Button>
            </div>
            
            <div className="bg-darkGray/50 border border-primary/20 rounded-lg p-6">
              <h3 className="font-rajdhani font-bold text-xl text-white mb-4">Urmărește-ne</h3>
              <p className="mb-6">Fii la curent cu toate noutățile, evenimentele și turneele Moldova Pro League.</p>
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="#" 
                  className="flex items-center justify-center bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/40 text-white py-3 px-4 rounded-md font-medium transition-all border border-[#1DA1F2]/30"
                >
                  <FaTwitter className="mr-2 text-xl" />
                  Twitter
                </a>
                <a 
                  href="#" 
                  className="flex items-center justify-center bg-[#4267B2]/20 hover:bg-[#4267B2]/40 text-white py-3 px-4 rounded-md font-medium transition-all border border-[#4267B2]/30"
                >
                  <FaFacebook className="mr-2 text-xl" />
                  Facebook
                </a>
                <a 
                  href="#" 
                  className="flex items-center justify-center bg-gradient-to-r from-[#405DE6]/20 to-[#E1306C]/20 hover:from-[#405DE6]/40 hover:to-[#E1306C]/40 text-white py-3 px-4 rounded-md font-medium transition-all border border-[#E1306C]/30"
                >
                  <FaInstagram className="mr-2 text-xl" />
                  Instagram
                </a>
                <a 
                  href="#" 
                  className="flex items-center justify-center bg-[#FF0000]/20 hover:bg-[#FF0000]/40 text-white py-3 px-4 rounded-md font-medium transition-all border border-[#FF0000]/30"
                >
                  <FaYoutube className="mr-2 text-xl" />
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
