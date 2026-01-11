
import { useState, useEffect } from 'react';
import phLocations from '../../data/ph-locations.json';

interface AddressSelectorProps {
    onSelect: (address: { region: string; province: string; city: string }) => void;
    defaultRegion?: string;
    defaultProvince?: string;
    defaultCity?: string;
}

// Helper to format long names for display
const formatName = (name: string) => {
    // Make title case and shorten common patterns
    return name
        .split(' ')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ')
        .replace('National Capital Region - ', 'NCR - ')
        .replace('City Of ', '')
        .replace('Municipality Of ', '');
};

export const AddressSelector = ({ onSelect, defaultRegion, defaultProvince, defaultCity }: AddressSelectorProps) => {
    const [selectedRegion, setSelectedRegion] = useState(defaultRegion || '');
    const [selectedProvince, setSelectedProvince] = useState(defaultProvince || '');
    const [selectedCity, setSelectedCity] = useState(defaultCity || '');

    // Update lists based on selection
    const provinces = selectedRegion
        ? Object.keys((phLocations.find(r => r.region_name === selectedRegion) as any)?.province_list || {})
        : [];

    const cities = selectedRegion && selectedProvince
        ? Object.keys(((phLocations.find(r => r.region_name === selectedRegion) as any)?.province_list?.[selectedProvince] as any)?.municipality_list || {})
        : [];

    // Reset child fields when parent changes
    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const region = e.target.value;
        setSelectedRegion(region);
        setSelectedProvince('');
        setSelectedCity('');
        onSelect({ region, province: '', city: '' });
    };

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const province = e.target.value;
        setSelectedProvince(province);
        setSelectedCity('');
        onSelect({ region: selectedRegion, province, city: '' });
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value;
        setSelectedCity(city);
        onSelect({ region: selectedRegion, province: selectedProvince, city });
    };

    // Sync with defaults if they change (e.g. loading from profile)
    useEffect(() => {
        if (defaultRegion) setSelectedRegion(defaultRegion);
        if (defaultProvince) setSelectedProvince(defaultProvince);
        if (defaultCity) setSelectedCity(defaultCity);
    }, [defaultRegion, defaultProvince, defaultCity]);

    const inputClass = "w-full px-3 md:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm md:text-base truncate";

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select
                    className={inputClass}
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    required
                >
                    <option value="">Select Region</option>
                    {phLocations.map((r) => (
                        <option key={r.region_name} value={r.region_name}>
                            {r.region_name === 'NCR' ? 'NCR (Metro Manila)' : r.region_name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <select
                    className={inputClass}
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    disabled={!selectedRegion}
                    required
                >
                    <option value="">Select Province</option>
                    {provinces.map((p) => (
                        <option key={p} value={p}>{formatName(p)}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City / Municipality</label>
                <select
                    className={inputClass}
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={!selectedProvince}
                    required
                >
                    <option value="">Select City</option>
                    {cities.map((c) => (
                        <option key={c} value={c}>{formatName(c)}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
