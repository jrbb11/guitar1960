import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env manually
// script is in dev/, .env is in root (one level up)
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

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCategories() {
    console.log('Fetching categories...');
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${data.length} categories.`);

    // Group by name to identify duplicates
    const nameMap = new Map();
    data.forEach(cat => {
        if (!nameMap.has(cat.name)) {
            nameMap.set(cat.name, []);
        }
        nameMap.get(cat.name).push(cat);
    });

    console.log('\n--- DUPLICATES FOUND ---');
    let dupCount = 0;
    nameMap.forEach((cats, name) => {
        if (cats.length > 1) {
            dupCount++;
            console.log(`\nName: "${name}" (${cats.length} occurrences)`);
            cats.forEach((c: any) => {
                console.log(`  - ID: ${c.id}, Slug: ${c.slug}, Parent: ${c.parent || 'None'}`);
            });
        }
    });

    if (dupCount === 0) {
        console.log('No duplicates found based on name.');
    }
}

checkCategories();
