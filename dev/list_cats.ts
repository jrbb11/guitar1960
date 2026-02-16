import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envConfig: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envConfig[key.trim()] = value.trim();
    }
});

const supabaseUrl = envConfig['VITE_SUPABASE_URL'];
const supabaseAnonKey = envConfig['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAllCategories() {
    const { data: cats, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('ID | Name | Slug | Parent');
    console.log('---|------|------|-------');
    cats.forEach(c => {
        const parentName = cats.find(p => p.id === c.parent)?.name || 'None';
        console.log(`${c.id} | ${c.name} | ${c.slug} | ${parentName} (${c.parent || 'None'})`);
    });
}

listAllCategories();
