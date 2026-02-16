import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync('.env', 'utf-8');
const envConfig: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) envConfig[key.trim()] = value.trim();
});

const supabase = createClient(envConfig['VITE_SUPABASE_URL'], envConfig['VITE_SUPABASE_ANON_KEY']);

async function testLogic() {
    const { data: cats, error } = await supabase.from('categories').select('*');
    if (error) throw error;

    const testCases = [
        { category: 'men', subcategory: 'denims', expectedHint: 'For Men\'s' },
        { category: 'men', subcategory: 'apparel', expectedHint: 'Men\'s Apparel' },
        { category: 'men', subcategory: 'underwear', expectedHint: 'Men\'s Underwear' },
        { category: 'ladies', subcategory: 'denims', expectedHint: 'For Ladies' },
        { category: 'ladies', subcategory: 'apparel', expectedHint: 'Ladies Apparel' },
        { category: 'kids', subcategory: 'underwear', expectedHint: 'Boys\' Underwear' },
        { category: 'men', subcategory: 'de-hilo', expectedHint: 'De Hilo (parent Men)' }
    ];

    console.log('Testing Matching Logic:');
    console.log('-----------------------');

    for (const { category: categorySlug, subcategory: subcategorySlug, expectedHint } of testCases) {
        let targetCatIds: string[] = [];

        if (categorySlug) {
            const parentSlugs = [categorySlug];
            if (categorySlug === 'men') parentSlugs.push('mens');
            if (categorySlug === 'mens') parentSlugs.push('men');
            if (categorySlug === 'ladies') parentSlugs.push('woman');
            if (categorySlug === 'woman') parentSlugs.push('ladies');

            if (subcategorySlug) {
                const subCat = cats.find(c => {
                    const slug = c.slug.toLowerCase();
                    const matchesSubslug = slug === subcategorySlug ||
                        parentSlugs.some(ps => slug === `${ps.toLowerCase()}-${subcategorySlug?.toLowerCase()}` || slug === `${subcategorySlug?.toLowerCase()}-${ps.toLowerCase()}`) ||
                        slug === `${subcategorySlug}-${categorySlug === 'men' ? 'man' : 'woman'}`;

                    if (matchesSubslug) {
                        const parentId = c.parent;
                        if (parentId) {
                            const parent = cats.find(p => p.id === parentId);
                            if (parent) {
                                return parentSlugs.some(ps => parent.slug.toLowerCase() === ps.toLowerCase());
                            }
                        }
                        return parentSlugs.some(ps => slug.includes(ps.toLowerCase()));
                    }
                    return false;
                });

                if (subCat) {
                    targetCatIds = [subCat.id];
                } else {
                    const subcategoryParent = cats.find(c => c.slug.toLowerCase() === subcategorySlug?.toLowerCase());
                    if (subcategoryParent) {
                        const specificChild = cats.find(c =>
                            c.parent === subcategoryParent.id &&
                            (c.name.toLowerCase().includes(categorySlug.toLowerCase()) ||
                                (categorySlug === 'men' && c.name.toLowerCase().includes('mens')) ||
                                (categorySlug === 'ladies' && c.name.toLowerCase().includes('woman')))
                        );

                        if (specificChild) {
                            targetCatIds = [specificChild.id];
                        } else {
                            targetCatIds = [subcategoryParent.id];
                        }
                    }
                }
            }
        }

        const resultNames = targetCatIds.map(id => cats.find(c => c.id === id)?.name);
        console.log(`Input: cat=${categorySlug}, sub=${subcategorySlug}`);
        console.log(`  Expected: ${expectedHint}`);
        console.log(`  Result:   ${resultNames.join(', ')} (${targetCatIds.join(', ')})`);
        console.log('');
    }
}

testLogic();
