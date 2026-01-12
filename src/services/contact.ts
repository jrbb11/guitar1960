import { supabase } from '../lib/supabase';

export interface ContactMessage {
    id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at?: string;
}

/**
 * Submit a contact form message
 * Stores in Supabase contact_messages table
 */
export async function submitContactForm(data: Omit<ContactMessage, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
        .from('contact_messages')
        .insert({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
        });

    if (error) {
        console.error('Error submitting contact form:', error);
        throw new Error('Failed to submit message. Please try again.');
    }
}
